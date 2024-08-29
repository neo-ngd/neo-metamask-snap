import type { MetaMaskInpageProvider } from '@metamask/providers';
import semver from 'semver';
import { defaultSnapOrigin } from '@/config/snap';
import type { GetSnapsResponse, Snap } from '@/types/snap';

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (
  provider?: MetaMaskInpageProvider,
): Promise<GetSnapsResponse> =>
  (await (provider ?? window.ethereum).request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  console.log('get_snap', `${defaultSnapOrigin} version: ${version ?? '-'}`);
  try {
    const snaps = await getSnaps();
    return Object.values(snaps).find(
      snap =>
        snap.id === defaultSnapOrigin &&
        (!version || semver.satisfies(snap.version, version)),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Failed to obtain installed snap', error);
    return undefined;
  }
};
