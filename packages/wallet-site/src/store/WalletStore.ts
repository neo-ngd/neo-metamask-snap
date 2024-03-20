import { action, computed, makeObservable, observable } from 'mobx';
import * as request from '@/utils/httpApi';
import type { Balance } from '@/utils/models';
import {
  getAppActiveAddress,
  getAppAssetsVisible,
  setAppActiveAddress,
  setAppAssetsVisible,
} from '@/utils/storage';
import type { RootStore } from './base';
import { ChildStore } from './child';

export class WalletStore extends ChildStore {
  @observable
  activeAddress = '';

  @observable
  assetsVisible = true;

  @observable
  activeBalances: Balance[] = [];

  constructor(root: RootStore) {
    super(root);
    makeObservable(this);
  }

  @action
  setActiveAddress(address: string) {
    this.activeAddress = address;
  }

  @action
  setAssetsVisible(visible: boolean) {
    this.assetsVisible = visible;
  }

  @action
  setActiveBalances(balances: Balance[]) {
    this.activeBalances = balances;
  }

  @computed.struct
  get activeNep17Balances() {
    const nep17Assets = this.activeBalances.filter((a) => !a.tokenId);
    return nep17Assets;
  }

  fetchActiveAddress() {
    const address = getAppActiveAddress();
    this.setActiveAddress(address);
  }

  saveActiveAddress(address: string) {
    setAppActiveAddress(address);
    this.fetchActiveAddress();
  }

  fetchAssetsVisible() {
    const visible = getAppAssetsVisible();
    this.setAssetsVisible(visible);
  }

  saveAssetsVisible(visible: boolean) {
    setAppAssetsVisible(visible);
    this.fetchAssetsVisible();
  }

  async fetchActiveBalances() {
    const balances = this.activeAddress
      ? await request.getAssetHeldByAddress(this.activeAddress)
      : [];
    this.setActiveBalances(balances);
  }
}
