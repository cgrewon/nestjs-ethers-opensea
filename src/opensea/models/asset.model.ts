import { AssetContractModel } from "./asset_contract.mode";
import { CollectionModel } from "./collection.model";
import { UserModel } from "./user.model";

export class AssetModel {
    //* Models
    assetContract;
  
    collection;
  
    owner;
  
    //* Data
    id;
    token_id;
    num_sales;
    background_color;
    image_url;
    image_preview_url;
    image_thumbnail_url;
    image_original_url;
    animation_url;
    animation_original_url;
    name;
    description;
    external_link;
  
    constructor(asset) {
      if (asset) {
        this.assetContract = new AssetContractModel(asset.asset_contract);
        this.collection = new CollectionModel(asset.collection);
        this.owner = new UserModel(asset.owner);
  
        this.id = asset.id;
        this.token_id = asset.token_id;
        this.num_sales = asset.num_sales;
        this.background_color = asset.background_color;
        this.image_url = asset.image_url;
        this.image_preview_url = asset.image_preview_url;
        this.image_thumbnail_url = asset.image_thumbnail_url;
        this.image_original_url = asset.image_original_url;
        this.animation_url = asset.animation_url;
        this.animation_original_url = asset.animation_original_url;
        this.name = asset.name;
        this.description = asset.description;
        this.external_link = asset.external_link;
      }
    }
  }