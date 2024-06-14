import BigNumber from 'bignumber.js';
import clipboard from 'clipboardy';
import { observer } from 'mobx-react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import type { ChangeEvent, FC, FocusEvent, KeyboardEvent } from 'react';
import { createRef, useEffect, useState } from 'react';
import iconBack from '@/assets/icons/back.svg';
import { handleTransfer } from '@/dapi';
import { useStore } from '@/store';
import { decimalToInteger, integerToDecimal } from '@/utils/convertors';
import type { Asset } from '@/utils/models';
import { Transfer } from '@/utils/models';
import { UNKNOWN_SYMBOL } from '@/utils/values';
import {
  DefaultAssets,
  formatNumber,
  getScriptHashFromAddress,
  isValidAddress,
} from '@/utils/wallet';
import { AssetSelect } from '../AssetSelect';

type Props = {
  onClose?: () => void;
  assetHash: string;
  onSend: (txid: string) => void;
};

export const SendPopup: FC<Props> = observer(props => {
  const { t } = useTranslation();
  const { assetStore, transferStore, walletStore } = useStore();

  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset>();

  const [validAmount, setValidAmount] = useState(true);
  const [validToAddress, setValidToAddress] = useState(true);

  const toAddressRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (props.assetHash) {
      const asset = assetStore.assets.find(
        a => a.contractHash === props.assetHash,
      );
      if (asset) {
        setSelectedAsset(asset);
      } else {
        setSelectedAsset(DefaultAssets[0]);
      }
    } else {
      setSelectedAsset(DefaultAssets[0]);
    }
  }, [props.assetHash, assetStore.assets]);

  const getSelectedAssetBalance = () => {
    if (selectedAsset) {
      const balance = walletStore.activeBalances.find(
        b => b.contractHash === selectedAsset.contractHash,
      );
      if (balance) {
        const balanceStr = integerToDecimal(
          balance.amount,
          selectedAsset.decimals,
        );
        return balanceStr ?? UNKNOWN_SYMBOL;
      }
      return '0';
    }
    return '0';
  };

  const close = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const sendDisabled = () => {
    if (!selectedAsset) {
      return true;
    }

    if (!amount || !validAmount) {
      return true;
    }

    if (!toAddress || !validToAddress) {
      return true;
    }

    return false;
  };

  const onSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const validateAmount = (value: string) => {
    if (!selectedAsset) {
      setValidAmount(false);
      return;
    }
    const balance = walletStore.activeNep17Balances.find(
      b => b.contractHash === selectedAsset.contractHash,
    );
    if (!balance) {
      setValidAmount(false);
      return;
    }

    const formatted = formatNumber(value, selectedAsset.decimals);
    const currentAmount = new BigNumber(formatted || '0');
    const balanceAmount = integerToDecimal(
      balance.amount,
      selectedAsset.decimals,
    );
    const totalAmount = new BigNumber(balanceAmount ?? 0);

    const valid =
      currentAmount.isGreaterThan(0) &&
      currentAmount.isLessThanOrEqualTo(totalAmount);
    setValidAmount(valid);
  };

  const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value;
    const formated = formatNumber(
      newAmount,
      selectedAsset ? selectedAsset.decimals : 0,
    );
    setAmount(formated);
    validateAmount(formated);
  };

  const onAmountConfirmByKeyboard = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Enter') {
      return;
    }
    const amountNumber = new BigNumber(amount);
    const formated = amountNumber.isNaN() ? '' : amountNumber.toFormat();
    setAmount(formated);
  };

  const onAmountConfirm = (event: FocusEvent<HTMLInputElement, Element>) => {
    const amountNumber = new BigNumber(event.target.value);
    const formated = amountNumber.isNaN() ? '' : amountNumber.toFormat();
    setAmount(formated);
  };

  const fillAmount = () => {
    const maxAmount = getSelectedAssetBalance();
    const amountNumber = new BigNumber(maxAmount);
    const formated = amountNumber.isNaN() ? '' : amountNumber.toFormat();
    setAmount(formated);
    validateAmount(formated);
  };

  const onPasteToAddressChange = async () => {
    const address = await clipboard.read();
    setToAddress(address);
    if (toAddressRef?.current) {
      toAddressRef.current.focus();
    }
  };

  const onToAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setToAddress(event.target.value);
  };

  const onToAddressConfirm = () => {
    const formatAddress = toAddress.trim();
    setToAddress(formatAddress);
    const valid = isValidAddress(formatAddress);
    setValidToAddress(valid);
  };

  const onToAddressConfirmByKeyboard = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Enter') {
      return;
    }
    onToAddressConfirm();
  };

  const onSend = async () => {
    validateAmount(amount);
    onToAddressConfirm();
    if (sendDisabled()) {
      return;
    }
    if (!selectedAsset) {
      return;
    }
    const assetHash = selectedAsset.contractHash;
    const txFromAddress = getScriptHashFromAddress(walletStore.activeAddress);
    const txToAddress = getScriptHashFromAddress(toAddress);
    const transferBalance = decimalToInteger(
      formatNumber(amount, selectedAsset.decimals),
      selectedAsset.decimals,
    );

    const result = await handleTransfer(
      txFromAddress,
      txToAddress,
      transferBalance ?? '0',
      assetHash,
    );

    // create new Transfer
    const ts = new Transfer();
    ts.contract = selectedAsset.contractHash;
    ts.from = txFromAddress;
    ts.to = txToAddress;
    ts.value = transferBalance ?? '0';
    ts.txid = result.txid;
    ts.timestamp = Date.now();
    transferStore.addConfirmingTransfer(ts);
    props.onSend(result.txid);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col w-fit p-8 bg-white rounded-[20px] shadow-popup">
        <div className="flex flex-row items-center">
          <button onClick={close}>
            <Image src={iconBack} width={40} height={40} alt="back" />
          </button>
          <p className="text-3xl font-semibold ml-6 text-popupTitle">
            {t('components.popups.send')}
          </p>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between">
              <p className="text-xl leading-6 text-black">
                {t('components.popups.asset')}
              </p>
              <p
                onClick={fillAmount}
                className="text-sm text-themePlaceholderTextGray underline cursor-pointer">
                {t('components.popups.wallet') + getSelectedAssetBalance()}
              </p>
            </div>
            <div className="mt-4 flex flex-row items-center">
              <div>
                <AssetSelect
                  selectedHash={selectedAsset ? selectedAsset.contractHash : ''}
                  onSelect={onSelectAsset}
                />
              </div>
              <div
                className={`flex ml-2.5 w-full bg-networkSelectBack py-4 px-3 rounded-xl border ${
                  validAmount ? 'border-transparent' : 'border-themeRed'
                }`}>
                <input
                  className="w-full px-1 bg-transparent outline-0 text-right text-xl caret-black text-black placeholder:text-themePlaceholderTextGray placeholder:text-left placeholder:text-sm"
                  value={amount}
                  onKeyDown={onAmountConfirmByKeyboard}
                  onBlur={onAmountConfirm}
                  onChange={onAmountChange}
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xl leading-6 text-black">
              {t('components.popups.sendTo')}
            </p>
            <div
              className={`mt-4 flex flex-row items-center bg-networkSelectBack rounded-xl py-4 px-3 border ${
                validToAddress ? 'border-transparent' : 'border-themeRed'
              }`}>
              <input
                ref={toAddressRef}
                className="w-full px-1 bg-transparent outline-0 text-xl caret-black text-black placeholder:text-themePlaceholderTextGray placeholder:text-sm"
                type="text"
                value={toAddress}
                placeholder={t('components.popups.address')}
                onKeyDown={onToAddressConfirmByKeyboard}
                onBlur={onToAddressConfirm}
                onChange={onToAddressChange}
              />
              <button onClick={onPasteToAddressChange} className="ml-3">
                <p className="text-black text-xl">
                  {t('components.popups.paste')}
                </p>
              </button>
            </div>
          </div>
          <button
            disabled={sendDisabled()}
            onClick={onSend}
            className="mt-4 w-[478px] py-4 flex bg-themeBlue disabled:bg-themeGray justify-center items-center rounded-xl">
            <p className="text-xl text-white">{t('components.popups.send')}</p>
          </button>
        </div>
      </div>
    </div>
  );
});
