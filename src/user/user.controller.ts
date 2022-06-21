import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  HttpStatus,
  Res,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { getRepository } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body('user') userData: CreateUserDto) {
    try {
      const user = await this.userService.create(userData);

      const token = await this.userService.generateJWT(user);

      return {
        token,
        user: user,
      };
    } catch (ex) {
      console.log('at register user', ex);
      throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }


  @Patch('update/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateProfile(
    @Param('id') id: number,
    @Body('username') username?: string,
    @Body('bio') bio?: string,
    @Body('avatar') avatar?: string,
  ) {
    return await this.userService.updateUserProfile(id, username, bio, avatar);
  }


  @UsePipes(new ValidationPipe())
  @Post('auth/login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Body('email') email: string,
    @Body('pwd') pwd: string,
  ): Promise<{ token: string; user: User }> {
    // const _user = await this.userService.findByUserNamePassword(loginUserDto);
    let _user = await this.userService.findByUserNamePassword({
      username: email,
      password: pwd,
    });

    if (!_user)
      throw new HttpException(
        'user not found or incorrect password',
        HttpStatus.UNAUTHORIZED,
      );

    _user = await this.userService.getFullUserProfile(_user.id);

    const token = await this.userService.generateJWT(_user);

    return {
      token,
      user: _user,
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('auth/forget')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async forgetPwd(@Body('email') email: string) {
    const _user = await this.userService.findByEmail(email);
    if (!_user) {
      return new HttpException('Email is not exist.', HttpStatus.NOT_FOUND);
    }

    // send forget email;

    const res = await this.userService.sendForgetPwdCode(_user);
    if (res === null) {
      return new HttpException(
        'Failed to send reset password email, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return res;
  }

  @Post('auth/token/check')
  @UseInterceptors(ClassSerializerInterceptor)
  async tokenCheck(@Req() req) {
    let user = req.user;

    const token = await this.userService.generateJWT(user);

    user = await this.userService.getFullUserProfile(user.id);

    return {
      token: token,
      user: user,
    };
  }

  @Post('auth/confirm/email')
  @UseInterceptors(ClassSerializerInterceptor)
  async confirmEmail(@Body('userId') userId: number) {
    return await this.userService.sendActiveEmail(userId);
  }

  @Post('auth/check/active_email')
  @UseInterceptors(ClassSerializerInterceptor)
  async checkEmailActive(@Req() req, @Body('userId') userId: number) {
    return await this.userService.checkEmailActive(userId);
  }

  @Get('auth/active/:code')
  async activeEmail(@Res() res, @Param('code') code: string) {
    const activeRes = await this.userService.activeEmail(code);
    if (activeRes === null) {
      throw new HttpException(
        'Active link is not correct.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return res.redirect(process.env.APP_HOST);
  }

  @UsePipes(new ValidationPipe())
  @Post('auth/reset')
  @UseInterceptors(ClassSerializerInterceptor)
  async resetPwd(@Body('code') code: string, @Body('pwd') pwd: string) {
    const resetRes = await this.userService.resetPassword(code, pwd);
    // send forget email;
    if (resetRes === null) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    return resetRes;
  }

  @Post('/auth/magic/login_req')
  @UseInterceptors(ClassSerializerInterceptor)
  async magicLoginRequest(@Body('email') email: string) {
    const result = await this.userService.sendMagicLoginLink(email);

    if (result == null) {
      throw new HttpException('Not working for now.', HttpStatus.CONFLICT);
    }

    return {
      sent: true,
    };
  }

  @Post('/auth/magic/login')
  @UseInterceptors(ClassSerializerInterceptor)
  async magicLogin(@Body('code') code: string) {
    let user = await this.userService.findByCode(code);
    if (!user) {
      throw new HttpException('Invalid login link.', HttpStatus.BAD_REQUEST);
    }

    const updated = await this.userService.removeCodeFromUser(user);
    updated.isActive = true;
    await getRepository(User).save(updated);

    user = await this.userService.getFullUserProfile(user.id);

    const token = await this.userService.generateJWT(user);

    return {
      token,
      user,
    };
  }

  
}
