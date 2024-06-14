// development
export const NetworkList = ['MainNet', 'TestNet'] as const;
export const environments = {
  N3T4: {
    HTTPS_NEONJS_URL: 'https://n3seed2.ngd.network:20332',
    HTTPS_NEOFURA_URL: 'https://testneofura.ngd.network:444',
    NEONJS_MAGIC_NUMBER: 877933390,
  },
  N3T5: {
    HTTPS_NEONJS_URL: 'https://n3seed2.ngd.network:40332',
    HTTPS_NEOFURA_URL: 'https://testmagnet.ngd.network',
    NEONJS_MAGIC_NUMBER: 894710606,
  },
  MainNet: {
    HTTPS_NEONJS_URL: 'https://n3seed2.ngd.network:10332',
    HTTPS_NEOFURA_URL: 'https://neofura.ngd.network',
    NEONJS_MAGIC_NUMBER: 860833102,
  },
};

// wallet
export const DEFAULT_GAS_DECIMAL = 8;
