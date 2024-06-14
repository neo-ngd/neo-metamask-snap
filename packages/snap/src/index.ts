import {
  panel,
  type OnRpcRequestHandler,
  text,
  heading,
  divider,
} from '@metamask/snaps-sdk';

import { adminSwitchNetwork } from './admin/switchNetwork';
import getAccount from './getAccount';
import getNetworks from './getNetworks';
import invoke from './invoke';
import invokeMulti from './invokeMulti';
import signMessage from './signMessage';
import signMessageWithoutSalt from './signMessageWithoutSalt';
import signTransaction from './signTransaction';
import { getAppNetwork, parseNetworkToAppNetwork } from './utils/env';
import { SnapWalletError, SnapWalletErrorCodes } from './utils/errors';
import { logger } from './utils/logger';
import { toJson } from './utils/serializer';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const requestParams = request?.params as any;
  const appNetwork = await getAppNetwork();

  console.log(`debugLevel: ${logger.getLogLevel()}`);
  logger.log(origin, request);
  logger.log(`${request.method}:\nrequestParams: ${toJson(requestParams)}`);

  try {
    if (
      requestParams &&
      requestParams.network &&
      request.method !== 'adminSwitchNetwork'
    ) {
      const requestNetwork = parseNetworkToAppNetwork(requestParams.network);
      if (requestNetwork !== appNetwork) {
        throw new SnapWalletError({
          code: SnapWalletErrorCodes.UnsupportedNetwork,
        });
      }
    }

    switch (request.method) {
      case 'adminSwitchNetwork': {
        return await adminSwitchNetwork(requestParams, origin);
      }
      case 'getAccount': {
        return await getAccount();
      }
      case 'getNetworks': {
        return await getNetworks();
      }
      case 'invoke': {
        return await invoke(requestParams, origin);
      }
      case 'invokeMulti': {
        return await invokeMulti(requestParams);
      }
      case 'signMessage': {
        return (await signMessage(requestParams)) as any;
      }
      case 'signMessageWithoutSalt': {
        return (await signMessageWithoutSalt(requestParams)) as any;
      }
      case 'signTransaction': {
        return (await signTransaction(requestParams)) as any;
      }
      default:
        throw new Error('Method not found.');
    }
  } catch (error) {
    if (error instanceof SnapWalletError) {
      if (error.code == SnapWalletErrorCodes.UserRejected) {
        throw error;
      }
    }
    if (error instanceof Error) {
      await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel([
            heading('Error'),
            text(`**${error.message}**!`),
            divider(),
            text(`${toJson(error)}`),
          ]),
        },
      });
    }
    throw error;
  }
};
