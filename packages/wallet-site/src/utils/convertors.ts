import { Buffer } from 'buffer';
import { HexString } from '@cityofzion/neon-core/lib/u';
import BigNumber from 'bignumber.js';

export function isValidHex(hexStr: string) {
  return (
    typeof hexStr === 'string' && /^(0[xX])?([0-9A-Fa-f]{2})*$/u.test(hexStr)
  );
}

export function base64ToHex(base64: string) {
  const b = Buffer.from(base64, 'base64');
  return b.toString('hex');
}

export function toStandardHex(str: string | HexString) {
  const hexStr = str instanceof HexString ? str.toString() : str;
  if (!isValidHex(hexStr)) {
    throw new Error('input param is not a valid hex string');
  }
  return hexStr.replace(/0[xX]/u, '').toLowerCase();
}

export function integerToDecimal(integer: string, unit: number): string | null {
  if (new BigNumber(integer).isNaN()) {
    return null;
  }
  return new BigNumber(integer).shiftedBy(-unit).toFixed();
}

export function decimalToInteger(decimal: string, unit: number): string | null {
  if (new BigNumber(decimal).isNaN()) {
    return null;
  }
  return new BigNumber(decimal)
    .shiftedBy(unit)
    .dp(0, BigNumber.ROUND_DOWN)
    .toFixed();
}

export function toMiddleEllipsisText(origin: string, length: number) {
  if (!origin) {
    return origin;
  }
  const originLength = origin.length;
  if (originLength <= length) {
    return origin;
  }

  const halfLength = length / 2;
  const front = origin.slice(0, halfLength);
  const end = origin.slice(originLength - halfLength, originLength);
  return `${front}...${end}`;
}
