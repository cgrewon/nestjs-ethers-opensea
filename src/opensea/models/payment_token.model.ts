import { NetMode } from "src/enum/net_mode.enum";


export class PaymentTokenModel {
    id;
    symbol;
    address;
    image_url;
    name;
    decimals;
    eth_price;
    usd_price;
  
    constructor(data) {
      if (process.env.NETWORK == NetMode.Live) {
        this.parseForLive(data);
      } else {
        this.parseForTest(data);
      }
    }
  
    parseForTest(data: any) {
      if (data) {
        this.id = data.id;
        this.symbol = data.symbol;
        this.address = data.address;
        this.image_url = data.image_url;
        this.name = data.name;
        this.decimals = data.decimals;
        this.eth_price = data.eth_price;
        this.usd_price = data.usd_price;
      }
    }
  
    parseForLive(data: any) {
      if (data) {
        // this.id = data.id;
        this.symbol = data.symbol;
        this.address = data.address;
        this.image_url = data.imageUrl;
        this.name = data.name;
        this.decimals = data.decimals;
        this.eth_price = data.ethPrice;
        this.usd_price = data.usdPrice;
      }
    }
  
    getUsdPrice(ethVal) {
      const price = (ethVal * this.usd_price) / this.eth_price;
      return price;
    }
  }