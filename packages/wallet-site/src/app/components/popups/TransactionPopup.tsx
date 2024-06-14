'use client';

import { observer } from 'mobx-react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import iconBack from '@/assets/icons/back.svg';
import { useStore } from '@/store';
import { getRawTransactionByTransactionHash } from '@/utils/httpApi';

export type txState = 'none' | 'pending' | 'success' | 'failed';

type Props = {
  txid: string;
  onClose?: () => void;
};

export const TransactionPopup: FC<Props> = observer(props => {
  const { t } = useTranslation();
  const { transferStore } = useStore();

  const [txState, setTxState] = useState<txState>('none');

  useEffect(() => {
    const transfer = transferStore.confirmingNep17Transfers.find(
      t => t.txid === props.txid,
    );
    if (transfer) {
      setTxState('pending');
      return;
    }

    (async () => {
      try {
        const tx = await getRawTransactionByTransactionHash(props.txid);
        if (tx.status === 'succeeded') {
          setTxState('success');
        } else if (tx.status === 'failed') {
          setTxState('failed');
        }
      } catch (error) {
        // not comfirmed
      }
    })();
  }, [props, transferStore.confirmingNep17Transfers]);

  const close = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const renderTitleText = () => {
    if (txState === 'pending') {
      return (
        <p className="text-3xl font-semibold ml-6 text-popupTitle">
          {t('components.popups.sending')}
        </p>
      );
    } else if (txState === 'success') {
      return (
        <p className="text-3xl font-semibold ml-6 text-themeGreen">
          {t('components.popups.sendSuccess')}
        </p>
      );
    } else if (txState === 'failed') {
      return (
        <p className="text-3xl font-semibold ml-6 text-themeRed">
          {t('components.popups.sendFailure')}
        </p>
      );
    }
    return null;
  };

  const renderTxDesc = () => {
    let txDesc = '';
    if (txState === 'pending') {
      txDesc = t('components.popups.txSending');
    } else if (txState === 'success') {
      txDesc = t('components.popups.txSuccess');
    } else if (txState === 'failed') {
      txDesc = t('components.popups.txFailed');
    }

    if (!txDesc) {
      return null;
    }

    return (
      <p className="w-[400px] text-xl leading-8 my-10 text-popupDesc self-center text-center">
        {txDesc}
      </p>
    );
  };

  const renderCloseButton = () => {
    const buttonText = t('components.popups.close');
    if (txState === 'success') {
      return (
        <button
          onClick={close}
          className="flex w-[478px] justify-center items-center py-4 rounded-xl bg-themeGreen">
          <p className="text-xl leading-8 text-white">{buttonText}</p>
        </button>
      );
    } else if (txState === 'failed') {
      return (
        <button
          onClick={close}
          className="flex w-[478px] justify-center items-center py-4 rounded-xl bg-themeRed">
          <p className="text-xl leading-8 text-white">{buttonText}</p>
        </button>
      );
    }
    return (
      <button
        onClick={close}
        className="flex w-[478px] justify-center items-center py-4 rounded-xl bg-black">
        <p className="text-xl leading-8 text-white">{buttonText}</p>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col w-fit p-8 bg-white rounded-[20px] shadow-popup">
        <div className="flex flex-row items-center">
          <button onClick={close}>
            <Image src={iconBack} width={40} height={40} alt="back" />
          </button>
          {renderTitleText()}
        </div>
        {renderTxDesc()}
        {renderCloseButton()}
      </div>
    </div>
  );
});
