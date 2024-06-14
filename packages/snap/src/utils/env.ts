import { getAppState } from '../state';
import { NetworkList, environments } from './constants';
import { SnapWalletError, SnapWalletErrorCodes } from './errors';

export const NODE_RPC_URLS: { [key: string]: string } = {
  MainNet: environments.MainNet.HTTPS_NEONJS_URL,
  N3T4: environments.N3T4.HTTPS_NEONJS_URL,
  N3T5: environments.N3T5.HTTPS_NEONJS_URL,
};

export type NetworkEnv = keyof typeof environments;

export const getAppNetwork: () => Promise<NetworkEnv> = async () => {
  const state = await getAppState();
  return state.network;
};

export const getAppUrlConfig = async () => {
  return {
    mainNet: {
      neonJs: environments.MainNet.HTTPS_NEONJS_URL,
      neoFura: environments.MainNet.HTTPS_NEOFURA_URL,
    },
    n3t4: {
      neonJs: environments.N3T4.HTTPS_NEONJS_URL,
      neoFura: environments.N3T4.HTTPS_NEOFURA_URL,
    },
    n3t5: {
      neonJs: environments.N3T5.HTTPS_NEONJS_URL,
      neoFura: environments.N3T5.HTTPS_NEOFURA_URL,
    },
  };
};

export const APP_NAME = 'Vital';

export const WALLET_NAME = 'VitalWallet';

export const MANAGE_SITE =
  process.env.SNAP_ENV == 'development' ? '' : 'https://vitalwallet.xyz';

export const parseNetworkToAppNetwork: (requestNetwork: any) => NetworkEnv =
  function (requestParam: any) {
    if (!NetworkList.includes(requestParam)) {
      throw new SnapWalletError({
        code: SnapWalletErrorCodes.UnsupportedNetwork,
      });
    }
    if (requestParam == 'TestNet') {
      return 'N3T5';
    }
    return requestParam;
  };

export const parseAppNetworkToNetwork: (
  network: NetworkEnv,
) => 'MainNet' | 'TestNet' = function (network: NetworkEnv) {
  if (network == 'MainNet') {
    return 'MainNet';
  }
  return 'TestNet';
};
