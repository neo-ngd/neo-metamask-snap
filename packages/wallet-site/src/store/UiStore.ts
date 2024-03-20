import { action, makeObservable, observable } from 'mobx';
import type { ReactNode } from 'react';
import type { RootStore } from './base';
import { ChildStore } from './child';

export class UiStore extends ChildStore {
  @observable
  loading = false;

  @observable
  coverContent: ReactNode | undefined = undefined;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this);
  }

  @action
  setLoading(value: boolean) {
    this.loading = value;
  }

  @action
  setCover(node: ReactNode | undefined) {
    this.coverContent = node;
  }

  clearCover() {
    this.setCover(undefined);
  }
}
