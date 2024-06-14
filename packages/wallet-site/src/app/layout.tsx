import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { ConfirmingTransferChecker } from '@/hooks/ConfirmingTransferChecker';
import { GlobalErrorBoundary } from '@/hooks/GlobalErrorBoundary';
import { MetaMaskProvider } from '@/hooks/MetamaskContext';
import { SnapAuthContext } from '@/hooks/SnapAuthContext';
import { StoreContextProvider } from '@/store';
import { Loading } from './components/Loading';
import { PageCover } from './components/PageCover';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vital+',
  description: 'Vital for Metamask snap',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-screen min-w-screen justify-center items-start`}>
        <StoreContextProvider>
          <GlobalErrorBoundary>
            <SnapAuthContext>
              <MetaMaskProvider>
                <ConfirmingTransferChecker>
                  {children}
                  <ToastContainer />
                  <PageCover />
                  <Loading />
                </ConfirmingTransferChecker>
              </MetaMaskProvider>
            </SnapAuthContext>
          </GlobalErrorBoundary>
        </StoreContextProvider>
      </body>
    </html>
  );
}
