import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(id: string, password: string, name: string) {
    const user = this.repo.create({ id, password, name });
    return this.repo.save(user);
  }

  async deleteUser(user: UserEntity) {
    return this.repo.delete(user);
  }

  async updateUser(user: UserEntity) {
    return this.repo.save(user);
  }
}
