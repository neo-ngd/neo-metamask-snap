import useTranslation from 'next-translate/useTranslation';
import type { ReactNode } from 'react';
import { getBrowserTxidUrl } from '@/utils/wallet';

export const TransactionConfirmToast = ({
  success,
  txid,
}: {
  success: boolean;
  txid: string;
}): ReactNode => {
  const { t } = useTranslation();
  const onClickTransactionHash = (hash: string) => {
    const url = getBrowserTxidUrl(hash);
    window.open(url, '_blank');
  };

  const renderToastContent = (text: string, txid: string) => {
    return (
      <div className="p-2 flex flex-row">
        <p>{text}</p>
        <button
          onClick={() => {
            onClickTransactionHash(txid);
          }}
          className="ml-2">
          <p className="underline">TXID</p>
        </button>
      </div>
    );
  };

  if (success) {
    return renderToastContent(t('components.toast.transactionSuccess'), txid);
  }

  return renderToastContent(t('components.toast.transactionFailed'), txid);
};
