'use client';

import clipboard from 'clipboardy';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { QRCodeSVG } from 'qrcode.react';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import iconBack from '@/assets/icons/back.svg';
import iconCheck from '@/assets/icons/check.svg';
import { useStore } from '@/store';

type Props = {
  onClose?: () => void;
};

export const ReceivePopup: FC<Props> = props => {
  const { t } = useTranslation();
  const { walletStore } = useStore();

  const [copied, setCopied] = useState(false);

  const close = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const copyAddress = async (address: string) => {
    await clipboard.write(address);
    const message = t('components.toast.addressCopied');
    toast.success(message);
    setCopied(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col w-fit p-8 bg-white rounded-[20px] shadow-popup">
        <div className="flex flex-row items-center">
          <button onClick={close}>
            <Image src={iconBack} width={40} height={40} alt="back" />
          </button>
          <p className="text-3xl font-semibold ml-6 text-popupTitle">
            {t('components.popups.receive')}
          </p>
        </div>
        <div className="w-[450px] flex flex-col items-center mt-4">
          <QRCodeSVG
            value={walletStore.activeAddress}
            className="w-[200px] h-[200px]"
          />
          <p className="text-lg font-semibold mt-3">
            {t('components.popups.myAddress')}
          </p>
          <p className="mt-2 text-sm text-themeTextGray">
            {walletStore.activeAddress}
          </p>
          <button
            disabled={copied}
            className={`mt-2 rounded-xl py-3 w-[156px] ${
              copied ? 'bg-black' : 'bg-themeBlue'
            }`}
            onClick={() => copyAddress(walletStore.activeAddress)}>
            {copied ? (
              <div className="flex flex-row items-center justify-center">
                <Image src={iconCheck} width={20} height={20} alt="check" />
                <p className="text-white text-base ml-2">
                  {t('components.popups.copied')}
                </p>
              </div>
            ) : (
              <p className="text-white text-base">
                {t('components.popups.copyAddress')}
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
