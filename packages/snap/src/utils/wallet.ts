import { wallet } from '@cityofzion/neon-core';

export function isValidAddress(address: string) {
  return wallet.isAddress(address);
}

export function getScriptHashFromAddress(address: string) {
  if (isValidAddress(address)) {
    return `0x${wallet.getScriptHashFromAddress(address)}`;
  }
  return '';
}
