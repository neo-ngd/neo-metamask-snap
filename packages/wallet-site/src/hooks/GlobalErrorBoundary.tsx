'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import { BaseError } from '@/utils/errors';

export const GlobalErrorBoundary = ({ children }: { children: ReactNode }) => {
  const globalPromiseRejectionHandler = async (
    event: PromiseRejectionEvent,
  ) => {
    if (event.reason instanceof BaseError) {
      const errorMsg = await event.reason.getLocalMessage();
      toast.error(errorMsg);
      event.preventDefault();
    }
  };

  useEffect(() => {
    window.onunhandledrejection = globalPromiseRejectionHandler;
    return () => {
      window.onunhandledrejection = null;
    };
  }, []);

  const resetHome = () => {
    window.open('/', '_self');
  };

  const renderPopupError = (fallback: FallbackProps) => {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <p>Something went wrong.</p>
        <p>{fallback.error.message}</p>
        <p>{fallback.error.stack}</p>
        <button
          onClick={resetHome}
          className="rounded-xl p-8 bg-themeBlue text-white"
        >
          Return to Top
        </button>
      </div>
    );
  };
  return (
    <ErrorBoundary fallbackRender={renderPopupError}>{children}</ErrorBoundary>
  );
};
