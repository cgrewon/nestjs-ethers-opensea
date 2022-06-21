import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserWallet } from 'src/user-wallet/entities/user-wallet.entity';
import { AuthMiddleware } from 'src/user/auth.middleware';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, UserWallet]),
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'user/auth/token/check', method: RequestMethod.POST },
      );
  }
}