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

const appNetworkConfigs: {
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

class SnapSigningProvider extends SigningNetworkProvider {
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
  const account = await getPrivate();
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
