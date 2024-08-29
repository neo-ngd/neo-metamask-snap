'use client';

import { observer } from 'mobx-react';
import { ListLoader } from '@/app/components/ListLoader';
import { useStore } from '@/store';
import '@/app/styles/loader.css';

export const Loading = observer(() => {
  const { uiStore } = useStore();

  if (!uiStore.loading) {
    return null;
  }

  return (
    <div className="app-loading">
      <ListLoader />
    </div>
  );
});
