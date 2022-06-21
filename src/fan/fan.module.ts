import { Global, Module } from '@nestjs/common';
import { FanService } from './fan.service';
import { FanController } from './fan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fan } from './entities/fan.entity';

@Global()
@Module({
  imports:[
    TypeOrmModule.forFeature([Fan])
  ],
  controllers: [FanController],
  providers: [FanService],
  exports:[FanService]
})
export class FanModule {}
