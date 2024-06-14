import { divider, heading, panel, text } from '@metamask/snaps-sdk';
import type { InvokeMultiParams, InvokeMultiResult } from '@neongd/neo-dapi';

import {
  getRequestParamsElement,
  getTransactionFeesElement,
  renderInvokeResultDialog,
} from './ui/customUI';
import { assertConfirmation } from './utils/asserts';
import { MANAGE_SITE, WALLET_NAME, getAppNetwork } from './utils/env';
import { getSigningProvider } from './utils/signingProvider';

export default async function invokeMulti(requestParams: any) {
  const params: InvokeMultiParams = requestParams;
  const env = await getAppNetwork();
  const signingProvider = await getSigningProvider();
  const unSignedTx = await signingProvider.prepareTransaction({
    invocations: params.invocations,
    attributes: params.attributes,
    signers: params.signers,
    network: params.network,
    extraNetworkFee: params.extraNetworkFee,
    extraSystemFee: params.extraSystemFee,
  });

  const methodName = 'invokeMulti';

  const confirmation = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(`Approve a Transaction`),
        text(
          `**${WALLET_NAME}** is requesting to ${methodName} on **neo:${env}**.`,
        ),
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

  const result = await signingProvider.request<InvokeMultiResult>({
    method: methodName,
    params,
  });

  renderInvokeResultDialog({
    broadcastOverride: params.broadcastOverride,
    result,
  });

  return result;
}
