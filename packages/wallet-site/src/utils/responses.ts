import { alias, object, serializable } from 'serializr';
import {
  Asset,
  Balance,
  FaultDetail,
  Transaction,
  Transfer,
} from '@/utils/models';

export class AssetResponse extends Asset {
  @serializable(alias('hash'))
  contractHash = '';

  @serializable(alias('firsttransfertime'))
  firstTransferTime = 0;

  @serializable(alias('tokenname'))
  tokenName = '';

  @serializable(alias('ispopular'))
  isPopular = false;

  @serializable(alias('totalsupply'))
  totalSupply = '';
}

export class BalanceResponse extends Balance {
  @serializable(alias('asset'))
  contractHash = '';

  @serializable(alias('tokenid'))
  tokenId = '';

  @serializable(alias('balance'))
  amount = '';
}

export class TransactionResponse extends Transaction {
  @serializable(alias('hash'))
  txid = '';

  @serializable(alias('blockhash'))
  blockHash = '';

  @serializable(alias('blocktime'))
  blockTime = 0;

  @serializable(alias('netfee'))
  netFee = 0;

  @serializable(alias('sysfee'))
  sysFee = 0;

  @serializable(alias('faultdetail', object(FaultDetail)))
  faultDetail: FaultDetail = new FaultDetail();
}

export class TransferResponse extends Transfer {
  @serializable(alias('frombalance'))
  fromBalance = '';

  @serializable(alias('tobalance'))
  toBalance = '';

  @serializable(alias('netfee'))
  netFee = 0;

  @serializable(alias('sysfee'))
  sysFee = 0;
}
