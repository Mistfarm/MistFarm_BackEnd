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
import { UserRepository } from '../../DB/repository/user.repository';

@WebSocketGateway({
  namespace: '/zone/devices',
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
})
export class ZoneDeviceGateway {
  constructor(
    private readonly deviceRepo: DeviceRepository,
    private readonly userRepo: UserRepository,
    private readonly zoneRepo: ZoneRepository,
    private readonly jwtService: JwtService,
  ) {
    console.log('0. ZoneDeviceGateway 로드됨');
  }

  // JWT 추출 및 사용자 검증
  private extractUserId(client: Socket): string {
    const authHeader = client.handshake.headers['authorization'];

    if (!authHeader || Array.isArray(authHeader)) {
      console.log('Authorization 헤더가 없습니다');
      throw new WsException('Authorization 헤더가 없습니다');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      console.log('토큰 형식이 올바르지 않습니다');
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
    console.log('handleGetDevicesStatus 호출됨', data);
    console.log('get-devices-status 수신', data);
    try {
      const userId = this.extractUserId(client);
      const { zoneId } = data;
      console.log('3. zoneId:', zoneId);

      if (!zoneId) {
        client.emit('error', { message: 'zoneId가 필요합니다' });
        throw new WsException('zoneId가 필요합니다');
      }

      const user = await this.userRepo.findById(userId);

      if (!user?.user_id) {
        client.emit('error', { message: '사용자를 찾을 수 없습니다' });
        throw new WsException('사용자를 찾을 수 없습니다');
      }

      // 구획 소유권 검증
      const zone = await this.zoneRepo.findByZoneIdAndUserId(
        user.user_id,
        zoneId,
      );

      if (!zone) {
        client.emit('error', { message: '접근 권한이 없는 구획입니다' });
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
