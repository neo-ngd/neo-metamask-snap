import { makeObservable } from 'mobx';
import { nonenumerable } from 'toxic-decorators';
import type { RootStore } from './base';

export class ChildStore {
  @nonenumerable
  protected root: RootStore;

  constructor(root: RootStore) {
    this.root = root;
    makeObservable(this);
  }
}
