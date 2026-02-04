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
      console.log('[CORS] origin:', origin);
      console.log('[CORS] allowedOrigins:', allowedOrigins);

      // origin이 없는 경우도 허용 (같은 도메인에서의 요청)
      if (!origin || allowedOrigins.includes(origin)) {
        console.log('[CORS] ✅ 허용됨');
        callback(null, true);
      } else {
        console.log('[CORS] ❌ 차단된 origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST'], // 추가
  },
  // transports와 path 제거하거나 주석 처리
  // transports: ['websocket', 'polling'],
  // path: '/socket.io',
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
    console.log('✅ ZoneDeviceGateway 초기화 완료');
    console.log('   - namespace: /zone/devices');
  }

  handleConnection(client: Socket) {
    console.log(`✅ [WS CONNECT] 클라이언트 연결: ${client.id}`);
    console.log('   - namespace:', client.nsp?.name);
    console.log('   - transport:', client.conn.transport.name);
    console.log('   - address:', client.handshake?.address);
    console.log('   - query:', client.handshake?.query);
    console.log('   - origin:', client.handshake?.headers?.origin);

    // 연결 확인 응답
    client.emit('connected', {
      clientId: client.id,
      message: 'Connected successfully',
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ [WS DISCONNECT] 클라이언트 연결 종료: ${client.id}`);
  }

  private extractUserId(token: string): string {
    console.log('🔐 [JWT] 토큰 검증 시작');
    console.log('   - token length:', token?.length);

    try {
      const payload = this.jwtService.verify<{ id: string }>(token);
      console.log('✅ [JWT] 검증 성공 payload:', payload);
      return payload.id;
    } catch (error) {
      console.log('❌ [JWT] 검증 실패');
      console.error(error);
      throw new WsException('유효하지 않은 토큰입니다');
    }
  }

  @SubscribeMessage('get-devices-status')
  async handleGetDevicesStatus(
    @MessageBody() data: { zoneId: string; token: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('📩 [EVENT] get-devices-status 수신');
    console.log('   - clientId:', client.id);
    console.log('   - raw data:', data);

    const { token, zoneId } = data;

    console.log('   - zoneId:', zoneId);
    console.log('   - token exists:', !!token);

    if (!zoneId) {
      console.log('❌ zoneId 누락');
      client.emit('error', { message: 'zoneId가 필요합니다' });
      throw new WsException('zoneId가 필요합니다');
    }

    if (!token) {
      console.log('❌ token 누락');
      client.emit('error', { message: 'token이 필요합니다' });
      throw new WsException('token이 필요합니다');
    }

    try {
      console.log('1) 사용자 추출 시작');
      const userId = this.extractUserId(token);
      console.log('   - userId:', userId);

      console.log('2) userRepo.findById 호출');
      const user = await this.userRepo.findById(userId);
      console.log('   - user 조회 결과:', user);

      if (!user?.user_id) {
        console.log('❌ user.user_id 없음 (사용자 조회 실패)');
        client.emit('error', { message: '사용자를 찾을 수 없습니다' });
        throw new WsException('사용자를 찾을 수 없습니다');
      }

      console.log('3) zoneRepo.findByZoneIdAndUserId 호출');
      console.log('   - user_id:', user.user_id);
      console.log('   - zoneId:', zoneId);

      const zone = await this.zoneRepo.findByZoneIdAndUserId(
        user.user_id,
        zoneId,
      );
      console.log('   - zone 조회 결과:', zone);

      if (!zone) {
        console.log('❌ zone 없음 (권한 없음)');
        client.emit('error', { message: '접근 권한이 없는 구획입니다' });
        throw new WsException('접근 권한이 없는 구획입니다');
      }

      console.log('4) deviceRepo.findByZoneId 호출');
      const devices = await this.deviceRepo.findByZoneId(zoneId);

      console.log('   - devices count:', devices?.length ?? 0);
      console.log('   - devices sample[0]:', devices?.[0]);

      const payload = {
        devices: devices.map((d) => ({
          deviceName: d.deviceName,
          connected: d.onConnect,
          lat: d.latitude,
          lon: d.longitude,
        })),
      };

      console.log('5) devices-status-update emit');
      console.log('   - payload:', payload);

      client.emit('devices-status-update', payload);

      console.log('✅ 완료: devices-status-update 전송 성공');
    } catch (error) {
      console.log('🔥 [ERROR] get-devices-status 처리 중 예외 발생');
      console.log('   - is WsException:', error instanceof WsException);

      if (!(error instanceof WsException)) {
        console.error('기기 상태 조회 오류:', error);
      }

      throw error instanceof WsException
        ? error
        : new WsException('기기 상태 조회 중 오류');
    }
  }
}
