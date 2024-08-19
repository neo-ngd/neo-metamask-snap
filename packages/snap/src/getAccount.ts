import { getAccountPublic, getSnapBip44Node } from './utils/keyPair';

export default async function getAccount() {
  const bip44Node = await getSnapBip44Node();
  const account = await getAccountPublic(bip44Node);
  return {
    address: account.address,
    publicKey: account.publicKey,
    // label: '',
  };
}
