import BigNumber from 'bignumber.js';
import { observer } from 'mobx-react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import { useState } from 'react';
import iconSend from '@/assets/icons/send.svg';
import iconSendBlue from '@/assets/icons/sendBlue.svg';
import { useStore } from '@/store';
import type { Balance } from '@/utils/models';
import { INVISIBLE_ASSET, UNKNOWN_SYMBOL } from '@/utils/values';
import { AssetLogo } from '../AssetLogo';
import { SendPopup } from '../popups/SendPopup';
import { TransactionPopup } from '../popups/TransactionPopup';

type Props = {
  balance: Balance;
};

export const AssetCell: FC<Props> = observer(props => {
  const { t } = useTranslation();
  const { assetStore, uiStore, walletStore } = useStore();
  const [hover, setHover] = useState(false);

  const closePopup = () => {
    uiStore.clearCover();
  };

  const closeTransaction = () => {
    uiStore.clearCover();
    walletStore.fetchActiveBalances();
  };

  const showTransactionPopup = (txid: string) => {
    uiStore.setCover(
      <TransactionPopup onClose={closeTransaction} txid={txid} />,
    );
  };

  const showSendPopup = (assetHash: string) => {
    uiStore.setCover(
      <SendPopup
        assetHash={assetHash}
        onClose={closePopup}
        onSend={showTransactionPopup}
      />,
    );
  };

  const getAssetName = () => {
    const asset = assetStore.assets.find(
      a => a.contractHash === props.balance.contractHash,
    );
    return asset ? asset.symbol : UNKNOWN_SYMBOL;
  };

  const getBalanceAmount = () => {
    if (!walletStore.assetsVisible) {
      return INVISIBLE_ASSET;
    }

    const asset = assetStore.assets.find(
      a => a.contractHash === props.balance.contractHash,
    );
    if (!asset) {
      return <div>Asset not found</div>;
    }

    const amountNumber = new BigNumber(props.balance.amount);
    const balanceNumber = amountNumber.shiftedBy(-asset.decimals);
    const balanceLocale = balanceNumber.toFormat(asset.decimals);
    return balanceLocale;
  };

  const getBalanceValue = () => {
    if (!walletStore.assetsVisible) {
      return INVISIBLE_ASSET;
    }

    const asset = assetStore.assets.find(
      a => a.contractHash === props.balance.contractHash,
    );
    const assetPrice = assetStore.assetPrices.find(
      ap => ap.contractHash === props.balance.contractHash,
    );
    if (!asset || !assetPrice) {
      return UNKNOWN_SYMBOL;
    }

    const amountNumber = new BigNumber(props.balance.amount);
    const balanceNumber = amountNumber.shiftedBy(-asset.decimals);
    const priceNumber = new BigNumber(assetPrice.price);
    const valueNumber = balanceNumber.times(priceNumber);
    const valueLocale = valueNumber.toFormat(2);
    return '$' + valueLocale;
  };

  return (
    <div
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      className="group flex flex-row items-center py-2 px-6 justify-between hover:shadow-assetCell">
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center w-assetCell">
          <AssetLogo
            uri={assetStore.getAssetLogoUrl(props.balance.contractHash)}
            size={24}
          />
          <p className="ml-2 text-xl leading-8">{getAssetName()}</p>
        </div>
        <div className="flex flex-row items-center w-assetCell ml-[70px]">
          <p className="text-base leading-8 text-black">{getBalanceAmount()}</p>
        </div>
        <div className="flex flex-row items-center w-assetCell ml-[70px]">
          <p className="text-base leading-8 text-black">{getBalanceValue()}</p>
        </div>
      </div>
      <button
        onClick={() => showSendPopup(props.balance.contractHash)}
        className="flex flex-row items-center bg-transparent group-hover:bg-themeBlue rounded-xl px-6 py-3">
        <Image
          src={hover ? iconSend : iconSendBlue}
          width={20}
          height={20}
          alt="send"
        />
        <p className="text-themeBlue text-base ml-1.5 group-hover:text-white">
          {t('components.assetList.send')}
        </p>
      </button>
    </div>
  );
});
