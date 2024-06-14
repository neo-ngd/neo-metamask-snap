import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        portal: '1440px',
        assetCell: '192px',
        historyDetail: '500px',
        historyAmount: '200px',
      },
      minWidth: {
        portal: '1440px',
        asset: '1008px',
      },
      height: {
        portal: '800px',
      },
      minHeight: {
        portal: '800px',
      },
      colors: {
        themeBlue: '#3774fa',
        themeGreen: '#00e599',
        themeRed: '#f53f3f',
        themeDark: '#141416',
        themeGray: '#606060',
        themeTextGray: '#828282',
        themePlaceholderTextGray: '#9596a6',
        themeTimeTextGray: '#64748b',

        indexGray: '#676767',
        indexSeparator: '#201f1f',
        indexHistorySeparator: '#ebe9e9',

        networkSelectGreen: '#00e599',
        networkSelectBack: '#efefef',

        popupTitle: '#23262f',
        popupDesc: '#010101',
      },
      boxShadow: {
        asset: '-9px 18px 91px 0px rgba(197, 197, 197, 0.25)',
        assetCell: '0px 4px 10px 0px rgba(197, 197, 197, 0.25)',
        history: '0px 10px 91px 0px rgba(197, 197, 197, 0.25)',
        popup: '18px 18px 88px 0px rgba(20, 20, 22, 0.10)',
      },
    },
  },
  plugins: [],
};
export default config;
