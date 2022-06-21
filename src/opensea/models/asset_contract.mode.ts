import { NetMode } from "src/enum/net_mode.enum";


export class AssetContractModel {
    address;
    asset_contract_type;
    created_date;
    name;
    nft_version;
    opensea_version;
    owner;
    schema_name;
    symbol;
    total_supply;
    description;
    external_link;
    image_url;
    default_to_fiat;
    dev_buyer_fee_basis_points;
    dev_seller_fee_basis_points;
    only_proxied_transfers;
    opensea_buyer_fee_basis_points;
    opensea_seller_fee_basis_points;
    buyer_fee_basis_points;
    seller_fee_basis_points;
    payout_address;
  
    constructor(data) {
      if (process.env.NETWORK == NetMode.Live) {
        this.parseLive(data);
      } else {
        this.parseTest(data);
      }
    }
  
    parseLive(data) {
      if (data) {
        this.name = data.name;
        this.description = data.description;
        this.schema_name = data.schemaName;
        this.address = data.address;
        this.symbol = data.tokenSymbol;
        this.buyer_fee_basis_points = data.buyerFeeBasisPoints;
        this.seller_fee_basis_points = data.sellerFeeBasisPoints;
        this.dev_buyer_fee_basis_points = data.devBuyerFeeBasisPoints;
        this.dev_seller_fee_basis_points = data.devSellerFeeBasisPoints;
        this.opensea_buyer_fee_basis_points = data.openseaBuyerFeeBasisPoints;
        this.opensea_seller_fee_basis_points =
          data.devSellerFeeBasisPoints;
        this.image_url = data.imageUrl;
        this.external_link = data.externalLink;
  
        // this.asset_contract_type = data.asset_contract_type;
        // this.created_date = data.created_date;
        // this.nft_version = data.nft_version;
        // this.opensea_version = data.opensea_version;
        // this.owner = data.owner;
        // this.total_supply = data.total_supply;
        // this.default_to_fiat = data.default_to_fiat;
        // this.only_proxied_transfers = data.only_proxied_transfers;
        // this.payout_address = data.payout_address;
      }
    }
  
    parseTest(data) {
      if (data) {
        this.address = data.address;
        this.asset_contract_type = data.asset_contract_type;
        this.created_date = data.created_date;
        this.name = data.name;
        this.nft_version = data.nft_version;
        this.opensea_version = data.opensea_version;
        this.owner = data.owner;
        this.schema_name = data.schema_name;
        this.symbol = data.symbol;
        this.total_supply = data.total_supply;
        this.description = data.description;
        this.external_link = data.external_link;
        this.image_url = data.image_url;
        this.default_to_fiat = data.default_to_fiat;
        this.dev_buyer_fee_basis_points = data.dev_buyer_fee_basis_points;
        this.dev_seller_fee_basis_points = data.dev_seller_fee_basis_points;
        this.only_proxied_transfers = data.only_proxied_transfers;
        this.opensea_buyer_fee_basis_points = data.opensea_buyer_fee_basis_points;
        this.opensea_seller_fee_basis_points =
          data.opensea_seller_fee_basis_points;
        this.buyer_fee_basis_points = data.buyer_fee_basis_points;
        this.seller_fee_basis_points = data.seller_fee_basis_points;
        this.payout_address = data.payout_address;
      }
    }
  }