import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { DeviceService } from './device.service';

@Injectable()
export class DeviceGateway implements OnModuleInit, OnModuleDestroy {
  constructor(private deviceService: DeviceService) {}
  private wss: WebSocketServer;

  onModuleInit() {
    const server: Server = createServer();

    this.wss = new WebSocketServer({ server });

    server.listen(process.env.WSPORT ?? 3001, () => {});
    this.wss.on('connection', (ws: WebSocket, req) => {
      void this.deviceService.connection(ws, req);
    });
  }

  onModuleDestroy() {
    this.wss.close();
  }
}
