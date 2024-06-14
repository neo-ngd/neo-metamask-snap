'use client';

import { observer } from 'mobx-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import { useContext, useEffect } from 'react';
import logo from '@/assets/icons/logo.svg';
import logoChrome from '@/assets/icons/logoChrome.png';
import logoMetamask from '@/assets/icons/metamask_fox.svg';
import background from '@/assets/landing_back.svg';
import { allowedSnapVersion, defaultSnapOrigin } from '@/config/snap';
import { getSnapWallet } from '@/dapi';
import { MetamaskActions, MetaMaskContext } from '@/hooks/MetamaskContext';
import { useStore } from '@/store';
import { connectSnap, getSnap } from '@/utils/snap';
import { setAppNetwork } from '@/utils/storage';
import { HTTPS_VITAL_CHROME_STORE } from '@/utils/values';

const Home: FC = observer(() => {
  const router = useRouter();
  const { t } = useTranslation();
  const { walletStore } = useStore();

  const [state, dispatch] = useContext(MetaMaskContext);

  const initStoreWithSnapAndNavi = async () => {
    const snapWallet = getSnapWallet();
    const snapNetwork = await snapWallet.getNetworks();
    setAppNetwork(snapNetwork.defaultNetwork);
    const account = await snapWallet.getAccount();
    walletStore.saveActiveAddress(account.address);
  };

  const login = async () => {
    try {
      const version = allowedSnapVersion;
      await connectSnap(defaultSnapOrigin, { version });
      const installedSnap = await getSnap(version);
      console.log('installedSnap', installedSnap);
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
      await initStoreWithSnapAndNavi();
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  useEffect(() => {
    walletStore.saveActiveAddress('');
  }, [walletStore]);

  useEffect(() => {
    (async () => {
      const { activeAddress } = walletStore;
      if (state.installedSnap && activeAddress) {
        router.push('/wallet');
      }
    })();
  }, [router, state.installedSnap, walletStore, walletStore.activeAddress]);

  const goToChromeStore = () => {
    window.open(HTTPS_VITAL_CHROME_STORE, '_blank');
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center mt-5 mx-[90px] justify-between">
        <Image src={logo} width={60} alt="logo" />
        <button
          className="px-6 py-4 my-0.5 rounded-2xl bg-themeBlue"
          onClick={login}>
          <p className="text-base text-white">{t('index.connect')}</p>
        </button>
      </div>
    );
  };

  const renderBody = () => {
    return (
      <div className="w-[615px] h-[400px] mt-[70px] mx-[90px]">
        <p className="text-lg text-indexGray">{t('index.title')}</p>
        <div className="bg-indexSeparator/20 h-px w-[195px] my-2.5" />
        <p className="text-[70px] text-themeDark font-semibold leading-[120%]">
          {t('index.desc')}
        </p>
        <div className="flex flex-row mt-10 items-center">
          <button
            onClick={login}
            className="flex flex-row rounded-xl bg-themeBlue px-[30px] py-[18px] mr-6">
            <Image src={logoMetamask} width={24} alt="metamask_logo" />
            <p className="text-base text-white ml-2.5">{t('index.useSnap')}</p>
          </button>
          <button
            onClick={goToChromeStore}
            className="flex flex-row rounded-xl bg-transparent px-[30px] py-[16px] border-2 border-themeBlue">
            <Image src={logoChrome} width={24} alt="chrome_logo" />
            <p className="text-base text-themeBlue ml-2.5">
              {t('index.download')}
            </p>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-portal h-portal justify-center relative">
        <Image src={background} width={1440} alt={'portal_back'} priority />
        <div className="w-full h-full absolute">
          {renderHeader()}
          {renderBody()}
        </div>
      </div>
    </div>
  );
});

export default Home;
