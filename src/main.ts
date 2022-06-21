import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const crypto = require("crypto");

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  console.log('SETTTING : > ', {
    NETWORK: process.env.NETWORK
  })
  app.setGlobalPrefix('api');
  // const userService = app.get(UserService);
  // const res = await userService.createAdmin();
  // console.log('admin create res: ', res);
  
  app.enableCors();
  const port = process.env.NODE_PORT ? process.env.NODE_PORT : 3000;
  console.log('Server is running on : ', port);
  await app.listen(port);

}
bootstrap();
