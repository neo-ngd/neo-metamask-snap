'use client';

import { observer } from 'mobx-react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { Header } from '../components/Header';
import { AssetList } from '../components/assetList';
import { WalletDetail } from './WalletDetail';

const Wallet: FC = observer(() => {
  const [init, setInit] = useState(false);
  const { assetStore, walletStore } = useStore();

  useEffect(() => {
    (async () => {
      walletStore.fetchAssetsVisible();
      await walletStore.fetchActiveBalances();
      await assetStore.updateAssets();
      setInit(true);
    })();
  }, [assetStore, walletStore]);

  const renderWalletDetails = () => {
    return <WalletDetail />;
  };

  return (
    <div className="flex flex-col items-center">
      <Header current="assets" />
      {renderWalletDetails()}
      <AssetList init={init} />
    </div>
  );
});

export default Wallet;
