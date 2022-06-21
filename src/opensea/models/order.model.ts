import { NetMode } from "src/enum/net_mode.enum";
import { AssetModel } from "./asset.model";
import { MetaDataModel } from "./metadata.model";
import { PaymentTokenModel } from "./payment_token.model";
import { TokenModel } from "./token.model";
import { UserModel } from "./user.model";

export default class OrderModel {
    //* Models
    token: TokenModel;
    asset: AssetModel;
    data;
    paymentTokenContract: PaymentTokenModel;
    metaData: MetaDataModel;
    maker: UserModel;
    taker: UserModel;
    feeRecipient: UserModel;
  
    //* data
    asset_bundle;
    created_date;
    closing_date;
    closing_extendable;
    expiration_time;
    listing_time;
    order_hash;
    exchange;
    current_price;
    current_bounty;
    bounty_multiple;
    maker_relayer_fee;
    taker_relayer_fee;
    maker_protocol_fee;
    taker_protocol_fee;
    maker_referrer_fee;
    fee_method;
    side;
    sale_kind;
    target;
    how_to_call;
    calldata;
    replacement_pattern;
    static_target;
    static_extradata;
    payment_token;
    base_price;
    extra;
    quantity;
    salt;
    approved_on_chain;
    cancelled;
    finalized;
    marked_invalid;
    prefixed_hash;
  
    constructor(order = undefined) {
      this.data = order;
      if (order) {
        if (typeof order == "string") {
          this.data = JSON.parse(order);
        }
  
        if (process.env.NETWORK == NetMode.Test) {
          this.parseTestOrder();
        }
        if (process.env.NETWORK == NetMode.Live) {
          this.parseLiveOrder();
        }
  
      }
    }
  
    parseLiveOrder() {
      
      this.paymentTokenContract = new PaymentTokenModel(
        this.data.paymentTokenContract
      );
      // console.log({ paymentTokenContract: this.paymentTokenContract });
  
      this.token = new TokenModel(this.data.asset, this.data);
      // console.log({ token: this.token });
  
      this.asset = new AssetModel(this.data.asset);
      // console.log({ asset: this.asset });
  
      this.metaData = new MetaDataModel(this.data.metadata);
      // console.log({ metaData: this.metaData });
  
      this.feeRecipient = new UserModel(this.data.feeRecipientAccount);
      // console.log({ feeRecipient: this.feeRecipient });
  
      // this.asset_bundle = this.data.asset_bundle;
      this.created_date = this.data.createdTime;
      // this.closing_date = this.data.closing_date;
      // this.closing_extendable = this.data.closing_extendable;
      this.expiration_time = this.data.expirationTime;
      this.listing_time = this.data.listingTime;
      this.order_hash = this.data.hash;
      this.exchange = this.data.exchange;
      this.current_price = this.data.currentPrice;
      this.current_bounty = this.data.currentBounty;
      // this.bounty_multiple = this.data.bounty_multiple;
      this.maker_relayer_fee = this.data.makerRelayerFee;
      this.taker_relayer_fee = this.data.takerRelayerFee;
      this.maker_protocol_fee = this.data.makerProtocolFee;
      this.taker_protocol_fee = this.data.takerProtocolFee;
      this.maker_referrer_fee = this.data.makerReferrerFee;
  
      this.fee_method = this.data.feeMethod;
      this.side = this.data.side;
      this.sale_kind = this.data.saleKind;
      this.target = this.data.target;
      this.how_to_call = this.data.howToCall;
      this.calldata = this.data.calldata;
      this.replacement_pattern = this.data.replacementPattern;
      this.static_target = this.data.staticTarget;
      this.static_extradata = this.data.staticExtradata;
      this.payment_token = this.data.paymentToken;
      this.base_price = this.data.basePrice;
      this.extra = this.data.extra;
      this.quantity = this.data.quantity;
      this.salt = this.data.salt;
      // this.approved_on_chain = this.data.approved_on_chain;
      this.cancelled = this.data.cancelledOrFinalized;
      this.finalized = this.data.cancelledOrFinalized;
      this.marked_invalid = this.data.markedInvalid;
      // this.prefixed_hash = this.data.prefixed_hash;
  
      // console.log('before getPrice : this.current_price : ', this.current_price);
      this.token.tokenPrice = this.getPrice();
      // console.log({ tokenPrice: this.token.tokenPrice });
  
      this.token.tokenUnit = this.paymentTokenContract.symbol;
      this.token.tokenPriceImage = this.paymentTokenContract.image_url;
      this.token.tokenUSDPrice = this.paymentTokenContract.getUsdPrice(
        this.token.tokenPrice
      );
      // console.log({ tokenUSDPrice: this.token.tokenUSDPrice });
    }
  
