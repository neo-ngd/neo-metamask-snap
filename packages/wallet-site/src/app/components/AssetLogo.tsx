'use client';

import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import defaultImageAsset from '@/assets/icons/defaultAssetLogo.png';

type Props = {
  uri: string;
  size?: number;
};

export const AssetLogo: FC<Props> = props => {
  const [src, setSrc] = useState<string | StaticImport>(props.uri);

  useEffect(() => {
    if (props.uri) {
      setSrc(props.uri);
    } else {
      setSrc(defaultImageAsset.src);
    }
  }, [props.uri]);

  const onError = () => {
    setSrc(defaultImageAsset);
  };

  return (
    <Image
      onError={onError}
      src={src}
      width={props.size ? props.size : 30}
      height={props.size ? props.size : 30}
      alt="logo"
    />
  );
};
