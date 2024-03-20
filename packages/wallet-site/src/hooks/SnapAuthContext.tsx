'use client';

import { observer } from 'mobx-react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/store';

export const SnapAuthContext = observer(
  ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { walletStore } = useStore();
    const [authorized, setAuthorized] = useState(false);

    const authCheck = useCallback(() => {
      const publicPaths = ['/'];
      const path = pathname.split('?')[0];
      if (!walletStore.activeAddress && !publicPaths.includes(path)) {
        router.replace('/');
        return;
      }
      setAuthorized(true);
    }, [router, walletStore.activeAddress, pathname]);

    useEffect(() => {
      walletStore.fetchActiveAddress();
      authCheck();
    }, [authCheck, walletStore]);

    return authorized && children;
  },
);
