import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class ZoneDeviceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly deviceRepo: DeviceRepository,
    private readonly userRepo: UserRepository,
    private readonly zoneRepo: ZoneRepository,
    private readonly jwtService: JwtService,
  ) {
    console.log('0. ZoneDeviceGateway 로드됨');
  }

  // WebSocket 연결 시 호출
  handleConnection(client: Socket) {
    console.log(`클라이언트 연결: ${client.id}`);
    // 메시지 기반 인증이므로 여기서는 토큰 검증 안 함
  }

  handleDisconnect(client: Socket) {
    console.log(`클라이언트 연결 종료: ${client.id}`);
  }

  // JWT 추출 및 사용자 검증
  private extractUserId(token: string): string {
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
    @MessageBody() data: { zoneId: string; token: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('get-devices-status 수신', data);

    const { token, zoneId } = data;

    if (!zoneId) {
      client.emit('error', { message: 'zoneId가 필요합니다' });
      throw new WsException('zoneId가 필요합니다');
    }

    try {
      const userId = this.extractUserId(token);
      const user = await this.userRepo.findById(userId);

      if (!user?.user_id) {
        client.emit('error', { message: '사용자를 찾을 수 없습니다' });
        throw new WsException('사용자를 찾을 수 없습니다');
      }

      const zone = await this.zoneRepo.findByZoneIdAndUserId(
        user.user_id,
        zoneId,
      );
      if (!zone) {
        client.emit('error', { message: '접근 권한이 없는 구획입니다' });
        throw new WsException('접근 권한이 없는 구획입니다');
      }

      const devices = await this.deviceRepo.findByZoneId(zoneId);
      const payload = {
        devices: devices.map((d) => ({
          deviceName: d.deviceName,
          connected: d.onConnect,
          lat: d.latitude,
          lon: d.longitude,
        })),
      };

      client.emit('devices-status-update', payload);
    } catch (error) {
      if (!(error instanceof WsException))
        console.error('기기 상태 조회 오류:', error);
      throw error instanceof WsException
        ? error
        : new WsException('기기 상태 조회 중 오류');
    }
  }
}
