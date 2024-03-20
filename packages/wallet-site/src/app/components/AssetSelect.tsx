'use client';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { observer, useLocalObservable } from 'mobx-react';
import type { FC } from 'react';
import { Fragment, useEffect, useState } from 'react';
import { useStore } from '@/store';
import type { Asset } from '@/utils/models';
import { UNKNOWN_SYMBOL } from '@/utils/values';
import { AssetLogo } from './AssetLogo';

type Props = {
  selectedHash: string;
  onSelect?: (asset: Asset) => void;
};

export const AssetSelect: FC<Props> = observer(props => {
  const { assetStore, walletStore } = useStore();

  const [activeAssets, setActiveAssets] = useState<(Asset | undefined)[]>([]);
  const [showList, setShowList] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(
    undefined,
  );

  const picker = useLocalObservable(
    () => ({
      get assetList() {
        const filtedAssets = assetStore.getSortedNep17WatchAssetsByBalances(
          walletStore.activeNep17Balances,
        );
        return filtedAssets;
      },
    }),
    [],
  );

  useEffect(() => {
    setActiveAssets(picker.assetList);
    if (props.selectedHash) {
      const initAsset = picker.assetList.find(
        a => a.contractHash === props.selectedHash,
      );
      if (initAsset) {
        setSelectedAsset(initAsset);
      } else {
        setSelectedAsset(picker.assetList[0]);
      }
    } else {
      setSelectedAsset(picker.assetList[0]);
    }
  }, [picker, props.selectedHash]);

  const onAssetChange = (asset: Asset) => {
    setSelectedAsset(asset);
    if (props.onSelect) {
      props.onSelect(asset);
    }
  };

  const renderSelectButton = () => {
    const hash = selectedAsset ? selectedAsset.contractHash : '';
    const assetLogoUrl = assetStore.getAssetLogoUrl(hash);
    return (
      <Menu.Button
        className={`text-themeGray bg-networkSelectBack inline-flex items-center justify-between px-3 py-4 w-36 h-[60px] ${
          showList ? 'rounded-t-xl' : 'rounded-xl'
        }`}>
        <div className="flex flex-row items-center">
          <AssetLogo uri={assetLogoUrl} />
          <p className="text-themeGray text-xl ml-1">
            {selectedAsset ? selectedAsset.symbol : UNKNOWN_SYMBOL}
          </p>
        </div>
        <ChevronDownIcon className="h-8 w-8" aria-hidden="true" />
      </Menu.Button>
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>{renderSelectButton()}</div>

      <Transition
        beforeEnter={() => setShowList(true)}
        afterLeave={() => setShowList(false)}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="absolute right-0 z-10 w-36 max-h-40 origin-top-right rounded-b-xl overflow-hidden bg-networkSelectBack focus:outline-none">
          <div className="overflow-y-auto max-h-40 no-scrollbar">
            {activeAssets.map(asset => {
              if (!asset) {
                return null;
              }
              const assetLogoUrl = assetStore.getAssetLogoUrl(
                asset.contractHash,
              );
              return (
                <Menu.Item key={asset.contractHash}>
                  {({ active }) => (
                    <button
                      onClick={() => onAssetChange(asset)}
                      className={`w-full h-[60px] flex items-center ${
                        active ? 'bg-white' : 'bg-networkSelectBack'
                      } block w-full px-3 py-4`}>
                      <AssetLogo uri={assetLogoUrl} />
                      <p className="text-themeGray text-lg ml-2">
                        {asset.symbol}
                      </p>
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
});
