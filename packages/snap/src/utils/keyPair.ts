import { wallet } from "@cityofzion/neon-core";
import {
  BIP44CoinTypeNode,
  getBIP44AddressKeyDeriver,
} from '@metamask/key-tree';

export async function getSnapBip44Node() {
  // coinType: BTC 0, ETH 60, NEO 888
  // see https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  // force to use NEO
  const json = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 888,
    },
  });
  return BIP44CoinTypeNode.fromJSON(json, 888)
}

export async function getNeoAccount(bip44Node: BIP44CoinTypeNode) {
  // `m / purpose' / coin_type' / account' / change / address_index`
  // `m / 44' / 888' / 0' / 0 / {index}`
  const deriveNeoAddress = await getBIP44AddressKeyDeriver(bip44Node)
  const addressKey = await deriveNeoAddress(0);

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

export async function getPrivate(bip44Node: BIP44CoinTypeNode) {
  const account = await getNeoAccount(bip44Node);
  return { privateKey: account.privateKey, wif: account.WIF }; 
}

export async function getAccountPublic(bip44Node: BIP44CoinTypeNode) {
  const account = await getNeoAccount(bip44Node);
  return {
    scriptHash: account.scriptHash,
    publicKey: account.publicKey,
    address: account.address,
  };
}