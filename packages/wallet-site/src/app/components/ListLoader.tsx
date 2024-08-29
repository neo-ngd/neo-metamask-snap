import Image from 'next/image';
import indicator from '@/assets/icons/loading.png';
import '@/app/styles/loader.css';

export const ListLoader = () => {
  return (
    <div className="list-loader-indicator-box">
      <Image src={indicator} className="list-loader-indicator" alt="loader" />
    </div>
  );
};
