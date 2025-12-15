import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtWsGuard } from '../auth/jwt/jwt-ws.guard';
import { ZoneSocketService } from './service/zone.socket-service';
import { GetDevicesStatusDto } from './dto/get-devices-status.dto';

@WebSocketGateway({
  namespace: '/zone/devices',
  cors: { origin: '*' },
})
export class ZoneGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly zoneService: ZoneSocketService) {}

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('get-devices-status')
  async handleGetDevicesStatus(
    @MessageBody() data: GetDevicesStatusDto,
    @ConnectedSocket() client: Socket,
  ) {
    const devices = await this.zoneService.getDevicesStatus(data.zoneId);

    client.emit('devices-status-update', { devices });
  }
}
