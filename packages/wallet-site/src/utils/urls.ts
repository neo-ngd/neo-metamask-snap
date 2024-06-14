import * as storage from '@/utils/storage';
import {
  environments,
  HTTPS_ASSET_LOGO_PREFIX,
  HTTPS_SERVER_URL,
} from './values';

export function getEnvironment() {
  const network = storage.getAppNetwork();
  if (network === 'MainNet') {
    return environments.MainNet;
  }
  return environments.TestNet;
}

export function getNeonJsUrl() {
  const env = getEnvironment();
  return env.HTTPS_NEONJS_URL;
}

export function getNeoFuraUrl() {
  const env = getEnvironment();
  return env.HTTPS_NEOFURA_URL;
}

export function getNeoBrowserUrl() {
  const env = getEnvironment();
  return env.HTTPS_NEO_BROWSER_URL;
}

export function getNeoBrowserNep17TokenUrl() {
  const env = getEnvironment();
  return env.HTTPS_NEO_BROWSER_NEP17_TOKEN_URL;
}

export function getNeoBrowserNep11TokenUrl() {
  const env = getEnvironment();
  return env.HTTPS_NEO_BROWSER_NEP11_TOKEN_URL;
}

export function getNNSContract() {
  const env = getEnvironment();
  return env.NNS_CONTRACT;
}

export function getNeoBrowserNFTUrl() {
  const env = getEnvironment();
  return env.HTTPS_NEO_BROWSER_NFT_URL;
}

export function getNeoBrowserAddressUrl() {
  const env = getEnvironment();
  return env.HTTPS_NEO_BROWSER_ADDRESS_URL;
}

export function getServerUrl() {
  return HTTPS_SERVER_URL;
}

export function getAssetLogoUrl() {
  return HTTPS_ASSET_LOGO_PREFIX;
}
