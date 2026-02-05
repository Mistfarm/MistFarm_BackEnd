import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { createServer, Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { DeviceService } from './device.service';

@Injectable()
export class DeviceGateway implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DeviceGateway.name);
  private wss!: WebSocketServer;
  private server!: Server;

  constructor(private readonly deviceService: DeviceService) {
    this.logger.log('🌐 DeviceGateway 생성됨');
  }

  onModuleInit(): void {
    this.logger.log('🚀 DeviceGateway 초기화 시작');

    this.server = createServer();
    this.wss = new WebSocketServer({ server: this.server });

    const port = Number(process.env.WSPORT) || 3001;

    this.server.listen(port, () => {
      this.logger.log(`✅ WebSocket 서버 시작됨 - 포트: ${port}`);
    });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      this.logger.log('🔌 새로운 WebSocket 연결');
      this.logger.log(`   - URL: ${req.url}`);
      this.logger.log(`   - Origin: ${req.headers.origin}`);

      void this.deviceService.connection(ws, req);
    });

    this.wss.on('error', (error: Error) => {
      this.logger.error('❌ WebSocket 서버 오류:', error);
    });
  }

  onModuleDestroy(): void {
    this.logger.log('🛑 DeviceGateway 종료 중...');

    if (this.wss) {
      this.wss.close(() => {
        this.logger.log('   - WebSocket 서버 닫힘');
      });
    }

    if (this.server) {
      this.server.close(() => {
        this.logger.log('   - HTTP 서버 닫힘');
      });
    }
  }
}
