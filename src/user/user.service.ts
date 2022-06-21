import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from 'src/enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { MailService } from 'src/mail/mail.service';
import * as argon2 from 'argon2';
const crypto = require('crypto');

const jwt = require('jsonwebtoken');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, first_name, last_name, password } = createUserDto;

    const qb = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      throw new HttpException(
        'Username and email already exist.',
        HttpStatus.CONFLICT,
      );
    }

    let newUser = new User();
    newUser.username = username;
    newUser.first_name = first_name;
    newUser.last_name = last_name;
    newUser.email = email;
    newUser.password = password;
    newUser.isActive = false;

    newUser.role = createUserDto.role;

    const errors = await validate(newUser);

    if (errors.length > 0) {
      throw new HttpException(
        'Userinput is not valid.',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const token = Math.random().toFixed(12).slice(2);
      newUser.code = token;
      const savedUser = await this.userRepository.save(newUser);
      savedUser.password = undefined;

      const mailRes = await this.mailService.sendConfirmEmail(savedUser, token);

      return savedUser;
    }
  }

  async createWithEmail(email: string, role: Role) {
    if (!email) {
      throw new HttpException('Invalid email.', HttpStatus.BAD_REQUEST);
    }

    let emailParts = email.split('@');
    if (emailParts.length != 2) {
      throw new HttpException('Invalid email format.', HttpStatus.BAD_REQUEST);
    }

    const sameEmailUser = await getRepository(User)
      .createQueryBuilder()
      .where('email = :email', { email })
      .getOne();

    if (sameEmailUser) {
      return sameEmailUser;
    }

    const username = emailParts[0];

    let newUser = new User();
    newUser.username = username;
    newUser.first_name = '';
    newUser.last_name = '';
    newUser.email = email;
    newUser.password = '';
    newUser.isActive = false;
    newUser.role = role;

    const errors = await validate(newUser);

    if (errors.length > 0) {
      throw new HttpException(
        'Userinput is not valid.',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    }
  }

  public generateJWT(user: User) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      process.env.JWT_SECRET,
    );
  }

  async findByUserNamePassword({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<User> {
    const qb = await getRepository(User).createQueryBuilder('user');

    const userByName = await qb
      .where('username = :username', { username: username })
      .getOne();
    const userByEmail = await qb
      .where('email = :email', { email: username })
      .getOne();

    if (!userByName && !userByEmail) {
      return null;
    }
    const user = userByEmail ? userByEmail : userByName;

    if (await argon2.verify(user.password, password)) {
      return user;
    }
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const q = await getRepository(User).createQueryBuilder('user');

    const user = await q.where({ email: email }).getOne();

    return user;
  }

  async sendForgetPwdCode(user: User): Promise<any> {
    const token = Math.random().toFixed(8).slice(2);
    const newUserCode = { ...user, code: token };
    const savedUser = await this.userRepository.save(newUserCode);
    if (savedUser) {
      return await this.mailService.sendPwdResetCodeEmail(user, token);
    } else {
      return null;
    }
  }

  async sendMagicLoginLink(email: string): Promise<any> {
    let user = await this.findByEmail(email);
    if (!user) {
      //* create new User with email only
      user = await this.createWithEmail(email, Role.Fan);
    }
    const token = crypto.randomBytes(100).toString('hex');

    user.code = token;
    const saved = await this.userRepository.save(user);

    console.log('magic login :', saved);

    const res = await this.mailService.sendMagicLink(email, token);

    return res;
  }

  async sendActiveEmail(userId: number) {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new HttpException(
        'Invalid user, please check your account and try again.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.isActive) {
      return { already_active: true };
    }

    const token = Math.random().toFixed(12).slice(2);
    user.code = token;
    const savedUser = await this.userRepository.save(user);

    const mailRes = await this.mailService.sendConfirmEmail(savedUser, token);
    return { sent: true };
  }

  async checkEmailActive(userId: number) {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new HttpException(
        'Invalid user, please check your account and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.isActive) {
      const data = {
        ...user,
      };
      return data;
    }
    throw new HttpException('Not activated email', HttpStatus.NOT_ACCEPTABLE);
  }

  async activeEmail(code: string): Promise<any> {
    const user = await this.findByCode(code);
    if (user) {
      const newUser = { ...user, code: '', isActive: true };
      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } else {
      return null;
    }
  }

  async findByCode(code: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder()
      .where('code = :code', { code })
      .getOne();

    return user;
  }

  async removeCodeFromUser(user: User) {
    user.code = '';
    const updated = await this.userRepository.save(user);
    return updated;
  }

  async resetPassword(code: string, newPassword: string): Promise<any> {
    const _user = await this.findByCode(code);

    if (!_user) {
      return null;
    }
    _user.password = await argon2.hash(newPassword);
    _user.code = '';
    const savedUser = await this.userRepository.save(_user);
    savedUser.password = undefined;

    return { status: HttpStatus.OK, user: savedUser };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException('Invalid UserId', HttpStatus.BAD_REQUEST);
    }

    user.email = updateUserDto.email;
    user.role = updateUserDto.role;
    user.username = updateUserDto.username;
    user.first_name = updateUserDto.first_name;
    user.last_name = updateUserDto.last_name;

    const saved = await this.userRepository.save(user);
    saved.password = undefined;
    return saved;
  }

  async updateUserProfile(
    id: number,
    username?: string,
    bio?: string,
    avatar?: string,
  ) {
    const one = await this.userRepository.findOne(id);
    if (!one) {
      throw new HttpException('Invalid user id.', HttpStatus.BAD_REQUEST);
    }

    if (username) {
      one.username = username;
    }

    if (bio) {
      one.bio = bio;
    }
    
    if (avatar) {
      one.avatar = avatar;
    }

    return await this.userRepository.save(one);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async checkOwnerOfWallet(
    userId: number,
    walletAddr: string,
  ): Promise<boolean> {
    const user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wallets', 'wallets')
      .where('user.id = :userId', { userId: userId })
      .getOne();

    if (!user) {
      return false;
    }

    const one = user.wallets.find((wallet) => wallet.address == walletAddr);

    return !!one;
  }

  async getFullUserProfile(userId: number) {
    const user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wallets', 'wallets')
      .where('user.id = :userId', { userId: userId })
      .getOne();

    return user;
  }
}
