import { action, computed, makeObservable, observable } from 'mobx';
import type { Transfer } from '@/utils/models';
import {
  addConfrimingTransfer,
  deleteConfrimingTransfers,
  getConfrimingTransferList,
} from '@/utils/storage';
import type { RootStore } from './base';
import { ChildStore } from './child';

export class TransferStore extends ChildStore {
  @observable
  confirmingTransfers: Transfer[] = [];

  constructor(root: RootStore) {
    super(root);
    makeObservable(this);
  }

  @computed.struct
  get confirmingNep17Transfers() {
    return this.confirmingTransfers.filter((t) => !t.tokenId);
  }

  @action
  setConfirmingTransfers(transfers: Transfer[]) {
    this.confirmingTransfers = transfers;
  }

  fetchConfirmingTransfers() {
    const confirming = getConfrimingTransferList();
    this.setConfirmingTransfers(confirming);
  }

  addConfirmingTransfer(transfer: Transfer) {
    addConfrimingTransfer(transfer);
    this.fetchConfirmingTransfers();
  }

  deleteConfirming(txid: string) {
    deleteConfrimingTransfers([txid]);
    this.fetchConfirmingTransfers();
  }
}
