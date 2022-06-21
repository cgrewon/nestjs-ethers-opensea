import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { off } from 'process';
import { User } from 'src/user/entities/user.entity';
import { getRepository } from 'typeorm';
import { CreateFanDto } from './dto/create-fan.dto';
import { UpdateFanDto } from './dto/update-fan.dto';
import { Fan } from './entities/fan.entity';

@Injectable()
export class FanService {

  async create(createFanDto: CreateFanDto) {
    const fan = await getRepository(User).findOne(createFanDto.user_id);

    const artist = await getRepository(User).findOne(createFanDto.artist_id);
    if(!fan || !artist) {
      throw new HttpException('Invalid fan or artist', HttpStatus.BAD_REQUEST);
    }
    const count = await getRepository(Fan).createQueryBuilder()
    .where('user_id = :fanId', {fanId: fan.id})
    .andWhere('artist_id = :artistId', {artistId: artist.id})
    .getCount();

    if(count > 0) {
      throw new HttpException('Already following.', HttpStatus.BAD_REQUEST);
    }

    const newFan = new Fan();

    newFan.user_id = fan.id;
    newFan.artist_id = artist.id;

    const saved = await getRepository(Fan).save(newFan);
    
    return saved;
  }

  async getNumberOfFans(artistId: number){
    const count = await getRepository(Fan).createQueryBuilder()
    .where('artist_id = :artistId', {artistId})
    .getCount();

    return count;
  }

  async getNumberOfFollowings(fanId: number){
    const count = await getRepository(Fan).createQueryBuilder()
    .where('user_id = :fanId', {fanId})
    .getCount();

    return count;
  }

  async getFans(artistId: number, offset=0, limit=20){
    const [list, count] = await getRepository(Fan).createQueryBuilder()
    .where('artist_id = :artist_id', {artist_id: artistId})
    .offset(offset)
    .limit(limit)
    .orderBy('id', 'ASC')
    .getManyAndCount();


    let fans = [];
    for(let fan of list){
      const user = await getRepository(User).findOne(fan.user_id);
      fans.push(user);
    }

    return {
      fans, count
    };
  }

  async getFollowings(fanId: number, offset=0, limit=20){
    const [list, count] = await getRepository(Fan).createQueryBuilder()
    .where('user_id = :user_id', {user_id: fanId})
    .offset(offset)
    .limit(limit)
    .orderBy('id', 'ASC')
    .getManyAndCount();


    let followings = [];
    for(let fan of list){
      const artist = await getRepository(User).findOne(fan.artist_id);
      followings.push(artist);
    }

    return {
      followings, count
    };
  }

  async unfollowing(user_id: number, artist_id: number) {
    const res = await getRepository(Fan).createQueryBuilder()
    .where('user_id = :userId', {userId: user_id})
    .andWhere('artist_id = :artistId', {artistId: artist_id})
    .delete()
    .execute();

    return res;
  }

}