    parseTestOrder() {
      
      this.paymentTokenContract = new PaymentTokenModel(
        this.data.payment_token_contract
      );
      // console.log({ paymentTokenContract: this.paymentTokenContract });
  
      this.token = new TokenModel(this.data.asset, this.data);
      // console.log({ token: this.token });
  
      this.asset = new AssetModel(this.data.asset);
      // console.log({ asset: this.asset });
  
      this.metaData = new MetaDataModel(this.data.metadata);
      // console.log({ metaData: this.metaData });
  
      this.feeRecipient = new UserModel(this.data.fee_recipient);
      // console.log({ feeRecipient: this.feeRecipient });
  
      this.asset_bundle = this.data.asset_bundle;
      this.created_date = this.data.created_date;
      this.closing_date = this.data.closing_date;
      this.closing_extendable = this.data.closing_extendable;
      this.expiration_time = this.data.expiration_time;
      this.listing_time = this.data.listing_time;
      this.order_hash = this.data.order_hash;
      this.exchange = this.data.exchange;
      this.current_price = this.data.current_price;
      this.current_bounty = this.data.current_bounty;
      this.bounty_multiple = this.data.bounty_multiple;
      this.maker_relayer_fee = this.data.maker_relayer_fee;
      this.taker_relayer_fee = this.data.taker_relayer_fee;
      this.maker_protocol_fee = this.data.maker_protocol_fee;
      this.taker_protocol_fee = this.data.taker_protocol_fee;
      this.maker_referrer_fee = this.data.maker_referrer_fee;
      this.fee_method = this.data.fee_method;
      this.side = this.data.side;
      this.sale_kind = this.data.sale_kind;
      this.target = this.data.target;
      this.how_to_call = this.data.how_to_call;
      this.calldata = this.data.calldata;
      this.replacement_pattern = this.data.replacement_pattern;
      this.static_target = this.data.static_target;
      this.static_extradata = this.data.static_extradata;
      this.payment_token = this.data.payment_token;
      this.base_price = this.data.base_price;
      this.extra = this.data.extra;
      this.quantity = this.data.quantity;
      this.salt = this.data.salt;
      this.approved_on_chain = this.data.approved_on_chain;
      this.cancelled = this.data.cancelled;
      this.finalized = this.data.finalized;
      this.marked_invalid = this.data.marked_invalid;
      this.prefixed_hash = this.data.prefixed_hash;
  
      // console.log('before getPrice : this.current_price : ', this.current_price);
      this.token.tokenPrice = this.getPrice();
      // console.log({ tokenPrice: this.token.tokenPrice });
  
      this.token.tokenUnit = this.paymentTokenContract.symbol;
      this.token.tokenPriceImage = this.paymentTokenContract.image_url;
      this.token.tokenUSDPrice = this.paymentTokenContract.getUsdPrice(
        this.token.tokenPrice
      );
      // console.log({ tokenUSDPrice: this.token.tokenUSDPrice });
    }
  
    toString() {
      return JSON.stringify(this.data);
    }
  
    getPrice() {
      if (!this.paymentTokenContract) {
        return undefined;
      }
  
      let cur_price = this.current_price.toString().split(".")[0];
      const length = cur_price.length;
      const decimals = this.paymentTokenContract.decimals;
      let price = cur_price;
      if (length < this.paymentTokenContract.decimals) {
        const diff = decimals - length;
  
        for (let i = 0; i < diff; i++) {
          price = "0" + price;
        }
  
        price = parseFloat("0." + price);
      } else {
        price =
          price.substr(0, length - decimals) +
          "." +
          price.substr(length - decimals);
  
        price = parseFloat(price);
      }
  
      return price;
    }
  }