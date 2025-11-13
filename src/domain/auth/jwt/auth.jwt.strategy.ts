import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserRepository } from '../../../DB/repository/user.repository';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../../DB/entity/user.entity';
import { throws } from 'node:assert';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userRepo: UserRepository,
    private configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('.env 불러오기 실패');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { email: string }): Promise<UserEntity> {
    const { email } = payload;

    if (!email) {
      throw new UnauthorizedException('토큰 정보 부족');
    }
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundException('삭제된 사용자 입니다');
    }
    return user;
  }
}
