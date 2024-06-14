import type { MetaMaskInpageProvider } from '@metamask/providers';
import type {
  Account,
  InvokeMultiParams,
  InvokeMultiResult,
  InvokeParams,
  InvokeResult,
  Networks,
  SignMessageParams,
  SignMessageResult,
  SignMessageWithoutSaltParams,
  SignMessageWithoutSaltResult,
  SignTransactionParams,
  SignTransactionResult,
} from '@neongd/neo-dapi';
import type { SnapDapi } from './types';
import { SNAP_ORIGIN } from './snapOrigin';

export async function adminSwitchNetwork(
  network: 'MainNet' | 'TestNet',
): Promise<boolean> {
  return (await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: SNAP_ORIGIN,
      request: {
        method: 'adminSwitchNetwork',
        params: { network },
      },
    },
  })) as any;
}

export class NeoSnapAdapter implements SnapDapi {
  constructor(protected provider: MetaMaskInpageProvider) {}

  async getNetworks(): Promise<Networks> {
    return (await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: SNAP_ORIGIN,
        request: {
          method: 'getNetworks',
        },
      },
    })) as any;
  }

  async getAccount(): Promise<Account> {
    return (await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: SNAP_ORIGIN,
        request: {
          method: 'getAccount',
        },
      },
    })) as any;
  }

  async invoke(params: InvokeParams): Promise<InvokeResult> {
    return (await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: SNAP_ORIGIN,
        request: {
          method: 'invoke',
          params,
        },
      },
    })) as any;
  }

  async invokeMulti(params: InvokeMultiParams): Promise<InvokeMultiResult> {
    return (await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: SNAP_ORIGIN,
        request: {
          method: 'invokeMulti',
          params,
        },
      },
    })) as any;
  }

  async signMessage(params: SignMessageParams): Promise<SignMessageResult> {
    return (await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: SNAP_ORIGIN,
        request: {
          method: 'signMessage',
          params,
        },
      },
    })) as any;
  }

  async signMessageWithoutSalt(
    params: SignMessageWithoutSaltParams,
  ): Promise<SignMessageWithoutSaltResult> {
    return (await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: SNAP_ORIGIN,
        request: {
          method: 'signMessageWithoutSalt',
          params,
        },
      },
    })) as any;
  }

  async signTransaction(
    params: SignTransactionParams,
  ): Promise<SignTransactionResult> {
    return this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: SNAP_ORIGIN,
        request: {
          method: 'signTransaction',
          params,
        },
      },
    }) as any;
  }
}
