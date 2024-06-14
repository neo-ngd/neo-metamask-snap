import { divider, heading, panel, text } from '@metamask/snaps-sdk';
import type {
  SignTransactionParams,
  SignTransactionResult,
} from '@neongd/neo-dapi';

import {
  getRequestParamsElement,
  renderSignTransactionResultDialog,
} from './ui/customUI';
import { assertConfirmation } from './utils/asserts';
import { MANAGE_SITE, WALLET_NAME, getAppNetwork } from './utils/env';
import { getSigningProvider } from './utils/signingProvider';

export default async function signTransaction(requestParams: any) {
  const params = requestParams as SignTransactionParams;
  const env = await getAppNetwork();
  const signingProvider = await getSigningProvider();
  const methodName = 'signTransaction';
  const confirmation = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(`Approve signTransaction`),
        text(
          `**${WALLET_NAME}** is requesting to ${methodName} on **neo:${env}**.`,
        ),
        text(`Hint: you can manage your wallet at **${MANAGE_SITE}**`),
        divider(),
        ...getRequestParamsElement(params),
      ]),
    },
  });

  assertConfirmation(confirmation);

  const result = await signingProvider.request<SignTransactionResult>({
    method: 'signTransaction',
    params,
  });

  renderSignTransactionResultDialog(result);

  return result;
}
