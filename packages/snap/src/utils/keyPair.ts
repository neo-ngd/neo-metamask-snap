import { wallet } from '@cityofzion/neon-core';
import type { Account } from '@cityofzion/neon-core/lib/wallet';
import { type BIP44Node, getBIP44AddressKeyDeriver } from '@metamask/key-tree';

import { bip44Entropy } from '../../test/constants.test';

export async function getAddressKeyDeriver() {
  // coinType: BTC 0, ETH 60, NEO 888
  // see https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  // force to use NEO
  let bip44Node;
  if (process.env.NODE_ENV == 'test') {
    bip44Node = bip44Entropy;
  } else {
    bip44Node = await snap.request({
      method: 'snap_getBip44Entropy',
      params: {
        coinType: 888,
      },
    });
  }

  // `m / purpose' / coin_type' / account' / change / address_index`
  // `m / 44' / 888' / 0' / 0 / {index}`
  return getBIP44AddressKeyDeriver(bip44Node);
}

export async function getNeoBIP44PrivateKey() {
  const deriveNeoAddress = await getAddressKeyDeriver();
  const addressKey0 = await deriveNeoAddress(0);
  return addressKey0;
}

export async function generateNeoWalletFromPrivateKey(addressKey: BIP44Node) {
  const { privateKey } = addressKey;
  if (!privateKey) {
    throw new Error('Invalid private key');
  }

  const keyHex = Buffer.from(privateKey.replace(/0[xX]/, ''), 'hex');
  const keyLE = Buffer.from(keyHex.reverse()).toString('hex');

  const account = new wallet.Account(keyLE);
  console.log('account', account);
  return account;
}

function initAccountStore() {
  let account: Account | undefined;
  async function getAccount() {
    if (!account) {
      const bip44 = await getNeoBIP44PrivateKey();
      account = await generateNeoWalletFromPrivateKey(bip44);
    }
    return account;
  }
  return { getAccount };
}

const accountStore = initAccountStore();

export async function getPrivate() {
  const account = await accountStore.getAccount();
  return { privateKey: account.privateKey, wif: account.WIF };
}

export async function getAccountPublic() {
  const account = await accountStore.getAccount();
  return {
    scriptHash: account.scriptHash,
    publicKey: account.publicKey,
    address: account.address,
  };
}
