import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserWalletService } from './user-wallet.service';
import { UserWalletController } from './user-wallet.controller';
import { AuthMiddleware } from 'src/user/auth.middleware';

@Module({
  controllers: [UserWalletController],
  providers: [UserWalletService]
})
export class UserWalletModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'user-wallet/create', method: RequestMethod.POST },
      );
  }
}