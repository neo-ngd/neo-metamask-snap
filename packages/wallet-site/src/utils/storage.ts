import BigNumber from 'bignumber.js';
import { deserialize, serialize } from 'serializr';
import { Asset, Transfer } from './models';

const STORAGE_KEY = {
  APP_NETWORK: 'appNetwork',
  ACTIVE_ADDRESS: 'activeAddress',
  ASSET_LIST: 'assetList',
  ASSET_LIST_EXPIRE: 'assetListExpire',
  ASSETS_VISIBLE: 'assetsVisible',
  CONFIRMING_TRANSER_LIST: 'confirmingTransferList',
};

/*
 * localStorage
 */

export function getAppNetwork() {
  const result = localStorage.getItem(STORAGE_KEY.APP_NETWORK);
  return result;
}

export function setAppNetwork(network: string) {
  localStorage.setItem(STORAGE_KEY.APP_NETWORK, network);
}

export function getAppAssetsVisible() {
  const result = localStorage.getItem(STORAGE_KEY.ASSETS_VISIBLE);
  if (result === null) {
    return true;
  }

  if (result === 'true') {
    return true;
  }
  return false;
}

export function setAppAssetsVisible(visible: boolean) {
  localStorage.setItem(STORAGE_KEY.ASSETS_VISIBLE, visible.toString());
}

export function getAssetList() {
  const assetList = localStorage.getItem(STORAGE_KEY.ASSET_LIST);
  return deserialize(Asset, assetList ? (JSON.parse(assetList) as []) : []);
}

export function setAssetList(assets: Asset[]) {
  localStorage.setItem(
    STORAGE_KEY.ASSET_LIST,
    JSON.stringify(serialize(Asset, assets)),
  );
}

export function getAssetListExpire() {
  const assetListExpire = localStorage.getItem(STORAGE_KEY.ASSET_LIST_EXPIRE);
  const timestamp = new BigNumber(
    assetListExpire === null ? '0' : assetListExpire,
  );
  return timestamp;
}

export function setAssetListExpire(expire: BigNumber) {
  localStorage.setItem(STORAGE_KEY.ASSET_LIST_EXPIRE, expire.toString());
}

/*
 * sessionStorage
 */

export function getAppActiveAddress() {
  const result = sessionStorage.getItem(STORAGE_KEY.ACTIVE_ADDRESS);
  return result ?? '';
}

export function setAppActiveAddress(address: string) {
  sessionStorage.setItem(STORAGE_KEY.ACTIVE_ADDRESS, address);
}

export function getConfrimingTransferList() {
  const transferList = sessionStorage.getItem(
    STORAGE_KEY.CONFIRMING_TRANSER_LIST,
  );
  return deserialize(
    Transfer,
    transferList ? (JSON.parse(transferList) as []) : [],
  );
}

export function addConfrimingTransfer(transfer: Transfer) {
  const transferList = getConfrimingTransferList();
  if (transferList.findIndex((t) => t.txid === transfer.txid) >= 0) {
    return; // already exists
  }
  transferList.push(transfer);
  sessionStorage.setItem(
    STORAGE_KEY.CONFIRMING_TRANSER_LIST,
    JSON.stringify(serialize(Transfer, transferList)),
  );
}

export function deleteConfrimingTransfers(txids: string[]) {
  const transferList = getConfrimingTransferList();
  const newList = transferList.filter((tx) => {
    return !txids.includes(tx.txid);
  });
  sessionStorage.setItem(
    STORAGE_KEY.CONFIRMING_TRANSER_LIST,
    JSON.stringify(serialize(Transfer, newList)),
  );
}
