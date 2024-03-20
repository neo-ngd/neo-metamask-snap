import getT from 'next-translate/getT';

export type BaseErrorOptions = {
  cause?: any;
  data?: Record<string, any>;
  expose?: boolean;
};

export class BaseError extends Error {
  cause: any;

  data: Record<string, any>;

  expose: boolean;

  constructor(message?: string, options: BaseErrorOptions = {}) {
    super(message);
    this.cause = options.cause;
    this.data = options.data ?? {};
    this.expose = options.expose === undefined ? true : options.expose;
  }

  async getLocalMessage(lng?: string) {
    return (lng ?? '') + this.message;
  }

  printTraceStack() {
    // eslint-disable-next-line no-console
    console.log(this);
    for (
      let error = this.cause;
      error;
      error = error instanceof BaseError ? error.cause : undefined
    ) {
      // eslint-disable-next-line no-console
      console.log('Caused by:', error);
    }
  }
}

export enum HttpErrorCodes {
  UnknownError = 'UnknownError',
  NetworkError = 'NetworkError',
  BadRequest = 'BadRequest',
  InternalServiceError = 'InternalServiceError',
  RssUrlNotFound = 'RssUrlNotFound',
  RequestTimeout = 'RequestTimeout',
}

export type HttpErrorOptions = BaseErrorOptions & { code?: HttpErrorCodes };

export class HttpError extends BaseError {
  static readonly Codes = HttpErrorCodes;

  code: HttpErrorCodes = HttpError.Codes.UnknownError;

  constructor(message?: string, options: HttpErrorOptions = {}) {
    super(message, options);
    this.code =
      options.code === undefined ? HttpError.Codes.UnknownError : options.code;
  }

  override async getLocalMessage(lng?: string) {
    const locale = lng ?? 'en';
    const { code } = this;
    const t = await getT(locale, 'common');
    const localMsg = t(`errors.http.${code}`);
    return localMsg || this.message;
  }
}

export enum ValidationErrorCodes {
  UnknownError = 'UnknownError',
  UnsupportedNetwork = 'UnsupportedNetwork',
  PolicyNotAgreed = 'PolicyNotAgreed',
  NoWalletName = 'NoWalletName',
  PasswordLengthInvalid = 'PasswordLengthInvalid',
  PasswordConfirmFailed = 'PasswordConfirmFailed',
  PasswordWrong = 'PasswordWrong',
  MnemonicValidateFailed = 'MnemonicValidateFailed',
  PrivateKeyValidateFailed = 'PrivateKeyValidateFailed',
  Nep2KeyValidateFailed = 'Nep2KeyValidateFailed',
  WalletCreateFailed = 'WalletCreateFailed',
  AddressInvalid = 'AddressInvalid',
  QrCodeInvalid = 'QrCodeInvalid',
  AssetInvalid = 'AssetInvalid',
  WalletAlreadyExist = 'WalletAlreadyExist',
  AddressAlreadyExist = 'AddressAlreadyExist',
  AssetAlreadyExist = 'AssetAlreadyExist',
  WalletNotFound = 'WalletNotFound',
  AssetNotFound = 'AssetNotFound',
  DateTimeError = 'DateTimeError',
  AddressNotFound = 'AddressNotFound',
  ImageLoadFailed = 'ImageLoadFailed',

  // tansfer
  NoActiveWallet = 'NoActiveWallet',
  NoPrivateKey = 'NoPrivateKey',
  NoTransaction = 'NoTransaction',
  NetworkFeeFailed = 'NetworkFeeFailed',
  TransferScriptFailed = 'TransferScriptFailed',
  TokenNotFound = 'TokenNotFound',
  InsufficientFunds = 'InsufficientFunds',
  InsufficientFundsForFee = 'InsufficientFundsForFee',
}

export type ValidationErrorOptions = BaseErrorOptions & {
  code?: ValidationErrorCodes;
};

export class ValidationError extends BaseError {
  static readonly Codes = ValidationErrorCodes;

  code: ValidationErrorCodes = ValidationError.Codes.UnknownError;

  constructor(message?: string, options: ValidationErrorOptions = {}) {
    super(message, options);
    this.code =
      options.code === undefined
        ? ValidationError.Codes.UnknownError
        : options.code;
  }

  override async getLocalMessage(lng?: string) {
    const locale = lng ?? 'en';
    const { code } = this;
    const t = await getT(locale, 'common');
    const localMsg = t(`errors.validation.${code}`);
    return localMsg || this.message;
  }
}

export enum SwapErrorCodes {
  UnknownError = 'UnknownError',
  SwapAmountInvalid = 'SwapAmountInvalid',
  SwapReserveInvalid = 'SwapReserveInvalid',
  NoTokenData = 'NoTokenData',
  NoPoolReserve = 'NoPoolReserve',
  NoSwapData = 'NoSwapData',
  NoSwapTrade = 'NoSwapTrade',
  SwapScriptFailed = 'SwapScriptFailed',
  NoSwapInvokeData = 'NoSwapInvokeData',
}

export type SwapErrorOptions = BaseErrorOptions & { code?: SwapErrorCodes };

export class SwapError extends BaseError {
  static readonly Codes = SwapErrorCodes;

  code: SwapErrorCodes = SwapError.Codes.UnknownError;

  constructor(message?: string, options: SwapErrorOptions = {}) {
    super(message, options);
    this.code =
      options.code === undefined ? SwapError.Codes.UnknownError : options.code;
  }

  override async getLocalMessage(lng?: string) {
    const locale = lng ?? 'en';
    const { code } = this;
    const t = await getT(locale, 'common');
    const localMsg = t(`errors.swap.${code}`);
    return localMsg || this.message;
  }
}
