import { divider, heading, panel, text } from '@metamask/snaps-sdk';
import type { InvokeParams, InvokeResult } from '@neongd/neo-dapi';

import {
  getRequestParamsElement,
  getTransactionFeesElement,
  renderInvokeResultDialog,
} from './ui/customUI';
import { assertConfirmation } from './utils/asserts';
import { MANAGE_SITE, getAppNetwork } from './utils/env';
import { getSigningProvider } from './utils/signingProvider';

export default async function invoke(requestParams: any, origin: string) {
  const params: InvokeParams = requestParams;
  const env = await getAppNetwork();
  const signingProvider = await getSigningProvider();
  const unSignedTx = await signingProvider.prepareTransaction({
    invocations: [
      {
        scriptHash: params.scriptHash,
        operation: params.operation,
        args: params.args,
      },
    ],
    attributes: params.attributes,
    signers: params.signers,
    network: params.network,
    extraNetworkFee: params.extraNetworkFee,
    extraSystemFee: params.extraSystemFee,
  });

  const confirmation = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(`Approve a Transaction`),
        text(`**${origin}** is requesting to invoke on **neo:${env}**.`),
        text(`Hint: you can manage your wallet at **${MANAGE_SITE}**`),
        divider(),
        ...getRequestParamsElement(params),
        divider(),
        ...getTransactionFeesElement({
          systemFee: unSignedTx.systemFee,
          networkFee: unSignedTx.networkFee,
        }),
      ]),
    },
  });

  assertConfirmation(confirmation);

  const result = await signingProvider.request<InvokeResult>({
    method: 'invoke',
    params,
  });

  renderInvokeResultDialog({
    broadcastOverride: params.broadcastOverride,
    result,
  });

  return result;
}
