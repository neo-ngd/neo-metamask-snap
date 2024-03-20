'use client';

import { observer } from 'mobx-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { TransactionConfirmToast } from '@/app/components/popups/TransactionConfirmToast';
import { useStore } from '@/store';
import { getRawTransactionByTransactionHash } from '@/utils/httpApi';

export const ConfirmingTransferChecker = observer(
  ({ children }: { children: ReactNode }) => {
    const { transferStore } = useStore();

    useEffect(() => {
      // confirm transfer per 5s
      const interval = setInterval(async () => {
        const confirmingTxids = transferStore.confirmingNep17Transfers.map(
          ct => ct.txid,
        );
        if (confirmingTxids.length <= 0) {
          return;
        }
        const txidPromises = confirmingTxids.map(async ctx => {
          const response = await getRawTransactionByTransactionHash(ctx);
          return {
            ctx,
            response,
          };
        });
        const result = await Promise.all(txidPromises);
        result.forEach(txr => {
          if (txr.response) {
            const txState = txr.response.status;
            if (txState === 'confirming') {
              // not confirmed, do nothing
            } else if (txState === 'failed') {
              toast.error(
                <TransactionConfirmToast success={false} txid={txr.ctx} />,
              );
              transferStore.deleteConfirming(txr.ctx);
            } else if (txState === 'succeeded') {
              toast.success(
                <TransactionConfirmToast success={true} txid={txr.ctx} />,
              );
              transferStore.deleteConfirming(txr.ctx);
            }
          }
        });
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }, [transferStore]);

    return children;
  },
);
