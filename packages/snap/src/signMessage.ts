import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk';
import type { SignMessageParams, SignMessageResult } from '@neongd/neo-dapi';

import { renderSignMessageResultDialog } from './ui/customUI';
import { assertConfirmation } from './utils/asserts';
import { MANAGE_SITE, WALLET_NAME, getAppNetwork } from './utils/env';
import { getSigningProvider } from './utils/signingProvider';

export default async function signMessage(requestParams: any) {
  const params: SignMessageParams = requestParams;
  const env = await getAppNetwork();
  const signingProvider = await getSigningProvider();
  const methodName = 'signMessage';
  const confirmation = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(`Approve signMessage`),
        text(
          `**${WALLET_NAME}** is requesting to ${methodName} on **neo:${env}**.`,
        ),
        text(`Hint: you can manage your wallet at **${MANAGE_SITE}**`),
        divider(),
        heading(`You are signing:`),
        copyable(`${params.message}`),
      ]),
    },
  });

  assertConfirmation(confirmation);

  const result = await signingProvider.request<SignMessageResult>({
    method: methodName,
    params,
  });

  renderSignMessageResultDialog(result);

  return result;
}
