import { Buffer } from 'buffer';
import BigNumber from 'bignumber.js';
import { list, object, primitive, serializable } from 'serializr';
import { OPERATION_TRANSFER, UNKNOWN_TOKEN_SYMBOL } from './values';

export class Asset {
  @serializable
  contractHash = '';

  @serializable
  firstTransferTime = 0;

  @serializable
  holders = 0;

  @serializable
  symbol: string = UNKNOWN_TOKEN_SYMBOL;

  @serializable
  decimals = 0;

  @serializable
  tokenName = '';

  @serializable
  isPopular = false;

  @serializable
  totalSupply = '';

  @serializable
  type = '';
}

export class AssetList {
  @serializable(list(object(Asset)))
  assets: Asset[] = [];

  @serializable
  createTime = 0;
}

export class AssetPrice {
  @serializable
  contractHash = '';

  @serializable
  price = 0;
}

export class Balance {
  @serializable
  address = '';

  @serializable
  contractHash = '';

  @serializable
  tokenId = '';

  @serializable
  amount = '';
}

export class Token {
  @serializable
  contractHash = '';

  @serializable
  tokenId = '';

  @serializable
  image = '';

  @serializable
  video = '';

  @serializable
  name = '';
}

type vmState = 'HALT' | 'FAULT' | '';

export class Transfer {
  @serializable
  _id = '';

  @serializable
  contract = '';

  @serializable
  from = '';

  @serializable
  fromBalance = '';

  @serializable
  to = '';

  @serializable
  toBalance = '';

  @serializable
  txid = '';

  @serializable
  vmstate: vmState = '';

  @serializable
  value = '';

  @serializable
  tokenId = '';

  @serializable
  netFee = 0;

  @serializable
  sysFee = 0;

  @serializable
  timestamp = 0;

  get status(): ActivityStatus {
    if (this.vmstate === 'HALT') {
      return 'succeeded';
    } else if (this.vmstate === 'FAULT') {
      return 'failed';
    }
    return 'confirming';
  }
}

export class InvokeResult {
  @serializable
  txid = '';

  @serializable
  signedTx = '';

  @serializable
  nodeUrl = '';
}

export class Signer {
  @serializable
  account = '';

  @serializable
  scopes = '';
}

export class Witness {
  @serializable
  invocation = '';

  @serializable
  verification = '';
}

export class FaultDetail {
  @serializable
  _id = '';

  @serializable
  callFlags = '';

  @serializable
  vmstate: vmState = '';

  @serializable
  txid = '';

  @serializable
  originSender = '';

  @serializable
  contractHash = '';

  @serializable
  method = '';

  @serializable(list(primitive()))
  hexStringParams: string[] = [];
}

export class Transaction {
  @serializable
  _id = '';

  @serializable
  txid = '';

  @serializable
  blockIndex = '';

  @serializable
  blockHash = '';

  @serializable
  blockTime = 0;

  @serializable
  netFee = 0;

  @serializable
  nonce = 0;

  @serializable
  script = '';

  @serializable
  sender = '';

  @serializable
  size = 0;

  @serializable
  sysFee = 0;

  @serializable
  validUtilBlock = 0;

  @serializable
  version = 0;

  @serializable
  vmstate: vmState = '';

  @serializable(object(FaultDetail))
  faultDetail: FaultDetail = new FaultDetail();

  @serializable(list(object(Signer)))
  signers: Signer[] = [];

  @serializable(list(object(Witness)))
  witnesses: Witness[] = [];

  get status(): ActivityStatus {
    if (this.vmstate === 'HALT') {
      return 'succeeded';
    } else if (this.vmstate === 'FAULT') {
      return 'failed';
    }
    return 'confirming';
  }

  get failedTransfer(): Transfer {
    const t = new Transfer();
    if (this.vmstate === 'HALT') {
      return t;
    }

    const { faultDetail } = this;
    if (!faultDetail) {
      return t;
    }
    if (faultDetail.method !== OPERATION_TRANSFER) {
      return t;
    }
    if (faultDetail.hexStringParams.length < 3) {
      return t;
    } else if (faultDetail.hexStringParams.length < 4) {
      t.from = faultDetail.originSender;
      t.to = faultDetail.hexStringParams[0];
      t.value = '1';
      const token = faultDetail.hexStringParams[1];
      // to little endian
      const tokenBuffer = Buffer.from(token, 'binary');
      const tk16 = tokenBuffer.swap16();
      const tk16Reverse = tk16.reverse();
      const tkLE = tk16Reverse.toString();

      // to 16bit base64
      const tkLEBuffer = Buffer.from(tkLE, 'hex');
      t.tokenId = tkLEBuffer.toString('base64');
    } else {
      t.from = faultDetail.hexStringParams[0];
      t.to = faultDetail.hexStringParams[1];
      const amount = new BigNumber(faultDetail.hexStringParams[2], 16);
      t.value = amount.isNaN() ? '0' : amount.toFixed();
    }
    if (!t.from.startsWith('0x')) {
      t.from = `0x${t.from}`;
    }
    if (!t.to.startsWith('0x')) {
      t.to = `0x${t.to}`;
    }
    t._id = faultDetail._id;
    t.contract = faultDetail.contractHash;
    t.timestamp = this.blockTime;
    t.vmstate = 'FAULT';
    t.txid = faultDetail.txid;
    return t;
  }
}

export type ActivityStatus = 'confirming' | 'succeeded' | 'failed';
export type ActivityRecordType = 'receive' | 'send' | 'reward';
export type ActivityRange = {
  from: number;
  to: number;
};

export class ActivityRecord {
  @serializable(object(Transfer))
  transfer: Transfer = new Transfer();

  get status(): ActivityStatus {
    const { vmstate } = this.transfer;
    if (vmstate === 'HALT') {
      return 'succeeded';
    } else if (vmstate === 'FAULT') {
      return 'failed';
    }
    return 'confirming';
  }

  get timestamp() {
    return this.transfer.timestamp;
  }

  get txid() {
    return this.transfer.txid;
  }
}
