import { wallet } from '@cityofzion/neon-core';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { deserialize } from 'serializr';
import { HttpError, HttpErrorCodes } from '@/utils/errors';
import {
  AssetResponse,
  BalanceResponse,
  TransactionResponse,
  TransferResponse,
} from '@/utils/responses';
import { getNeoFuraUrl, getServerUrl } from '@/utils/urls';
import { AXIOS_TIMEOUT } from '@/utils/values';

const RequestErrorNotFound = 'not found';

async function handleError(error: any) {
  const { response } = error;
  let newError = error;
  if (response) {
    let code = HttpError.Codes.UnknownError;
    if (response.status === 400) {
      code = HttpError.Codes.BadRequest;
    } else if (response.status === 500) {
      code = HttpError.Codes.InternalServiceError;
    }
    newError = new HttpError(response.data.message, { cause: error, code });
  } else {
    let code = HttpError.Codes.UnknownError;
    if (error.code === 'ECONNABORTED') {
      code = HttpError.Codes.RequestTimeout;
    }
    newError = new HttpError(error.message || 'Network Error', {
      cause: error,
      code,
    });
  }
  throw newError;
}

async function handleResponse(value: AxiosResponse<any>) {
  if (!value) {
    throw new HttpError('', { code: HttpErrorCodes.InternalServiceError });
  }
  return value;
}

// neo3phora
const requestWallet = axios.create({
  timeout: AXIOS_TIMEOUT,
  headers: { 'content-type': 'application/json' },
});

requestWallet.interceptors.response.use(handleResponse, async (error) => {
  handleError(error);
});

export async function getAssetInfos(targets?: string[]) {
  const baseURL = getNeoFuraUrl();
  const response = await requestWallet({
    baseURL,
    method: 'post',
    data: {
      jsonrpc: '2.0',
      id: 1,
      params: targets ? { Addresses: targets } : {},
      method: 'GetAssetInfos',
    },
  });
  return deserialize(AssetResponse, response.data.result.result as []);
}

export async function getAssetHeldByAddress(address: string) {
  if (!address) {
    return [];
  }
  const scriptHash = `0x${wallet.getScriptHashFromAddress(address)}`;
  const baseURL = getNeoFuraUrl();
  const response = await requestWallet({
    baseURL,
    method: 'post',
    data: {
      jsonrpc: '2.0',
      id: 1,
      params: {
        Address: scriptHash,
      },
      method: 'GetAssetsHeldByAddress',
    },
  });
  return deserialize(BalanceResponse, response.data.result.result as []);
}

export async function getRawMemPool() {
  const baseURL = getNeoFuraUrl();
  const response = await requestWallet({
    baseURL,
    method: 'post',
    data: {
      jsonrpc: '2.0',
      id: 1,
      params: {},
      method: 'GetRawMemPool',
    },
  });
  const txids: string[] = response.data.result;
  return txids;
}

export async function getNep17TransferByAddress(
  address: string,
  skip?: number,
  limit?: number,
) {
  if (!address) {
    return [];
  }
  const scriptHash = `0x${wallet.getScriptHashFromAddress(address)}`;
  const baseURL = getNeoFuraUrl();
  const response = await requestWallet({
    baseURL,
    method: 'post',
    data: {
      jsonrpc: '2.0',
      id: 1,
      params:
        skip || limit
          ? { Address: scriptHash, Skip: skip, Limit: limit }
          : { Address: scriptHash },
      method: 'GetNep17TransferByAddress',
    },
  });
  return deserialize(TransferResponse, response.data.result.result as []);
}

export async function getNep11TransferByAddress(
  address: string,
  skip?: number,
  limit?: number,
) {
  if (!address) {
    return [];
  }
  const scriptHash = `0x${wallet.getScriptHashFromAddress(address)}`;
  const baseURL = getNeoFuraUrl();
  const response = await requestWallet({
    baseURL,
    method: 'post',
    data: {
      jsonrpc: '2.0',
      id: 1,
      params:
        skip || limit
          ? { Address: scriptHash, Skip: skip, Limit: limit }
          : { Address: scriptHash },
      method: 'GetNep11TransferByAddress',
    },
  });
  return deserialize(TransferResponse, response.data.result.result as []);
}

export async function getRawTransactionByAddress(
  address: string,
  skip?: number,
  limit?: number,
) {
  if (!address) {
    return [];
  }
  const scriptHash = `0x${wallet.getScriptHashFromAddress(address)}`;
  const baseURL = getNeoFuraUrl();
  const response = await requestWallet({
    baseURL,
    method: 'post',
    data: {
      jsonrpc: '2.0',
      id: 1,
      params:
        skip || limit
          ? { Address: scriptHash, Skip: skip, Limit: limit }
          : { Address: scriptHash },
      method: 'GetRawTransactionByAddress',
    },
  });
  return deserialize(TransactionResponse, response.data.result.result as []);
}

export async function getRawTransactionByTransactionHash(txid: string) {
  const baseURL = getNeoFuraUrl();
  const response = await requestWallet({
    baseURL,
    method: 'post',
    data: {
      jsonrpc: '2.0',
      id: 1,
      params: { TransactionHash: txid },
      method: 'GetRawTransactionByTransactionHash',
    },
  });
  return deserialize(TransactionResponse, response.data.result);
}

export async function getNep17TransferByTransactionHash(txid: string) {
  const baseURL = getNeoFuraUrl();
  const response = await requestWallet({
    baseURL,
    method: 'post',
    data: {
      jsonrpc: '2.0',
      id: 1,
      params: { TransactionHash: txid },
      method: 'GetNep17TransferByTransactionHash',
    },
  });

  if (!response.data.result && response.data.error === RequestErrorNotFound) {
    return deserialize(TransferResponse, []);
  }

  return deserialize(TransferResponse, response.data.result.result as []);
}

// vital server
const requestServer = axios.create({
  timeout: AXIOS_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

requestServer.interceptors.response.use(handleResponse, async (error) => {
  handleError(error);
});

export async function getAssetPrice(hashList: string[]) {
  const url = '/api/quote?convert=usd';
  const baseURL = getServerUrl();
  const response = await requestServer({
    baseURL,
    method: 'post',
    url,
    data: JSON.stringify(hashList),
  });
  const priceList: number[] = response.data;
  return priceList;
}
