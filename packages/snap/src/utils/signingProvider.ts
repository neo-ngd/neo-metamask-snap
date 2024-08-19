import type {
  NetworkConfig,
  SigningNetworkProviderOptions,
} from '@neongd/neo-dapi';
import { SigningNetworkProvider } from '@neongd/neo-dapi';
import fetchAdapter from 'konfig-axios-fetch-adapter';

import { defaultAppState } from '../state';
import type { PopulateTransactionParams } from '../types';
import { environments } from './constants';
import type { NetworkEnv } from './env';
import { getPrivate } from './keyPair';
import { getSnapBip44Node } from './keyPair';

export const appNetworkConfigs: {
  name: NetworkEnv;
  nodeUrl: string;
  magicNumber: number;
}[] = [
  {
    name: 'MainNet',
    nodeUrl: environments.MainNet.HTTPS_NEONJS_URL,
    magicNumber: environments.MainNet.NEONJS_MAGIC_NUMBER,
  },
  {
    name: 'N3T5',
    nodeUrl: environments.N3T5.HTTPS_NEONJS_URL,
    magicNumber: environments.N3T5.NEONJS_MAGIC_NUMBER,
  },
];

export class SnapSigningProvider extends SigningNetworkProvider {
  constructor(
    networkConfigs: NetworkConfig[],
    defaultNetwork: string,
    privateKey: string,
    protected label?: string,
    protected options: SigningNetworkProviderOptions = {},
  ) {
    super(networkConfigs, defaultNetwork, privateKey, label, options);
  }

  async prepareTransaction(params: PopulateTransactionParams) {
    return await this.populateTransaction(params);
  }
}

async function getSigningProvider() {
  const bip44Node = await getSnapBip44Node();
  const account = await getPrivate(bip44Node);
  return new SnapSigningProvider(
    appNetworkConfigs,
    defaultAppState.network,
    account.wif,
    undefined,
    {
      axiosConfig: {
        adapter: fetchAdapter,
      },
    },
  );
}

export { getSigningProvider };
