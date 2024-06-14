import { NetworkList } from './utils/constants';
import { getAppNetwork, parseAppNetworkToNetwork } from './utils/env';

export default async function getNetworks() {
  const appNetwork = await getAppNetwork();
  return {
    networks: NetworkList as any as string[],
    defaultNetwork: parseAppNetworkToNetwork(appNetwork),
  };
}
