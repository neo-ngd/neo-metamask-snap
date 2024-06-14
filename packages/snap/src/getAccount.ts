import { getAccountPublic } from './utils/keyPair';

export default async function getAccount() {
  const account = await getAccountPublic();
  return {
    address: account.address,
    publicKey: account.publicKey,
    // label: '',
  };
}
