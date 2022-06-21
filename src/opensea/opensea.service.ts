import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { NetMode } from 'src/enum/net_mode.enum';
import { LogService } from 'src/log/log.service';
import {
  Order,
  OrderSide,
} from 'opensea-js/lib/types';
import { CreateLogDto } from 'src/log/dto/create-log.dto';
import { LogType } from 'src/enum/log_type';
import OrderModel from './models/order.model';
import axios from 'axios';
import { ContractService } from 'src/contract/contract.service';
import { ICreateSellOrder } from '../interfaces/create_sell_order.interface';
import { IHttpResponse } from 'src/interfaces/http_response.interface';
const HDWalletProvider = require('@truffle/hdwallet-provider');

const Web3 = require('web3');
const opensea = require('opensea-js');
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;


const Agent = {
  ADDRESS: process.env.AGENT_ADDRESS,
  PRIV_KEY: process.env.AGENT_PRIV
}


@Injectable()
export class OpenseaService {


  public openseaReader: typeof OpenSeaPort;
  provider: any;
  web3: any;
  seaportList: typeof OpenSeaPort[] = [];

  constructor(
    private readonly logService: LogService,
    private readonly contractService: ContractService
  ) {
    this.initOpenseaReader();
  }

  async retrievingAssets(ownerAddr: string, offset: number = 0, limit: number = 20):Promise<any> {
    const NETWORK = process.env.NETWORK === NetMode.Live ? '' : 'testnets-';

    const url = `https://${NETWORK}api.opensea.io/api/v1/assets?owner=${ownerAddr}&order_direction=desc&offset=${offset}&limit=${limit}`;

    const header = process.env.NETWORK === NetMode.Live ? {
      headers: {
        'x-api-key': process.env.OS_APIKEY
      }
    } : {};
    const res = await axios.get(url, {
      ...header
    });

    return res.data;

  }


  initOpenseaReader() {
    Logger.log('Init opensea reader:')
    const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')
    console.log('process.env.OS_APIKEY: ', process.env.OS_APIKEY);
    this.openseaReader = new OpenSeaPort(provider, {
      networkName: Network.Main,
      apiKey: process.env.NETWORK == 'live' ? process.env.OS_APIKEY : ''
    })
  }


