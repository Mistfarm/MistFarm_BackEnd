import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenRepository } from '../../../DB/repository/token.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../../DB/repository/user.repository';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly tokenRepo: TokenRepository,
    private readonly userRepo: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async issueRefreshToken(id: string) {
    const user = await this.userRepo.findByid(id);
    if (!user) throw new NotFoundException('존재하지 않은 유저입니다');

    // payload 구성
    const payload = {};

    // 만료 주기 읽기
    const expiresIn = '7d';
    const secret = this.configService.get<string>('JWT_SECRET');

    // 토큰 생성
    const refreshToken = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });

    // expiresAt 계산
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // fallback 7d

    // DB 저장
    await this.tokenRepo.create(user, refreshToken, expiresAt);

    // 반환
    return refreshToken;
  }

  async reissueAccessToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('존재하지 않은 토큰');

    // 1. DB에 저장된 리프레시 토큰이 유효한지 검증
    const tokenEntity = await this.tokenRepo.findByToken(refreshToken);
    if (!tokenEntity) {
      throw new UnauthorizedException('저장되어있지 않은 토큰');
    }

    // 만료 체크
    if (tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('만료된 토큰');
    }

    const user = await this.tokenRepo.findUserByToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('잘못된 토큰');
    }

    await this.tokenRepo.deleteRefreshToken(refreshToken);

    // 2. payload 구성 및 access token 생성
    const payload = { id: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1m', // 필요하면 변경
    });

    const neWRefreshToken = await this.issueRefreshToken(user.id);
    return { accessToken, refreshToken: neWRefreshToken };
  }
  async deleteRefreshToken(refreshToken: string) {
    await this.tokenRepo.deleteRefreshToken(refreshToken);
  }
}
