import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk';
import type {
  InvokeResult,
  SignMessageResult,
  SignMessageWithoutSaltResult,
} from '@neongd/neo-dapi';

import { DEFAULT_GAS_DECIMAL } from '../utils/constants';
import { integerToDecimal } from '../utils/convertors';
import { toJson } from '../utils/serializer';

export const renderInvokeResultDialog = async ({
  broadcastOverride,
  result,
}: {
  broadcastOverride: boolean | undefined;
  result: InvokeResult;
}) => {
  if (broadcastOverride) {
    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          heading(`Successfully`),
          divider(),
          heading(`Result:`),
          copyable(`${toJson(result)}`),
        ]),
      },
    });
  } else {
    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          heading(`Transaction Submitted`),
          text(`Transaction needs 15~30 seconds to be confirmed.`),
          divider(),
          text('txid: '),
          copyable(`${result.txid}`),
        ]),
      },
    });
  }
};

export const renderSignMessageResultDialog = async (
  result: SignMessageResult | SignMessageWithoutSaltResult,
) => {
  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading(`Sign successfully`),
        divider(),
        heading(`Result`),
        copyable(`${toJson(result)}`),
      ]),
    },
  });
};

export const renderSignTransactionResultDialog = async (result: {
  signature: string;
  publicKey: string;
}) => {
  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        text(`Sign successfully`),
        divider(),
        heading(`Result`),
        copyable(`${toJson(result)}`),
      ]),
    },
  });
};

export const getRequestParamsElement = (requestParams: any) => {
  return [heading(`Request params:`), copyable(`${toJson(requestParams)}`)];
};

export const getTransactionFeesElement = (params: {
  systemFee: string;
  networkFee: string;
}) => {
  return [
    text(
      `systemFee: ${
        integerToDecimal(params.systemFee, DEFAULT_GAS_DECIMAL) ?? '-'
      } Gas`,
    ),
    text(
      `networkFee: ${
        integerToDecimal(params.networkFee, DEFAULT_GAS_DECIMAL) ?? '-'
      } Gas`,
    ),
  ];
};
