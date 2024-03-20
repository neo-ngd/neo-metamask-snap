'use client';

// import { Component, ComponentType, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
// import { Subtract } from 'utility-types';
import { RootStore } from './base';

export { RootStore } from './base';

export const StoreContext = createContext({} as RootStore);

export function useStore() {
  return useContext(StoreContext);
}

const store = new RootStore();

export const StoreContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

// export function withStore<P extends { store: RootStore }>(C: ComponentType<P>) {
//   return class StoreComponent extends Component<
//     Subtract<P, { store: RootStore }>
//   > {
//     static contextType = StoreContext;
//     render() {
//       return <C {...(this.props as P)} store={this.context} />;
//     }
//   };
// }
