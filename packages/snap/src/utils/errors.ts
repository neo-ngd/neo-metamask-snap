import { JsonRpcError, formatErrorJson } from '@neongd/json-rpc';
import { getDapiErrorJson, DapiErrorCodes } from '@neongd/neo-dapi';

export enum SnapWalletErrorCodes {
  NonAdminOrigin = 'NonAdminOrigin',
  UnsupportedNetwork = 'UnsupportedNetwork',
  UserRejected = 'UserRejected',
  UnKnown = 'UnKnown',
}

export function convertRemoteRpcError(error: Error): JsonRpcError {
  return new JsonRpcError({
    ...getDapiErrorJson(DapiErrorCodes.RemoteRpcError),
    data: formatErrorJson(error),
  });
}

export class SnapWalletError extends Error {
  code = SnapWalletErrorCodes.UnKnown;

  data: any;

  constructor(options: { message?: string; code?: SnapWalletErrorCodes } = {}) {
    super(options.message ?? options.code ?? SnapWalletErrorCodes.UnKnown);
    this.code =
      options.code != null ? options.code : SnapWalletErrorCodes.UnKnown;
    this.data = { code: this.code, message: this.message };
  }
}
