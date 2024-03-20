'use client';

import { observer } from 'mobx-react';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import { useStore } from '@/store';
import { EmptyListView } from '../EmptyListView';
import { ListLoader } from '../ListLoader';
import { AssetCell } from './AssetCell';

type Props = {
  init: boolean;
};

export const AssetList: FC<Props> = observer(props => {
  const { t } = useTranslation();
  const { walletStore } = useStore();

  const renderListTitle = () => {
    return (
      <div className="flex flex-row items-center my-6 px-6">
        <span className="text-base text-themeTextGray w-assetCell">
          {t('components.assetList.columnAsset')}
        </span>
        <span className="text-base text-themeTextGray w-assetCell ml-[70px]">
          {t('components.assetList.columnAmount')}
        </span>
        <span className="text-base text-themeTextGray w-assetCell ml-[70px]">
          {t('components.assetList.columnValue')}
        </span>
      </div>
    );
  };

  const renderCells = () => {
    return (
      <div className="overflow-visible p-1 -m-1">
        {walletStore.activeNep17Balances.map(balance => {
          return <AssetCell key={balance.contractHash} balance={balance} />;
        })}
      </div>
    );
  };

  const renderEmpty = (isLoading: boolean) => {
    return (
      <div className="flex flex-col max-h-[900px] mt-[50px]">
        {isLoading ? (
          <ListLoader />
        ) : (
          <EmptyListView title={t('components.assetList.empty')} />
        )}
      </div>
    );
  };

  const renderAssetList = () => {
    if (!props.init) {
      return renderEmpty(true);
    } else if (walletStore.activeNep17Balances.length <= 0) {
      return renderEmpty(false);
    }
    return (
      <>
        {renderListTitle()}
        {renderCells()}
      </>
    );
  };

  return (
    <div className="flex flex-col min-w-asset max-h-[500px] mt-4 p-6 rounded-[18px] border-[#edf2f7] border shadow-asset">
      <p className="text-black text-2xl leading-6 font-semibold">
        {t('components.assetList.title')}
      </p>

      {renderAssetList()}
    </div>
  );
});
