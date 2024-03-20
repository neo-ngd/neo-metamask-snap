import { makeObservable, observable } from 'mobx';
import { AssetStore } from './AssetStore';
import { TransferStore } from './TransferStore';
import { UiStore } from './UiStore';
import { WalletStore } from './WalletStore';

export class RootStore {
  @observable
  walletStore = new WalletStore(this);

  @observable
  uiStore = new UiStore(this);

  @observable
  assetStore = new AssetStore(this);

  @observable
  transferStore = new TransferStore(this);

  constructor() {
    makeObservable(this);
  }
}
