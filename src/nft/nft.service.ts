import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { getRepository } from 'typeorm';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { Nft } from './entities/nft.entity';

@Injectable()
export class NftService {

  async create(user: User, createNftDto: CreateNftDto) {

    const nft = new Nft();
    nft.name = createNftDto.name;
    nft.description = createNftDto.description;
    nft.asset_local_path = createNftDto.asset_local_path;
    nft.external_link = createNftDto.external_link;
    nft.user = user;

    const one = await getRepository(Nft).save(nft);

    return one;
  }

  findAll() {
    return `This action returns all nft`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nft`;
  }

  update(id: number, updateNftDto: UpdateNftDto) {
    return `This action updates a #${id} nft`;
  }

  remove(id: number) {
    return `This action removes a #${id} nft`;
  }
}
