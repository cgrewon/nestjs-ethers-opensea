import { NetMode } from "src/enum/net_mode.enum";

export class CollectionModel {
    banner_image_url;
    chat_url;
    created_date;
    default_to_fiat;
    description;
    dev_buyer_fee_basis_points;
    dev_seller_fee_basis_points;
    discord_url;
    display_data;
    external_url;
    featured;
    featured_image_url;
    hidden;
    safelist_request_status;
    image_url;
    is_subject_to_whitelist;
    large_image_url;
    medium_username;
    name;
    only_proxied_transfers;
    opensea_buyer_fee_basis_points;
    opensea_seller_fee_basis_points;
    payout_address;
    require_email;
    short_description;
    slug;
    telegram_url;
    twitter_username;
    instagram_username;
    wiki_url;
  
    constructor(data = undefined) {
      if (process.env.NETWORK == NetMode.Live) {
        this.parseLive(data);
      } else {
        this.parseTest(data);
      }
    }
    parseLive(data = undefined) {
      if (data) {
        // this.banner_image_url = data.banner_image_url;
        // this.chat_url = data.chat_url;
        this.created_date = data.createdDate;
        this.name = data.name;
        this.description = data.description;
        this.slug = data.slug;
        this.hidden = data.hidden;
        this.featured = data.featured;
        this.featured_image_url = data.featuredImageUrl;
        this.display_data = data.displayData;
        this.opensea_buyer_fee_basis_points = data.openseaBuyerFeeBasisPoints;
        this.opensea_seller_fee_basis_points =
          data.openseaSellerFeeBasisPoints;
  
        this.dev_buyer_fee_basis_points = data.devBuyerFeeBasisPoints;
        this.dev_seller_fee_basis_points = data.devSellerFeeBasisPoints;
        this.payout_address = data.payoutAddress;
        this.image_url = data.imageUrl;
        this.large_image_url = data.largeImageUrl;
        this.external_url = data.externalLink;
        this.wiki_url = data.wikiLink;
  
  
        // this.default_to_fiat = data.default_to_fiat;
        // this.discord_url = data.discord_url;
  
        // this.safelist_request_status = data.safelist_request_status;      
        // this.is_subject_to_whitelist = data.is_subject_to_whitelist;
  
        // this.medium_username = data.medium_username;
  
        // this.only_proxied_transfers = data.only_proxied_transfers;
  
        // this.require_email = data.require_email;
        // this.short_description = data.short_description;
  
        // this.telegram_url = data.telegram_url;
        // this.twitter_username = data.twitter_username;
        // this.instagram_username = data.instagram_username;
  
      }
    }
    parseTest(data = undefined) {
      if (data) {
        this.banner_image_url = data.banner_image_url;
        this.chat_url = data.chat_url;
        this.created_date = data.created_date;
        this.default_to_fiat = data.default_to_fiat;
        this.description = data.description;
        this.dev_buyer_fee_basis_points = data.dev_buyer_fee_basis_points;
        this.dev_seller_fee_basis_points = data.dev_seller_fee_basis_points;
        this.discord_url = data.discord_url;
        this.display_data = data.display_data;
        this.external_url = data.external_url;
        this.featured = data.featured;
        this.featured_image_url = data.featured_image_url;
        this.hidden = data.hidden;
        this.safelist_request_status = data.safelist_request_status;
        this.image_url = data.image_url;
        this.is_subject_to_whitelist = data.is_subject_to_whitelist;
        this.large_image_url = data.large_image_url;
        this.medium_username = data.medium_username;
        this.name = data.name;
        this.only_proxied_transfers = data.only_proxied_transfers;
        this.opensea_buyer_fee_basis_points = data.opensea_buyer_fee_basis_points;
        this.opensea_seller_fee_basis_points =
          data.opensea_seller_fee_basis_points;
        this.payout_address = data.payout_address;
        this.require_email = data.require_email;
        this.short_description = data.short_description;
        this.slug = data.slug;
        this.telegram_url = data.telegram_url;
        this.twitter_username = data.twitter_username;
        this.instagram_username = data.instagram_username;
        this.wiki_url = data.wiki_url;
      }
    }
  }