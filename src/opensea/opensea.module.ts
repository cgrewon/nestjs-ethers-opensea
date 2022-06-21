import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OpenseaService } from './opensea.service';
import { OpenseaController } from './opensea.controller';
import { LogModule } from 'src/log/log.module';
import { ContractModule } from 'src/contract/contract.module';
import { AuthMiddleware } from 'src/user/auth.middleware';

@Global()
@Module({
  imports:[
    
    ContractModule,
    LogModule
  ],
  controllers: [OpenseaController],
  providers: [OpenseaService],
  exports:[OpenseaService]
})


export class OpenseaModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'opensea/create_sell_order', method: RequestMethod.POST },
      );
  }
}