  async openseaRetrievingSellOrders() {

    const now = Date.now();
    console.log('TaskService::openseaRetrievingSellOrders :: now : ', new Date(now).toLocaleString());

    //TODO retrieving sell orders
    const NullAddress = '0x0000000000000000000000000000000000000000';
    const NETWORK = process.env.NETWORK === NetMode.Live ? '' : 'testnets-';
    const BaseUrl = `https://${NETWORK}api.opensea.io`;
    const net_mode = process.env.NETWORK === 'live' ? 'live' : 'test';
    const order_by = 'created_date';
    const order_direction = 'desc';

    let offset = 0;
    const lastOffsetLimit = await this.logService.getFinalFetchNFTOffsetLimit();
    if (lastOffsetLimit) {
      offset = lastOffsetLimit.lastOffset + lastOffsetLimit.lastLimit;
    }
    offset = offset >= 10000 ? 0 : offset;
    const limit = 50;

    let url = `${BaseUrl}/wyvern/v1/orders?include_invalid=false&limit=${limit}&offset=${offset}&order_by=${order_by}&order_direction=${order_direction}&side=${OrderSide.Sell}&taker=${NullAddress}`;
    let res: any;
    const logData = new CreateLogDto();

    logData.log_type = LogType.NftFetch;
    logData.fetch_nft_limit = limit;
    logData.fetch_nft_offset = offset;

    const netMode: NetMode = process.env.NETWORK == 'live' ? NetMode.Live : NetMode.Test;

    if (netMode == NetMode.Live) {

      const { orders, count } = await this.openseaReader.api.getOrders({
        side: OrderSide.Sell,
        offset: offset,
        limit: limit
      });

      if (count > 0) {
        let nftCount = 0;
        for (let order of orders) {
          if (!order.asset) {
            console.log('asset is empty:', order.asset);
            continue;
          } else if (!order.r || !order.s) {
            console.log('Invalid NFT without signatures : ', { 'order.r': order.r, 'order.s': order.s })
          } else {
            console.log('NFT  signatures : ', { 'order.r': order.r, 'order.s': order.s })
            console.log('before parsing order : ');
            const orderModel: OrderModel = new OrderModel(order);
            console.log('orderModel parsed : ', orderModel.token.token_id);
            if (orderModel.token.tokenPrice <= 0.00001 || orderModel.token.tokenUSDPrice <= 0.1) {
              console.log('order token tokenPrice is invalid:', orderModel.token.tokenPrice);
              continue;
            }

            // const nftData = new CreateNftDto(netMode, orderModel);
            // console.log('nftData ready : ', { nftData: nftData.token_id });
            // try {
            //   const saved: any = await this.nftService.create(nftData);
            //   console.log('NFT saved : ', saved.status);
            //   if (saved.status == HttpStatus.OK) {
            //     if (saved.action != 'update') {
            //       nftCount += 1;
            //     }
            //   }
            // } catch (ex) {
            //   console.log('exception while save nft : ', ex);
            // }
          }
        }

        logData.content += nftCount;
      } else {
        logData.content = `openesaReader: Empty result: orders; ${orders}  count: ${count}`;
      }

    } else {

      try {
        console.log(url);
        res = await axios.get(url);

        if (res.status == 200) {
          const data = res.data as any;
          const nftLength = data && data.orders ? data.orders.length : null;
          logData.content = 'OrdersLength : ' + nftLength + ', createdNfts : ';

          if (nftLength > 0) {
            let nftCount = 0;
            for (let order of data.orders) {
              if (!order.asset) {
                continue;
              } else {
                console.log('order r, s checking: ', order.r, order.s)
                const orderModel: OrderModel = new OrderModel(order);
                if (!order.r || !order.s) {
                  continue;
                }
                if (orderModel.token.tokenPrice <= 0.00001 || orderModel.token.tokenUSDPrice <= 0.1) {
                  continue;
                }

                // const nftData = new CreateNftDto(netMode, orderModel);
                // try {
                //   const saved: any = await this.nftService.create(nftData);
                //   if (saved.status == HttpStatus.OK) {
                //     if (saved.action != 'update') {
                //       nftCount += 1;
                //     }
                //   }
                // } catch (ex) {
                //   console.log('exception while save nft : ', ex);
                // }
              }
            }

            logData.content += nftCount;
          }
        } else {
          logData.content = 'NFts: error: ' + JSON.stringify(res);
        }
      } catch (ex) {
        console.log('error while fetch nft: ', ex);
        logData.content += JSON.stringify(ex);
      }

    }

    // const totalNftCount = await this.nftService.getTotalCount(true);
    // logData.content += ', total buyable NFT Count : ' + totalNftCount;
    await this.logService.create(logData);
  }

  stopProvider() {
    if (this.provider) {
      console.log('Stop provider!');
      this.provider.engine.stop();
    }
  }


  initSeaPortWithHDWalletProvider(): {
    seaport: typeof OpenSeaPort;
    env: any;
    web3: typeof Web3;
  } {


    if (
      this.seaportList &&
      this.seaportList.length > 0 &&
      this.seaportList[0]
    ) {
      return { seaport: this.seaportList[0], web3: this.web3, env: Agent };
    }

    const PRIV_KEY = Agent.PRIV_KEY;

    const NETWORK = process.env.NETWORK;

    const [RPC_URL, WSS_URL] = this.contractService._getProviderUrls();

    const provider = new HDWalletProvider({
      privateKeys: [PRIV_KEY],
      providerOrUrl: RPC_URL,
      pollingInterval: 10000,
    });

    this.provider = provider;
    this.web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

    const NetworkName =
      NETWORK === 'mainnet' || NETWORK === 'live'
        ? Network.Main
        : Network.Rinkeby;

    const seaport = new OpenSeaPort(provider, {
      networkName: NetworkName,
      apiKey: process.env.NETWORK == 'live' ? process.env.OS_APIKEY : ''
    });

    this.seaportList.push(seaport);

    return { seaport, web3: this.web3, env: Agent };
  }


