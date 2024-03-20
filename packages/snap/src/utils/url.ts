import { environments } from './constants';
import { getAppNetwork } from './env';

export async function getEnvironment() {
  const network = await getAppNetwork();
  if (network === 'MainNet') {
    return environments.MainNet;
  } else if (network === 'N3T4') {
    return environments.N3T4;
  }
  return environments.N3T5;
}
