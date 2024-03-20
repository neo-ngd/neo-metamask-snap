import { JsonRpcError } from '@neongd/json-rpc';
import type { InvokeParams, InvokeResult } from '@neongd/neo-dapi';

import { decimalToInteger } from '../src/utils/convertors';
import { getSigningProvider } from '../src/utils/signingProvider';

async function executeInvoke(params: InvokeParams) {
  const signingProvider = await getSigningProvider();
  const dry = await signingProvider.prepareTransaction({
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

  console.log('dry', dry);

  const result = await signingProvider.request<InvokeResult>({
    method: 'invoke',
    params,
  });
  return result;
}

describe('invoke-test', () => {
  it('executeInvoke', async () => {
    const transferParams: InvokeParams = {
      scriptHash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
      operation: 'transfer',
      args: [
        { type: 'Hash160', value: 'Ng95YFEWL4rq3rs3h1vW8Bkq652hsWPBNb' },
        { type: 'Hash160', value: 'NYAhSbcuJwipU4pzutfDPZ1ZV6jRiGXhcA' },
        {
          type: 'Integer',
          value: decimalToInteger('1', 8),
        },
        { type: 'Any', value: '' },
      ],
      broadcastOverride: true,
    };
    try {
      const res = await executeInvoke(transferParams);
      console.log('executeInvoke result:', res);
    } catch (err) {
      console.log('error', JSON.stringify(err));
      console.log(
        'JsonRpcError',
        err instanceof JsonRpcError,
        'error',
        (err as any).message,
      );
      throw err;
    }
    expect(100).toBe(100);
  });
});
