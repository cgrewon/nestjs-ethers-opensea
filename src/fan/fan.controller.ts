import { Controller, Get, Post, Body, Patch, Param, Delete,
  UseInterceptors, ClassSerializerInterceptor,
} from '@nestjs/common';
import { FanService } from './fan.service';
import { CreateFanDto } from './dto/create-fan.dto';
import { UpdateFanDto } from './dto/update-fan.dto';

@Controller('fan')
export class FanController {
  constructor(private readonly fanService: FanService) { }

  @Post('create')
  async create(@Body() createFanDto: CreateFanDto) {
    return await this.fanService.create(createFanDto);
  }

  @Get('number_fans/:artistId')
  async getNumberFans(
    @Param('artistId') artistId: number,
  ) {
    return await this.fanService.getNumberOfFans(artistId);
  }
  @Get('number_followings/:fanId')
  async getNumberFollowings(
    @Param('fanId') fanId: number,
  ) {
    return await this.fanService.getNumberOfFollowings(fanId);
  }

  @Get('fans/:artistId/:offset/:limit')
  @UseInterceptors(ClassSerializerInterceptor)
  async getFans(
    @Param('artistId') artistId: number,
    @Param('offset') offset?: number,
    @Param('limit') limit?: number,
  ) {
    return await this.fanService.getFans(artistId, offset, limit);
  }
  @Get('followings/:fanId/:offset/:limit')
  @UseInterceptors(ClassSerializerInterceptor)
  async getFollowings(
    @Param('fanId') fanId: number,
    @Param('offset') offset?: number,
    @Param('limit') limit?: number,
  ) {
    return await this.fanService.getFollowings(fanId, offset, limit);
  }


  @Delete('unfollowing/:fanId/:artistId')
  async remove(
    @Param('fanId') fanId: number,
    @Param('artistId') artistId: number,
  ) {
    return await this.fanService.unfollowing(fanId, artistId);
  }
}
