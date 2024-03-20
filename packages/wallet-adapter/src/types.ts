import type { Dapi } from '@neongd/neo-dapi';

export type SnapDapi = {
  getNetworks: Dapi['getNetworks'];
  getAccount: Dapi['getAccount'];
  invoke: Dapi['invoke'];
  invokeMulti: Dapi['invokeMulti'];
  signMessage: Dapi['signMessage'];
  signMessageWithoutSalt: Dapi['signMessageWithoutSalt'];
  signTransaction: Dapi['signTransaction'];
};
