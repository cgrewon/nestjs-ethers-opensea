import { AssetContractModel } from "./asset_contract.mode";
import { CollectionModel } from "./collection.model";
import { UserModel } from "./user.model";
import { NetMode } from "src/enum/net_mode.enum";



export const ValidImgUrl = (url) => {
    if (url) {
      return url.trim() !== "";
    }
    return false;
  }


export class TokenModel {
    //* Models
    maker;
    taker;
    owner;
    collection;
    assetContract;
  
    //* Data
    tokenName;
    tokenImgUrl;
    tokenDesc;
  
    ownerName;
    ownerImgUrl;
    ownerAddress;
    permalink;
    // creatorName : obj.creator !== null  ? obj.creator.user.username : "",
  
    creatorImgUrl;
    token_id;
  
    sourceName;
  
    asset_contract_type;
    asset_contract_address;
    asset_contract_schema_name;
    asset_logo;
    brand_logo;
  
    tokenPrice;
    tokenUSDPrice;
    tokenUnit;
    tokenPriceImage;
  
    constructor(asset = undefined, order = undefined) {
      if (process.env.NETWORK == NetMode.Live) {
        this.parseLive(asset, order);
      } else {
        this.parseTest(asset, order);
      }
    }
  
    parseLive(asset = undefined, order = undefined) {
      if (order) {
        this.maker = new UserModel(order.makerAccount);
        this.taker = new UserModel(order.takerAccount);
      }
      if (asset) {
        this.tokenName = asset.name;
        this.tokenImgUrl = ValidImgUrl(asset.imageUrl)
          ? asset.imageUrl
          : "";
        this.tokenDesc = asset.description;
        this.owner = new UserModel(asset.owner);
        this.ownerName = this.owner.username;
        this.ownerImgUrl = this.owner.profile_img_url;
        this.ownerAddress = this.owner.address;
        this.permalink = asset.permalink;
        // creatorName : obj.creator !== null  ? obj.creator.user.username : "",
  
        this.creatorImgUrl = !!asset.creator
          ? asset.creator.profile_img_url
          : this.maker.profile_img_url; //? correct ;
        this.token_id = asset.tokenId;
  
        this.collection = new CollectionModel(asset.collection);
  
        this.sourceName = this.collection.name;
  
        this.assetContract = new AssetContractModel(asset.assetContract);
  
        this.asset_contract_type = this.assetContract.asset_contract_type;
        this.asset_contract_address = this.assetContract.address;
  
        this.asset_contract_schema_name = this.assetContract.schema_name;
  
        this.asset_logo = this.collection.image_url;
        this.brand_logo = undefined;
      }
    }
  
    parseTest(asset = undefined, order = undefined) {
      if (order) {
        this.maker = new UserModel(order.maker);
        this.taker = new UserModel(order.taker);
      }
      if (asset) {
        this.tokenName = asset.name;
        this.tokenImgUrl = ValidImgUrl(asset.image_url)
          ? asset.image_url
          : "";
        this.tokenDesc = asset.description;
        this.owner = new UserModel(asset.owner);
        this.ownerName = this.owner.username;
        this.ownerImgUrl = this.owner.profile_img_url;
        this.ownerAddress = this.owner.address;
        this.permalink = asset.permalink;
        // creatorName : obj.creator !== null  ? obj.creator.user.username : "",
  
        this.creatorImgUrl = !!asset.creator
          ? asset.creator.profile_img_url
          : this.maker.profile_img_url; //? correct ;
        this.token_id = asset.token_id;
  
        this.collection = new CollectionModel(asset.collection);
  
        this.sourceName = this.collection.name;
  
        this.assetContract = new AssetContractModel(asset.asset_contract);
  
        this.asset_contract_type = this.assetContract.asset_contract_type;
        this.asset_contract_address = this.assetContract.address;
  
        this.asset_contract_schema_name = this.assetContract.schema_name;
  
        this.asset_logo = this.collection.image_url;
        this.brand_logo = undefined;
      }
    }
  }