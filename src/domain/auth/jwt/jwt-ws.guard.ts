import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../../DB/repository/user.repository';
import { Socket } from 'socket.io';

@Injectable()
export class JwtWsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.verify(token);

    const user = await this.userRepo.findById(payload.id);
    if (!user) return false;

    client.data.user = user;
    return true;
  }
}
