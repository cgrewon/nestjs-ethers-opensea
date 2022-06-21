import { Global, Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';

@Global()
@Module({
  controllers: [ContractController],
  providers: [ContractService],
  exports:[ContractService]
})
export class ContractModule {}
