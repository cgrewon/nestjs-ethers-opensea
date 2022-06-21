import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserWalletService } from './user-wallet.service';
import { CreateUserWalletDto } from './dto/create-user-wallet.dto';
import { UpdateUserWalletDto } from './dto/update-user-wallet.dto';
import { Wallet } from 'src/enum/wallet.enum';


@Controller('user-wallet')
export class UserWalletController {
  constructor(private readonly userWalletService: UserWalletService) { }

  @Post('create')
  async create(
    @Req() req,
    @Body('wallet') wallet: Wallet,
    @Body('address') address: string
  ) {

    return await this.userWalletService.create(req.user.id, wallet, address);
  }

  @Get()
  findAll() {
    return this.userWalletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userWalletService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserWalletDto: UpdateUserWalletDto) {
    return this.userWalletService.update(+id, updateUserWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userWalletService.remove(+id);
  }
}
