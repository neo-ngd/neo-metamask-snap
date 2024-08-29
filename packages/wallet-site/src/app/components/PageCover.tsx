'use client';

import { observer } from 'mobx-react';
import { useStore } from '@/store';

export const PageCover = observer(() => {
  const { uiStore } = useStore();

  const clearCover = () => {
    uiStore.clearCover();
  };

  if (uiStore.coverContent) {
    return (
      <div className="fixed min-w-full min-h-full top-0 left-0">
        <div
          className="min-w-screen min-h-screen bg-themeTextGray opacity-30"
          onClick={clearCover}
        />
        <div className="absolute mx-0 top-24 left-1/2 right-1/2">
          {uiStore.coverContent}
        </div>
      </div>
    );
  }
  return null;
});
