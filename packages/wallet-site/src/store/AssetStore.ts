import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { action, computed, makeObservable, observable } from 'mobx';
import { integerToDecimal } from '@/utils/convertors';
import * as request from '@/utils/httpApi';
import type { Asset, Balance } from '@/utils/models';
import { AssetPrice } from '@/utils/models';
import * as storage from '@/utils/storage';
import {
  ASSET_TYPE_NEP11,
  ASSET_TYPE_NEP17,
  HTTPS_ASSET_LOGO_PREFIX,
  SECONDS_1_DAY,
} from '@/utils/values';
import { DefaultAssets, GasContractHash, isDefaultAsset } from '@/utils/wallet';
import type { RootStore } from './base';
import { ChildStore } from './child';

export class AssetStore extends ChildStore {
  @observable
  assets: Asset[] = [];

  @observable
  assetPrices: AssetPrice[] = [];

  constructor(root: RootStore) {
    super(root);
    makeObservable(this);
  }

  @action
  setAssets(assets: Asset[]) {
    this.assets = assets;
  }

  @action
  setAssetPrices(prices: AssetPrice[]) {
    this.assetPrices = prices;
  }

  @computed.struct
  get nep17Assets() {
    return this.assets.filter((a) => a.symbol && a.type === ASSET_TYPE_NEP17);
  }

  @computed
  get gasAsset() {
    return this.assets.find((a) => a.contractHash === GasContractHash);
  }

  fetchAssets() {
    const assets = storage.getAssetList();
    this.setAssets(assets);
  }

  getSortedNep17WatchAssetsByBalances(value: Balance[]) {
    const otherAssetList = this.nep17Assets.filter((asset) => {
      if (isDefaultAsset(asset.contractHash)) {
        return false;
      }
      const balanceIndex = value.findIndex(
        (b) => b.contractHash === asset.contractHash,
      );
      if (balanceIndex >= 0) {
        return true;
      }
      return false;
    });

    const otherSortList = otherAssetList.sort((a, b) => {
      const aBalance = value.find(
        (balance) => balance.contractHash === a.contractHash,
      );
      const aAmount = integerToDecimal(
        aBalance ? aBalance.amount : '0',
        a.decimals,
      );
      const aAmountNumber = new BigNumber(aAmount ?? 0);
      const aPrice = this.assetPrices.find(
        (p) => p.contractHash === a.contractHash,
      );
      const aWorth = aAmountNumber.times(aPrice ? aPrice.price : 0);

      const bBalance = value.find(
        (balance) => balance.contractHash === b.contractHash,
      );
      const bAmount = integerToDecimal(
        bBalance ? bBalance.amount : '0',
        b.decimals,
      );
      const bAmountNumber = new BigNumber(bAmount ?? 0);
      const bPrice = this.assetPrices.find(
        (p) => p.contractHash === b.contractHash,
      );
      const bWorth = bAmountNumber.times(bPrice ? bPrice.price : 0);

      if (aWorth.isGreaterThan(bWorth)) {
        return -1;
      } else if (aWorth.isLessThan(bWorth)) {
        return 1;
      }

      // balance equal
      return a.symbol.localeCompare(b.symbol);
    });
    const list = DefaultAssets.concat(otherSortList);
    return list;
  }

  async updateAssetPrices(hashList: string[]) {
    const priceList = await request.getAssetPrice(hashList);
    if (hashList.length === priceList.length) {
      const assetPriceList = hashList.map((h, index) => {
        const assetPrice = new AssetPrice();
        assetPrice.contractHash = h;
        assetPrice.price = priceList[index];
        return assetPrice;
      });
      this.setAssetPrices(assetPriceList);
    }
  }

  async updateAssets() {
    const assetListExpire = storage.getAssetListExpire();
    const timestampNow = dayjs().unix();
    const bigNow = new BigNumber(timestampNow);
    const localAssetList = storage.getAssetList();
    if (assetListExpire.isLessThan(bigNow) || localAssetList.length <= 0) {
      const assets = await request.getAssetInfos();
      storage.setAssetList(assets);
      const newExpire = new BigNumber(timestampNow + SECONDS_1_DAY);
      storage.setAssetListExpire(newExpire);
    }
    this.fetchAssets();
    const hashList = this.assets.map((t) => t.contractHash);
    await this.updateAssetPrices(hashList);
  }

  getAssetLogoUrl(contrackHash: string) {
    const baseURL = HTTPS_ASSET_LOGO_PREFIX;
    const fixed = baseURL.replace('{0}', contrackHash);
    return fixed;
  }

  isNep11Asset(asset: Asset) {
    return asset.type === ASSET_TYPE_NEP11;
  }

  isNep17Asset(asset: Asset) {
    return asset.type === ASSET_TYPE_NEP17;
  }

  isNeoAsset(asset: Asset) {
    return this.isNep11Asset(asset) || this.isNep17Asset(asset);
  }
}
