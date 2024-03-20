import { type Dapi } from '@neongd/neo-dapi';

import { adminSwitchNetwork, NeoSnapAdapter } from 'beta-snap-wallet-adapter';
import { ValidationError } from '@/utils/errors';

type InputInvokeParams = Parameters<Dapi['invoke']>[0];

export const getSnapWallet = () => {
  return new NeoSnapAdapter(window.ethereum as any);
};

export const handleTransfer = async (
  from: string,
  to: string,
  amount: string,
  assetHash: string,
) => {
  const snapWallet = getSnapWallet();
  const transferParams: InputInvokeParams = {
    scriptHash: assetHash,
    operation: 'transfer',
    args: [
      { type: 'Hash160', value: from },
      { type: 'Hash160', value: to },
      {
        type: 'Integer',
        value: amount,
      },
      { type: 'Any', value: '' },
    ],
    broadcastOverride: false,
  };
  const result = await snapWallet.invoke(transferParams);
  return result;
};

export const toggleNetwork = async (network: string) => {
  if (!(network === 'MainNet' || network === 'TestNet')) {
    throw new ValidationError('', {
      code: ValidationError.Codes.UnsupportedNetwork,
    });
  }
  const result = await adminSwitchNetwork(network);
  return result;
};
