import { AuthSignupDto } from './dto/auth.signup.dto';
import { UserRepository } from '../../DB/repository/user.repository';
import { AuthLoginDto } from './dto/auth.login.dto';
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async signup(authSignupDto: AuthSignupDto) {
    const { email, password, name } = authSignupDto;

    if ((await this.userRepo.findByEmail(email)) != null) {
      throw new ConflictException('User already exists');
    }

    await this.userRepo.create(email, await bcrypt.hash(password, 10), name);
  }

  async login(authLoginDto: AuthLoginDto) {
    const { email, password } = authLoginDto;
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
  }
}