  async acceptOrder({
    tokenId,
    tokenAddress
  }: {
    tokenId: string;
    tokenAddress: string;
  }): Promise<any> {

    let seaport, env;
    let sellOrder: Order;
    try {

      console.log('initSeaPortWithHDWalletProvider @acceptOrder > ');
      const hdProvider = await this.initSeaPortWithHDWalletProvider();
      seaport = hdProvider.seaport;
      env = hdProvider.env;

      console.log(
        'acceptOrder =>  accIndex, buyer s  env.accAddress :  ' +
        env.ACCOUNT_ADDRESS,
      );

      const asset = await seaport.api.getAsset({
        tokenId,
        tokenAddress,
      });
      console.log('seaport.api.getAsset > ', asset);
      if (!asset) {
        this.stopProvider();
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid token data.',
          buyer: env.ACCOUNT_ADDRESS,
        };
      }

      if (asset.sellOrders) {
        let orders = asset.sellOrders.sort((a, b) =>
          a.currentPrice < b.currentPrice ? 1 : -1,
        );
        console.log('asset.sellOrders > ', orders);
        if (orders.length) {
          sellOrder = orders[0];
          sellOrder.asset = asset;

        } else {
          this.stopProvider();
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'This nft is not on auction.',
            buyer: env.ACCOUNT_ADDRESS,
          };
        }
      } else {
        this.stopProvider();
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'No Sell Orders',
          buyer: env.ACCOUNT_ADDRESS,
        };
      }
    } catch (ex) {
      this.stopProvider();
      console.log('exception while acceptOrder: ', ex);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Somethings wrong while accept sell order. please try again.',
        errorDetail: ex.message,
        buyer: env.ACCOUNT_ADDRESS,
      };
    }

    try {
      console.log('seaport fulfillOrder run: accountAddress : ', env.ACCOUNT_ADDRESS);
      const transactionHash = await seaport.fulfillOrder({
        order: sellOrder,
        accountAddress: env.ACCOUNT_ADDRESS,
      });
      console.log(
        `Successfully accepted order for sell order!trx hash: ${transactionHash}\n`,
      );
      this.stopProvider();
      return {
        status: HttpStatus.OK,
        txn_hash: transactionHash,
        buyer: env.ACCOUNT_ADDRESS,
      };
    } catch (error) {
      console.log('error while opensea fulfillOrder: ', error);
      this.stopProvider();
      return {
        status: HttpStatus.BAD_REQUEST,
        buyer: env.ACCOUNT_ADDRESS,
        error: error.message,
      };
    }
  }

  async createBuyOrder({
    tokenId,
    tokenAddress,
    startAmount,
    schemaName,
  }: {
    tokenId: string;
    tokenAddress: string;
    startAmount: number;
    schemaName: string;
  }): Promise<any> {

    const { seaport, env } = await this.initSeaPortWithHDWalletProvider();

    try {
      const fixedPriceSellOrder = await seaport.createBuyOrder({
        asset: {
          tokenId: tokenId,
          tokenAddress: tokenAddress,
        },
        accountAddress: env.ACCOUNT_ADDRESS,

        startAmount: startAmount,
      });
      this.stopProvider();
      return {
        status: HttpStatus.OK,
        fixedPriceSellOrder,
      };
    } catch (error) {
      this.stopProvider();
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }

  
  async createSellOrder({
    tokenId,
    tokenAddress,
    startAmount,
    schemaName,
  }: ICreateSellOrder): Promise<IHttpResponse> {

    console.log({
      tokenId,
      tokenAddress,
      startAmount,
      schemaName,
    });

    const { seaport, env } = await this.initSeaPortWithHDWalletProvider();

    try {
      const listing = await seaport.createSellOrder({
        asset: {
          tokenId: tokenId,
          tokenAddress: tokenAddress,
        },
        accountAddress: env.ACCOUNT_ADDRESS,
        startAmount: startAmount,
        endAmount: startAmount,
        schemaName: schemaName,
      });
      this.stopProvider();
      console.log(`Successfully created a fixed-price sell order! `, listing);
      
      return {
        status: HttpStatus.OK,
        data: listing,
      };
    } catch (error) {
      console.log('error : while createSellOrder -> ', error);
      this.stopProvider();

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }

  async transferItem({
    tokenId,
    tokenAddress,
    schemaName,
    userAddress,
  }): Promise<any> {
    const { seaport, env } = await this.initSeaPortWithHDWalletProvider();
    console.log({
      tokenId,
      tokenAddress,
      schemaName,
      userAddress,
    });
    if (
      !tokenId ||
      !tokenAddress ||
      !schemaName ||
      !userAddress
    ) {
      this.stopProvider();
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid request data.',
        data: {
          tokenId,
          tokenAddress,
          schemaName,
          userAddress,
        },
      };
    }

    try {
      const transactionHash = await seaport.transfer({
        asset: { tokenId, tokenAddress, schemaName },
        fromAddress: Agent.ADDRESS, // Must own the asset
        toAddress: userAddress,
      });
      this.stopProvider();
      console.log('transfer result : ', transactionHash);
      return {
        status: HttpStatus.OK,
        data: transactionHash,
      };
    } catch (ex) {
      this.stopProvider();
      return {
        status: HttpStatus.BAD_REQUEST,
        error: ex.message,
      };
    }
  }

}
