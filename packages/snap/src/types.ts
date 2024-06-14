import type { Attribute, Invocation, Signer } from '@neongd/neo-dapi';

export type PopulateTransactionParams = {
  version?: number;
  nonce?: number;
  systemFee?: string;
  networkFee?: string;
  validUntilBlock?: number;
  script?: string;
  invocations?: Invocation[];
  attributes?: Attribute[];
  signers?: Signer[];
  extraSystemFee?: string;
  extraNetworkFee?: string;
  network?: string;
};
