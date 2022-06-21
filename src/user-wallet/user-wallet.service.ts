import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Wallet } from 'src/enum/wallet.enum';

import { User } from 'src/user/entities/user.entity';
import { getRepository } from 'typeorm';
import { CreateUserWalletDto } from './dto/create-user-wallet.dto';
import { UpdateUserWalletDto } from './dto/update-user-wallet.dto';
import { UserWallet } from './entities/user-wallet.entity';

@Injectable()
export class UserWalletService {

  async create(userId: number, wallet: Wallet, address: string) {
    
    const user = await getRepository(User).createQueryBuilder('user')
    .leftJoinAndSelect('user.wallets', 'wallet')
    .where('user.id = :userId', {userId: userId})
    .getOne();
    
    if(!user) {
      throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);
    }

    const find = user.wallets ? user.wallets.find(one=>one.address == address) : undefined;

    if (find) {

      return find;
    }

    const newWallet = new UserWallet();
    newWallet.user= user;
    newWallet.address = address;
    newWallet.wallet = wallet;

    const saved = await getRepository(UserWallet).save(newWallet);

    return saved;
  
  }

  findAll() {
    return `This action returns all userWallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userWallet`;
  }

  update(id: number, updateUserWalletDto: UpdateUserWalletDto) {
    return `This action updates a #${id} userWallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} userWallet`;
  }
}
