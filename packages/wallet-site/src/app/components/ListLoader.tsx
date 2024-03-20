import Image from 'next/image';
import type { FC } from 'react';
import indicator from '@/assets/icons/loading.png';
import '@/app/styles/loader.css';

export const ListLoader: FC = () => {
  return (
    <div className="list-loader-indicator-box">
      <Image src={indicator} className="list-loader-indicator" alt="loader" />
    </div>
  );
};
