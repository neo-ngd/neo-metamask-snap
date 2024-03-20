// development
export const NetworkList = ['MainNet', 'TestNet'];
export const environments = {
  TestNet: {
    HTTPS_NEONJS_URL: 'https://n3seed2.ngd.network:40332',
    HTTPS_NEOFURA_URL: 'https://testmagnet.ngd.network',
    HTTPS_NEO_BROWSER_URL:
      'https://testmagnet.explorer.onegate.space/transactionInfo/{0}',
    HTTPS_NEO_BROWSER_NEP17_TOKEN_URL:
      'https://testmagnet.explorer.onegate.space/Nep17tokeninfo/{0}',
    HTTPS_NEO_BROWSER_NEP11_TOKEN_URL:
      'https://testmagnet.explorer.onegate.space/NFTtokeninfo/{0}',
    HTTPS_NEO_BROWSER_NFT_URL:
      'https://testmagnet.explorer.onegate.space/NFTinfo/{0}/{1}/{2}',
    HTTPS_NEO_BROWSER_ADDRESS_URL:
      'https://testmagnet.explorer.onegate.space/accountprofile/{0}',
    NEONJS_MAGIC_NUMBER: 894710606,
    NNS_CONTRACT: '0x50ac1c37690cc2cfc594472833cf57505d5f46de',
  },
  MainNet: {
    HTTPS_NEONJS_URL: 'https://n3seed2.ngd.network:10332',
    HTTPS_NEOFURA_URL: 'https://neofura.ngd.network',
    HTTPS_NEO_BROWSER_URL: 'https://explorer.onegate.space/transactionInfo/{0}',
    HTTPS_NEO_BROWSER_NEP17_TOKEN_URL:
      'https://explorer.onegate.space/Nep17tokeninfo/{0}',
    HTTPS_NEO_BROWSER_NEP11_TOKEN_URL:
      'https://explorer.onegate.space/NFTtokeninfo/{0}',
    HTTPS_NEO_BROWSER_NFT_URL:
      'https://explorer.onegate.space/NFTinfo/{0}/{1}/{2}',
    HTTPS_NEO_BROWSER_ADDRESS_URL:
      'https://explorer.onegate.space/accountprofile/{0}',
    NEONJS_MAGIC_NUMBER: 860833102,
    NNS_CONTRACT: '0x50ac1c37690cc2cfc594472833cf57505d5f46de',
  },
};

// should add to info.plist if request is http
export const HTTPS_SERVER_URL = 'https://onegate.space';
export const HTTPS_ASSET_LOGO_PREFIX = 'https://neo.org/images/gui/{0}.png';
export const HTTPS_ONEGATE_HOME = 'https://onegate.space';
export const HTTPS_TWITTER_HOME = 'https://twitter.com/OneGateWallet';
export const HTTPS_TERMS_URL = 'https://onegate.space/terms.html';
export const HTTPS_PRIVACY_URL = 'https://onegate.space/privacy.html';
export const HTTPS_IPFS_HOST_URL = 'https://ipfs.infura.io/ipfs/';
export const HTTPS_FAVICON_URL =
  'https://s2.googleusercontent.com/s2/favicons?domain_url=%domain%&sz=%size%';
export const HTTPS_VITAL_CHROME_STORE =
  'https://chromewebstore.google.com/detail/vital-extension/kelgachjdnblhfikknkhfkhidbdpiokb';

// wallet
export const APP_NAME = 'Vital+';
export const INVISIBLE_ASSET = '****';
export const INVISIBLE_TOTAL_BALANCE = '******';
export const DEFAULT_WALLET_NAME = 'My Wallet';
export const DEFAULT_GAS_DECIMAL = 8;
export const DEFAULT_AMOUNT_DECIMAL = 6;
export const DEFAULT_ASSET_LOGO_URI = 'default';
export const MAX_UPLOAD_IMAGE_COUNT = 6;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 30;
export const UNKNOWN_TOKEN_SYMBOL = 'Unknown';
export const UNKNOWN_TRANSFER_TYPE = 'Unknown';
export const ASSET_TYPE_NEP11 = 'NEP11';
export const ASSET_TYPE_NEP17 = 'NEP17';
export const NFT_SYMBOL = 'NFT';
export const UNKNOWN_SYMBOL = '--';
export const MILLISECONDS_30_DAYS = 2592000000;
export const MILLISECONDS_1_DAYS = 86400000;
export const SECONDS_1_DAY = 86400;
export const AXIOS_TIMEOUT = 120000;
export const OPERATION_TRANSFER = 'transfer';
export const MILLISECONDS_1_MINUTE = 60000;
export const DUMMY_SEND_ADDRESS = 'NbkZr4dWEqHP1WmwYJvKx4C2RvKEHVM9wM'; // for dummy gas send fee calculate
export const DUMMY_SEND_FEE_SCALE = 1.05;

export type ASSET_TYPE = 'NEP11' | 'NEP17' | 'Unknown';
export const UNKNOWN_DAPP = 'Unknown';

export const ACTIVITY_RECORD_LIMIT = 10;
