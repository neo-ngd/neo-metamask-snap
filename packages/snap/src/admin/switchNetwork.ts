import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk';

import { getAppState, updateAppState } from '../state';
import { assertAdminOrigin, assertConfirmation } from '../utils/asserts';
import { parseNetworkToAppNetwork } from '../utils/env';
import { getSigningProvider } from '../utils/signingProvider';

export async function adminSwitchNetwork(requestParams: any, origin: string) {
  assertAdminOrigin(origin);
  const network = parseNetworkToAppNetwork(requestParams.network);

  const confirmation = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(`Switch Network`),
        text(
          `**${origin}** is requesting to switch network to **neo:${network}**.`,
        ),
        divider(),
        heading(`Request params:`),
        copyable(`${JSON.stringify(requestParams)}`),
      ]),
    },
  });

  assertConfirmation(confirmation);

  const appState = await getAppState();
  appState.network = network;

  const signingProvider = await getSigningProvider();
  signingProvider.changeNetwork(network);
  await updateAppState(appState);

  snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading(`Successfully`),
        text(`Current network: ${network}`),
      ]),
    },
  });

  return true;
}
