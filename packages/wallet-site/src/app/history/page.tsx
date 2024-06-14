'use client';

import { observer } from 'mobx-react';
import { FC, useEffect } from 'react';
import { useStore } from '@/store';
import { Header } from '../components/Header';
import { ActivityList } from '../components/activityList';

const History: FC = observer(() => {
  const { assetStore, walletStore } = useStore();

  useEffect(() => {
    assetStore.fetchAssets();
    walletStore.fetchActiveAddress();
    walletStore.fetchActiveBalances();
  }, [assetStore, walletStore]);

  const refresh = () => {
    location.reload();
  };

  return (
    <div className="flex flex-col items-center">
      <Header current="history" onChangeNetwork={refresh} />
      <ActivityList />
    </div>
  );
});

export default History;
