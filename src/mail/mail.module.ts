import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';

import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SesModule } from '@nextnm/nestjs-ses';
import { MailController } from './mail.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SesModule.forRoot({
      SECRET: process.env.SES_SECRET,
      AKI_KEY: process.env.SES_KEY,
      REGION: process.env.SES_REGION,
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports:[MailService]
})
export class MailModule { }
