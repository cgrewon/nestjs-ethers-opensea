import { Injectable } from '@nestjs/common';
var metadata = require('../package.json')

@Injectable()
export class AppService {
  getHello(): string {
    
    return 'Hello World! version:' + metadata.version;
  }
}
