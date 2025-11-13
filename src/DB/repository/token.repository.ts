import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from '../entity/token.entity';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly repo: Repository<TokenEntity>,
  ) {}
  async findByToken(refresh_token: string) {
    return await this.repo.findOne({ where: { refresh_token } });
  }

  async findUserByToken(refresh_token: string) {
    const token = await this.repo.findOne({
      where: { refresh_token },
      relations: ['user'],
    });
    return token?.user;
  }

  async create(user: UserEntity, refresh_token: string, expiresAt: Date) {
    const token = this.repo.create({ user, refresh_token, expiresAt });
    return await this.repo.save(token);
  }

  async exists(refresh_token: string) {
    return await this.repo.exists({ where: { refresh_token } });
  }
  
  async deleteRefreshToken(refresh_token: string) {
    return await this.repo.delete({ refresh_token });
  }
}
