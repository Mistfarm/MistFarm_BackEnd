import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserRepository } from '../../../DB/repository/user.repository';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../../DB/entity/user.entity';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userRepo: UserRepository,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //만료 알잘딱 하겠다
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
    });
  }

  async validate(payload: { email: string }): Promise<UserEntity> {
    const { email } = payload;

    if (!email) {
      throw new UnauthorizedException('토큰 정보 부족');
    }
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
