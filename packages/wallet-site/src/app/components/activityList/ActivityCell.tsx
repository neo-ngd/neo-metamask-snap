'use client';

import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { Poppins } from 'next/font/google';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { integerToDecimal, toMiddleEllipsisText } from '@/utils/convertors';
import type { ActivityRecord, Asset } from '@/utils/models';
import {
  DEFAULT_GAS_DECIMAL,
  UNKNOWN_SYMBOL,
  UNKNOWN_TOKEN_SYMBOL,
} from '@/utils/values';
import { GasContractHash, getScriptHashFromAddress } from '@/utils/wallet';
import { AssetLogo } from '../AssetLogo';

type Props = {
  record: ActivityRecord;
  showDetail: (txid: string) => void;
};

const poppins = Poppins({ subsets: ['latin'], weight: '500' });

export const ActivityCell: FC<Props> = observer(props => {
  const { assetStore, walletStore } = useStore();

  const [asset, setAsset] = useState<Asset>();
  const [decimals, setDecimals] = useState(0);

  useEffect(() => {
    const result = assetStore.assets.find(
      a => a.contractHash === props.record.transfer.contract,
    );
    setAsset(result);

    const { transfer } = props.record;
    const gasReward = !transfer.from && transfer.contract === GasContractHash;
    const assetDecimals = result
      ? result.decimals
      : gasReward
      ? DEFAULT_GAS_DECIMAL
      : 0;
    setDecimals(assetDecimals);
  }, [assetStore.assets, props.record]);

  const calculateSymbol = () => {
    const address = getScriptHashFromAddress(walletStore.activeAddress);
    const { transfer } = props.record;
    if (transfer.from === transfer.to) {
      return '';
    } else if (transfer.from === address) {
      return '-';
    } else if (transfer.to === address) {
      return '+';
    }
    return '';
  };

  return (
    <div className="flex flex-row items-center w-full">
      <div className="w-[500px] flex flex-row">
        <div className="w-[60px] h-[60px] flex items-center justify-center">
          <AssetLogo
            uri={assetStore.getAssetLogoUrl(asset ? asset.contractHash : '')}
            size={40}
          />
        </div>
        <div className="flex flex-col ml-5">
          <p className={`${poppins.className} text-xl text-themeDark`}>
            {asset ? asset.symbol : UNKNOWN_TOKEN_SYMBOL}
          </p>
          <p
            className={`${poppins.className} text-base leading-[150%] text-themeTimeTextGray`}>
            {dayjs(new Date(props.record.transfer.timestamp)).format(
              'YYYY-MM-DD HH:mm:ss',
            )}
          </p>
        </div>
      </div>
      <div className="w-[200px] items-center">
        <p className={`${poppins.className} text-xl`}>
          {`${
            calculateSymbol() +
            (integerToDecimal(props.record.transfer.value, decimals) ??
              UNKNOWN_SYMBOL)
          } ${asset ? asset.symbol : ''}`}
        </p>
      </div>
      <div className="w-[200px] items-center">
        <p
          onClick={() => props.showDetail(props.record.txid)}
          className={`${poppins.className} text-end underline hover:cursor-pointer`}>
          {toMiddleEllipsisText(props.record.txid, 12)}
        </p>
      </div>
    </div>
  );
});
