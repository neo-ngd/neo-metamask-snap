import { u } from '@cityofzion/neon-core';
import BigNumber from 'bignumber.js';

export function isValidHex(hex: string) {
  return typeof hex === 'string' && /^(0[xX])?([0-9A-Fa-f]{2})*$/.test(hex);
}

export function base64ToHex(base64: string) {
  const b = Buffer.from(base64, 'base64');
  return b.toString('hex');
}

export function toStandardHex(str: string | u.HexString) {
  const hex = str instanceof u.HexString ? str.toString() : str;
  if (!isValidHex(hex)) {
    throw new Error('input param is not a valid hex string');
  }
  return hex.replace(/0[xX]/, '').toLowerCase();
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

export function mulNeoBigIntegerWithFloat(
  origin: u.BigInteger,
  mulNumber: number,
  decimal: number,
) {
  const originStr = origin.toDecimal(decimal);
  const bnum = new BigNumber(originStr);
  const bresult = bnum.times(mulNumber);
  const bigIntResult = bresult
    .shiftedBy(decimal)
    .integerValue(BigNumber.ROUND_CEIL);
  return u.BigInteger.fromNumber(bigIntResult.toString());
}
