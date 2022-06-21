import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { getRepository } from 'typeorm';
import { User } from './entities/user.entity';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      try{
        const token = (authHeaders as string).split(' ')[1];
      
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
        const user: User = await getRepository(User).findOne(decoded.id);
  
        if (!user) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }
  
        req.user = user;
        next();
      }catch(ex){
        throw new HttpException(ex.message, HttpStatus.UNAUTHORIZED);
      }
     

    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
