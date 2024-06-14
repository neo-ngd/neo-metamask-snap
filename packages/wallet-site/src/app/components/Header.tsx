import Image from 'next/image';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import logo from '@/assets/icons/logo.svg';
import profileImage from '@/assets/icons/profile.svg';
import { NetworkSelect } from './NetworkSelect';

export type HeaderFilter = 'assets' | 'nfts' | 'swap' | 'history' | 'settings';

type Props = {
  current: HeaderFilter;
  onChangeNetwork?: () => void;
};

export const Header: FC<Props> = props => {
  const { t } = useTranslation();

  const renderLink = (text: string, filter: HeaderFilter, current: boolean) => {
    let route = '/';
    if (filter === 'assets') {
      route = '/wallet';
    } else if (filter === 'history') {
      route = '/history';
    }
    return (
      <Link href={route} className="mr-[50px]">
        <p
          className={`text-lg leading-[22px] ${
            current ? 'text-themeDark' : 'text-themeGray'
          }`}>
          {text}
        </p>
      </Link>
    );
  };

  return (
    <div className="min-w-portal flex flex-row items-center justify-between pt-5 px-[90px]">
      <div className="flex flex-row items-center">
        <Link href={'/'}>
          <Image src={logo} width={60} alt="logo" className="mr-[40px]" />
        </Link>
        {renderLink(
          t('components.header.assets'),
          'assets',
          props.current === 'assets',
        )}
        {/* {renderLink(t("components.header.nfts"), props.current === "nfts")}
        {renderLink(t("components.header.swap"), props.current === "swap")} */}
        {renderLink(
          t('components.header.history'),
          'history',
          props.current === 'history',
        )}
        {/* {renderLink(
          t("components.header.settings"),
          props.current === "settings"
        )} */}
      </div>
      <div className="flex flex-row items-center">
        <NetworkSelect onChange={props.onChangeNetwork} />
        <Image
          src={profileImage}
          width={40}
          height={40}
          alt="profile"
          className="ml-10"
        />
      </div>
    </div>
  );
};
