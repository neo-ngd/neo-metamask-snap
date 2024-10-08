import {
  DEFAULT_ADDRESS_VERSION,
  NATIVE_CONTRACT_HASH,
} from '@cityofzion/neon-core/lib/consts';
import Neon, { wallet } from '@cityofzion/neon-js';

import { Asset } from './models';
import {
  getNeoBrowserAddressUrl,
  getNeoBrowserNep17TokenUrl,
  getNeoBrowserUrl,
} from './urls';
import { DEFAULT_GAS_DECIMAL } from './values';

export const NeoContractHash = `0x${NATIVE_CONTRACT_HASH.NeoToken}`;
export const GasContractHash = `0x${NATIVE_CONTRACT_HASH.GasToken}`;

const getDefaultNeoAsset = () => {
  const asset = new Asset();
  asset.contractHash = NeoContractHash;
  asset.symbol = 'NEO';
  asset.tokenName = 'NeoToken';
  return asset;
};

const getDefaultGasAsset = () => {
  const asset = new Asset();
  asset.contractHash = GasContractHash;
  asset.symbol = 'GAS';
  asset.tokenName = 'GasToken';
  asset.decimals = DEFAULT_GAS_DECIMAL;
  return asset;
};

export const DefaultAssets: Asset[] = [
  getDefaultNeoAsset(),
  getDefaultGasAsset(),
];

export function isDefaultAsset(contractHash: string) {
  return contractHash === NeoContractHash || contractHash === GasContractHash;
}

export function isValidAddress(address: string) {
  const addressPattern = /^[A-Za-z0-9]{34}$/;
  if (!addressPattern.test(address)) {
    return false;
  }
  return Neon.is.address(address, DEFAULT_ADDRESS_VERSION);
}

export function formatNumber(numberString: string, decimals: number) {
  if (!numberString) {
    return '';
  }

  if (decimals < 0 || decimals > 20) {
    throw new Error('Invalid decimal value');
  }

  // format a locale string to number string
  // FIX ME: really need this?
  const prefix = numberString
    .replace(/[^\d^.?]+/gu, '') // delete character not number or dot
    .replace(/^0+(\d)/u, '$1') // delete pre 0
    .replace(/^\./u, '0.'); // replace '.' to '0.'

  const pattern = new RegExp(`^\\d*(\\.?\\d{0,${decimals}})`);
  const result = prefix.match(pattern);
  return result ? result[0] : '';
}

export function getScriptHashFromAddress(address: string) {
  if (isValidAddress(address)) {
    return `0x${wallet.getScriptHashFromAddress(address)}`;
  }
  return '';
}

export function getAddressFromScriptHash(hash: string) {
  const fixedHash = hash.startsWith('0x') ? hash.slice(2) : hash;
  return wallet.getAddressFromScriptHash(fixedHash);
}

export function getBrowserTxidUrl(txid: string) {
  const baseURL = getNeoBrowserUrl();
  const fixed = baseURL.replace('{0}', txid);
  return fixed;
}

export async function getBrowserNep17TokenUrl(tokenHash: string) {
  const baseURL = getNeoBrowserNep17TokenUrl();
  const fixed = baseURL.replace('{0}', tokenHash);
  return fixed;
}

export async function getBrowserAddressUrl(address: string) {
  const baseURL = getNeoBrowserAddressUrl();
  const addressHash = getScriptHashFromAddress(address);
  const fixed = baseURL.replace('{0}', addressHash);
  return fixed;
}
