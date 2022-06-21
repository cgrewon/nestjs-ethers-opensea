import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, Req } from '@nestjs/common';
import { off } from 'process';
import { ContractService } from 'src/contract/contract.service';
import { ICreateSellOrder } from '../interfaces/create_sell_order.interface';
import { OpenseaService } from './opensea.service';

@Controller('opensea')
export class OpenseaController {
  constructor(
    private readonly openseaService: OpenseaService,
    private readonly contractService: ContractService,
  ) { }


  @Get('find_assets')
  async findAssets(
    @Query('owner') owner: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.openseaService.retrievingAssets(owner, offset, limit);
  }

  @Post('create_sell_order')
  async createSellOrder(
    @Req() req,
    @Body('tokenId') tokenId: string,
    @Body('tokenAddress') tokenAddress: string,
    @Body('startAmount') startAmount: number,
    @Body('schemaName') schemaName: string,
    @Body('ownerAddr') ownerAddr: string,
  ) {

    

    //* check owner of nft
    const isOwner = await this.contractService.ownerOfNFT(tokenAddress, tokenId, schemaName, ownerAddr);

    if (isOwner) {
      //* create sell Order
      const data: ICreateSellOrder = {
        tokenId,
        tokenAddress,
        startAmount,
        schemaName,
      };

      const res = await this.openseaService.createSellOrder(data);
      if (res.status == HttpStatus.OK) {
        return res.data;
      } else {
        throw new HttpException(res.error, HttpStatus.BAD_REQUEST);
      }
    }else {
      throw new HttpException('Invalid owner of nft.', HttpStatus.BAD_REQUEST);
    }

  }
}
