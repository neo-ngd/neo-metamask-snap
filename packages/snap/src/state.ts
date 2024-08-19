import type { NetworkEnv } from './utils/env';

type AppState = {
  network: NetworkEnv;
};

export const defaultAppState = {
  network: 'N3T5',
} as const;

export async function getAppState(): Promise<AppState> {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

  if (state === null) {
    return defaultAppState;
  }

  return state as AppState;
}

export async function updateAppState(newState: AppState): Promise<void> {
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState },
  });
}
