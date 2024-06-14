import { observer } from 'mobx-react';
import Image from 'next/image';
import type { FC } from 'react';
import emptyImage from '@/assets/icons/empty.png';

type Props = {
  title?: string;
  desc?: string;
};

export const EmptyListView: FC<Props> = observer(props => {
  return (
    <div className="flex flex-col items-center">
      <Image src={emptyImage} width={60} height={60} alt="empty" />
      <p className="mt-1 text-base">{props.title}</p>
      <p className="mt-0.5 text-base">{props.desc}</p>
    </div>
  );
});
