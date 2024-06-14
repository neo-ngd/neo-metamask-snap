'use client';

import BigNumber from 'bignumber.js';
import clipboard from 'clipboardy';
import { observer, useLocalObservable } from 'mobx-react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import { toast } from 'react-toastify';
import iconCopy from '@/assets/icons/copy.svg';
import iconInvisible from '@/assets/icons/invisible.svg';
import profileImage from '@/assets/icons/profile.svg';
import iconReceive from '@/assets/icons/qrcode.svg';
import iconSend from '@/assets/icons/send.svg';
import iconShare from '@/assets/icons/share.svg';
import iconVisible from '@/assets/icons/visible.svg';
import { useStore } from '@/store';
import { integerToDecimal, toMiddleEllipsisText } from '@/utils/convertors';
import { getNeoBrowserAddressUrl } from '@/utils/urls';
import { INVISIBLE_TOTAL_BALANCE } from '@/utils/values';
import { ReceivePopup } from '../components/popups/ReceivePopup';
import { SendPopup } from '../components/popups/SendPopup';
import { TransactionPopup } from '../components/popups/TransactionPopup';

export const WalletDetail: FC = observer(() => {
  const { t } = useTranslation();
  const { assetStore, walletStore, uiStore } = useStore();

  const listHolder = useLocalObservable(() => ({
    get totalBalance() {
      const balanceList = walletStore.activeNep17Balances.map(b => {
        const asset = assetStore.assets.find(
          a => a.contractHash === b.contractHash,
        );
        const price = assetStore.assetPrices.find(
          p => p.contractHash === b.contractHash,
        );
        const decimals = asset ? asset.decimals : 0;
        const amount = integerToDecimal(b.amount, decimals);
        const amountNumber = new BigNumber(amount ?? '0');
        const priceNumber = price ? price.price : 0;
        return amountNumber.times(priceNumber);
      });
      const result = balanceList.reduce(
        (sum, value) => sum.plus(value),
        new BigNumber(0),
      );
      return result.toFormat(2);
    },
  }));

  const copyAddress = async (address: string) => {
    await clipboard.write(address);
    const message = t('components.toast.addressCopied');
    toast.success(message);
  };

  const shareInBrowser = (address: string) => {
    const baseUrl = getNeoBrowserAddressUrl();
    const url = baseUrl.replace('{0}', address);
    window.open(url, '_blank');
  };

  const changeAssetsVisible = (visible: boolean) => {
    walletStore.saveAssetsVisible(visible);
  };

  const getWalletTotalBalanceText = () => {
    if (walletStore.assetsVisible) {
      return `$${listHolder.totalBalance}`;
    }
    return INVISIBLE_TOTAL_BALANCE;
  };

  const closePopup = () => {
    uiStore.clearCover();
  };

  const closeTransaction = () => {
    uiStore.clearCover();
    walletStore.fetchActiveBalances();
  };

  const showReceivePopup = () => {
    uiStore.setCover(<ReceivePopup onClose={closePopup} />);
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

  return (
    <div className="flex flex-col items-center mt-[50px]">
      <div className="flex flex-row items-center justify-between min-w-asset rounded-[18px] border-[#edf2f7] border shadow-asset py-3 px-6">
        <div className="flex flex-row items-center">
          <Image src={profileImage} width={60} height={60} alt="profile" />
          <div className="flex flex-col ml-3 items-start justify-center">
            <div className="flex flex-row items-center">
              <p className="text-sm text-themeTextGray">
                {toMiddleEllipsisText(walletStore.activeAddress, 12)}
              </p>
              <button
                className="ml-2"
                onClick={() => copyAddress(walletStore.activeAddress)}>
                <Image src={iconCopy} width={16} height={16} alt="copy" />
              </button>
              <button
                className="ml-2"
                onClick={() => shareInBrowser(walletStore.activeAddress)}>
                <Image src={iconShare} width={16} height={16} alt="share" />
              </button>
            </div>
            <div className="flex flex-row items-center">
              <p className="text-[28px] text-black">
                {walletStore.assetsVisible
                  ? getWalletTotalBalanceText()
                  : INVISIBLE_TOTAL_BALANCE}
              </p>
              <button
                onClick={() => changeAssetsVisible(!walletStore.assetsVisible)}>
                <Image
                  src={walletStore.assetsVisible ? iconVisible : iconInvisible}
                  width={36}
                  height={36}
                  alt="eye"
                />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <button
            className="flex flex-row items-center px-6 py-3 rounded-xl bg-themeBlue mr-5"
            onClick={() => showSendPopup('')}>
            <Image src={iconSend} width={20} height={20} alt="send" />
            <p className="text-base text-white ml-1.5">{t('wallet.send')}</p>
          </button>
          <button
            className="flex flex-row items-center px-6 py-3 rounded-xl bg-themeBlue"
            onClick={showReceivePopup}>
            <Image src={iconReceive} width={20} height={20} alt="receive" />
            <p className="text-base text-white ml-1.5">{t('wallet.receive')}</p>
          </button>
        </div>
      </div>
    </div>
  );
});
