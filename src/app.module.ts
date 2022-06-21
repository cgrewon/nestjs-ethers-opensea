import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserWalletModule } from './user-wallet/user-wallet.module';
import { MailModule } from './mail/mail.module';
import { OpenseaModule } from './opensea/opensea.module';
import { LogModule } from './log/log.module';
import { ContractModule } from './contract/contract.module';
import { NftModule } from './nft/nft.module';
import { FanModule } from './fan/fan.module';




const typeormConf = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  entities: ["src/**/entities/*.entity{ .ts,.js}"],
  synchronize: true,
};


@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConf),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    UserWalletModule,
    MailModule,
    OpenseaModule,
    LogModule,
    ContractModule,
    NftModule,
    FanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
