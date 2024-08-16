import BigNumber from 'bignumber.js';

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
