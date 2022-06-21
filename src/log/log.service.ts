import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Log } from 'src/log/entities/log.entity';
import { LogType } from 'src/enum/log_type';
import { NetMode } from 'src/enum/net_mode.enum';


@Injectable()
export class LogService {

  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>
  ){}

  async create(createLogDto: CreateLogDto): Promise<Log> {

    const log = new Log();
    log.content = createLogDto.content;
    log.log_type = createLogDto.log_type;
    log.fetch_nft_limit = createLogDto.fetch_nft_limit;
    log.fetch_nft_offset = createLogDto.fetch_nft_offset;

    log.net_mode = process.env.NETWORK == 'live' ? NetMode.Live : NetMode.Test;

    const saved = await this.logRepository.save(log);

    return saved;
  }

  async getFinalLog(logType: LogType): Promise<Log> {

    const last = await getRepository(Log).createQueryBuilder('log')      
      .where('net_mode = :netMode', {netMode: process.env.NETWORK == 'live' ? NetMode.Live : NetMode.Test })
      .orderBy('created_at', 'DESC')
      .getOne();    
    return last;
  }

  async getFinalFetchNFTOffsetLimit(): Promise<{lastLimit: number, lastOffset: number} | null> {
    const last = await this.getFinalLog(LogType.NftFetch);
    if (!last) {
      return null;
    }else{
      return {lastOffset: last.fetch_nft_offset, lastLimit: last.fetch_nft_limit};
    }
  }


  async findAll(page = 1, limit = 20) {
    const skip = page - 1 >= 0 ? ( page - 1) * limit : 0;
    const take = limit;
    const [data, total] = await this.logRepository.findAndCount({
      skip,
      take,
      order: {
        created_at: 'DESC',
      },
      where:{
        net_mode:process.env.NETWORK == 'live' ? NetMode.Live : NetMode.Test
      }      
    });
    return {
      status: HttpStatus.OK,
      total,
      data,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} log`;
  }

  update(id: number, updateLogDto: UpdateLogDto) {
    return `This action updates a #${id} log`;
  }

  remove(id: number) {
    return `This action removes a #${id} log`;
  }

  async removeLogs(to: Date, from?:Date){
    let q = getRepository(Log).createQueryBuilder()
      .where('created_at <= :to', {to:to})
      .andWhere('net_mode = :netMode', {netMode: process.env.NETWORK == 'live' ? NetMode.Live : NetMode.Test});
    if(from) {
      q = q.andWhere('created_at >= from', {from: from})      
    }

    const res = q.delete().execute();

    return res;     
    
  }
}
