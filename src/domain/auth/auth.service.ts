import { AuthSignupDto } from './dto/auth.signup.dto';
import { UserRepository } from '../../DB/repository/user.repository';
import { AuthLoginDto } from './dto/auth.login.dto';
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthTokenService } from './jwt/auth.token.service';
import { AuthTokenDto } from './dto/auth.token.dto';
import { AuthLogoutDto } from './dto/auth.logout.dto';
import { UserEntity } from '../../DB/entity/user.entity';
import { AuthUpdateUserProfile } from './dto/auth.update.user.profile';
import { AuthRefreshTokenDto } from './dto/auth.refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtTokenService: AuthTokenService,
  ) {}

  async signup(authSignupDto: AuthSignupDto) {
    const { id, password, name } = authSignupDto;

    if ((await this.userRepo.findById(id)) != null) {
      throw new ConflictException('이미 존재하는 이메일입니다');
    }

    await this.userRepo.create(id, await bcrypt.hash(password, 10), name);
  }

  async login(authLoginDto: AuthLoginDto) {
    const { id, password } = authLoginDto;
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new BadRequestException('이메일이 존재하지 않습니다');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('비밀번호가 틀렸습니다');
    }

    const refreshToken = await this.jwtTokenService.issueRefreshToken(id);
    const tokenDto: AuthTokenDto =
      await this.jwtTokenService.reissueAccessToken(refreshToken);

    return tokenDto;
  }
  async logout(authLogoutDto: AuthLogoutDto) {
    await this.jwtTokenService.deleteRefreshToken(authLogoutDto.refreshToken);
  }
  async deleteUser(user: UserEntity) {
    await this.userRepo.deleteUser(user);
  }

  async updateUserProfile(
    user: UserEntity,
    authUpdateUserProfile: AuthUpdateUserProfile,
  ) {
    if (authUpdateUserProfile.name) {
      user.name = authUpdateUserProfile.name;
    }
    if (authUpdateUserProfile.password) {
      user.password = await bcrypt.hash(authUpdateUserProfile.password, 10);
    }
    await this.userRepo.updateUser(user);
  }
  personalInformation(user: UserEntity) {
    return { id: user.id, name: user.name };
  }
  async reissueAccessToken(refreshTokenDto: AuthRefreshTokenDto) {
    return this.jwtTokenService.reissueAccessToken(
      refreshTokenDto.refreshToken,
    );
  }
}
