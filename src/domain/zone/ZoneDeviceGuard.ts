import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ZoneRepository } from '../../DB/repository/zone.repository';
import { DeviceRepository } from '../../DB/repository/device.repository';
import { Socket } from 'socket.io';

@Injectable()
export class ZoneDeviceGuard implements CanActivate {
  constructor(
    private readonly zoneRepo: ZoneRepository,
    private readonly deviceRepo: DeviceRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const data = context.switchToWs().getData<{ zoneId: string }>();

    const socketData = client.data as {
      user: {
        user_id: string;
      };
    };

    const { user } = socketData;
    const { zoneId } = data;

    if (!zoneId) return false;

    const zone = await this.zoneRepo.findOneByZoneId(zoneId);
    return !(!zone || zone.userId !== user.user_id);
  }
}
