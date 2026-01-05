import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { DeviceRepository } from '../../DB/repository/device.repository';
import { ZoneRepository } from '../../DB/repository/zone.repository';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: '/zone/devices',
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
})
export class ZoneDeviceGateway {
  constructor(
    private readonly deviceRepo: DeviceRepository,
    private readonly zoneRepo: ZoneRepository,
    private readonly jwtService: JwtService,
  ) {}

  // JWT 추출 및 사용자 검증
  private extractUserId(client: Socket): string {
    const authHeader = client.handshake.headers['authorization'];

    if (!authHeader || Array.isArray(authHeader)) {
      throw new WsException('Authorization 헤더가 없습니다');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new WsException('토큰 형식이 올바르지 않습니다');
    }

    try {
      const payload = this.jwtService.verify<{ id: string }>(token);
      return payload.id;
    } catch (error) {
      console.error('JWT 검증 실패:', error);
      throw new WsException('유효하지 않은 토큰입니다');
    }
  }

  // get-devices-status 이벤트
  @SubscribeMessage('get-devices-status')
  async handleGetDevicesStatus(
    @MessageBody() data: { zoneId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = this.extractUserId(client);
      const { zoneId } = data;

      if (!zoneId) {
        throw new WsException('zoneId가 필요합니다');
      }

      // 구획 소유권 검증
      const zone = await this.zoneRepo.findByZoneIdAndUserId(userId, zoneId);
      if (!zone) {
        throw new WsException('접근 권한이 없는 구획입니다');
      }

      // 기기 조회
      const devices = await this.deviceRepo.findByZoneId(zoneId);

      // 응답 포맷 가공
      const payload = {
        devices: devices.map((device) => ({
          deviceName: device.deviceName,
          connected: device.onConnect,
          lat: device.latitude,
          lon: device.longitude,
        })),
      };

      // 클라이언트 전송
      client.emit('devices-status-update', payload);
    } catch (error) {
      if (error instanceof WsException) {
        throw error;
      }
      console.error('기기 상태 조회 중 오류:', error);
      throw new WsException('기기 상태를 조회하는 중 오류가 발생했습니다');
    }
  }
}
