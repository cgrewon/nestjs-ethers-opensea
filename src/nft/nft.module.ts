import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from './entities/nft.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthMiddleware } from 'src/user/auth.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Nft, User])],
  controllers: [NftController],
  providers: [NftService]
})



export class NftModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'nft/create', method: RequestMethod.POST },
      );
  }
}
