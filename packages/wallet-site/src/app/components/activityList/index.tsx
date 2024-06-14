'use client';

import { observer } from 'mobx-react';
import useTranslation from 'next-translate/useTranslation';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useStore } from '@/store';
import { toStandardHex } from '@/utils/convertors';
import { getNep17TransferByAddress } from '@/utils/httpApi';
import type { Transfer } from '@/utils/models';
import { ActivityRecord, Transaction } from '@/utils/models';
import { ACTIVITY_RECORD_LIMIT } from '@/utils/values';
import { getBrowserTxidUrl, getScriptHashFromAddress } from '@/utils/wallet';
import { EmptyListView } from '../EmptyListView';
import { ListLoader } from '../ListLoader';
import { ActivityCell } from './ActivityCell';

export const ActivityList = observer(() => {
  const { t } = useTranslation();
  const { transferStore, walletStore } = useStore();

  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [index, setIndex] = useState(0);

  const InitRecordCount = 8;

  const transferDataToRecord = (newData: Transfer[]) => {
    const newRecords: ActivityRecord[] = [];
    const noGasFee = newData.filter(t => t.to);
    noGasFee.forEach(t => {
      const r = new ActivityRecord();
      r.transfer = t;
      newRecords.push(r);
    });
    return newRecords;
  };

  const loadMoreData = async () => {
    if (index < 0) {
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      let newRecords: ActivityRecord[] = [];
      let currentIndex = index;
      while (newRecords.length <= 0 && currentIndex >= 0) {
        const newData = await getNep17TransferByAddress(
          walletStore.activeAddress,
          currentIndex,
          ACTIVITY_RECORD_LIMIT,
        );
        if (newData.length > 0) {
          newRecords = transferDataToRecord(newData);
          currentIndex += ACTIVITY_RECORD_LIMIT;
        } else {
          currentIndex = -1;
        }
      }

      const newTxids = newRecords.map(nr => nr.txid);
      const confirmings = records.filter(r => r.status === 'confirming');
      for (let index = 0; index < confirmings.length; index++) {
        const c = confirmings[index];
        if (newTxids.includes(c.txid)) {
          transferStore.deleteConfirming(c.txid);
        }
      }

      setRecords(previousState => {
        const remainRecords = previousState.filter(
          r => r.status !== 'confirming' || !newTxids.includes(r.txid),
        );
        return [...remainRecords, ...newRecords];
      });
      setIndex(currentIndex);
    } finally {
      setLoading(false);
    }
  };

  const initData = useCallback(async () => {
    const addressHash = toStandardHex(
      getScriptHashFromAddress(walletStore.activeAddress),
    );
    const confirmingTransfers =
      transferStore.confirmingNep17Transfers.reverse();
    const confirmingTransferActivities = confirmingTransfers
      .filter(ct => {
        const valid = toStandardHex(ct.from) === addressHash;
        return valid;
      })
      .map(ct => {
        const dummyTransaction = new Transaction();
        dummyTransaction.txid = ct.txid;
        const ar: ActivityRecord = new ActivityRecord();
        ar.transfer = ct;
        return ar;
      });
    const confirmings = confirmingTransferActivities;

    try {
      setLoading(true);
      let newRecords: ActivityRecord[] = [];
      let currentIndex = 0;
      while (newRecords.length <= InitRecordCount && currentIndex >= 0) {
        const newData = await getNep17TransferByAddress(
          walletStore.activeAddress,
          currentIndex,
          ACTIVITY_RECORD_LIMIT,
        );
        if (newData.length > 0) {
          const addRecords = transferDataToRecord(newData);
          newRecords = newRecords.concat(addRecords);
          currentIndex += ACTIVITY_RECORD_LIMIT;
        } else {
          currentIndex = -1;
        }
      }

      const newTxids = newRecords.map(nr => nr.txid);
      for (let index = 0; index < confirmings.length; index++) {
        const c = confirmings[index];
        if (newTxids.includes(c.txid)) {
          transferStore.deleteConfirming(c.txid);
          confirmings.splice(index, 1);
        }
      }

      setRecords(confirmings.concat(newRecords));
      setIndex(currentIndex);
    } finally {
      setLoading(false);
    }
  }, [transferStore, walletStore.activeAddress]);

  useEffect(() => {
    (async () => {
      setRecords([]);
      setIndex(0);
      transferStore.fetchConfirmingTransfers();
      await initData();
      setInit(true);
    })();
  }, [transferStore, initData]);

  const showDetail = async (txid: string) => {
    const url = getBrowserTxidUrl(txid);
    window.open(url, '_blank');
  };

  const renderListTitle = () => {
    return (
      <div className="flex flex-row items-center mt-10 mb-[30px]">
        <span className="text-base text-themeTextGray w-[500px]">
          {t('components.activityList.columnDetail')}
        </span>
        <span className="text-base text-themeTextGray w-[200px]">
          {t('components.activityList.columnAmount')}
        </span>
        <span className="text-base text-themeTextGray text-end w-[200px]">
          {t('components.activityList.columnTxid')}
        </span>
      </div>
    );
  };

  const renderCells = () => {
    return (
      <InfiniteScroll
        dataLength={records.length}
        height={560}
        next={loadMoreData}
        hasMore={index >= 0}
        loader={<ListLoader />}
        endMessage={
          <p className="text-base my-[30px] text-center">
            {t('components.activityList.noMore')}
          </p>
        }
        className="no-scrollbar">
        <div className="flex flex-col">
          {records.map((record, rindex) => {
            return (
              <div key={rindex.toString()}>
                <div>
                  <ActivityCell record={record} showDetail={showDetail} />
                </div>
                {rindex < records.length - 1 && (
                  <div className="w-full h-px my-[30px] bg-indexHistorySeparator" />
                )}
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    );
  };

  const renderEmpty = (isLoading: boolean) => {
    return (
      <div className="flex flex-col min-w-asset max-h-[900px] mt-[50px] p-6">
        {isLoading ? (
          <ListLoader />
        ) : (
          <EmptyListView title={t('components.activityList.empty')} />
        )}
      </div>
    );
  };

  if (!init) {
    return renderEmpty(true);
  } else if (records.length <= 0 && index < 0) {
    return renderEmpty(false);
  }
  return (
    <div className="flex flex-col min-w-asset max-h-[948px] mt-[50px] p-6 rounded-[18px] border-[#edf2f7] border shadow-history">
      <p className="text-black text-[34px] leading-[34px] font-semibold">
        {t('components.activityList.title')}
      </p>
      {renderListTitle()}
      {renderCells()}
    </div>
  );
});
