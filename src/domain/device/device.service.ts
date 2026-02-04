import { BadRequestException, Injectable } from '@nestjs/common';
import { RawData, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { DeviceInfoDto } from './dto/device.info.dto';
import { DeviceRepository } from '../../DB/repository/device.repository';

@Injectable()
export class DeviceService {
  // 정적 인스턴스 저장
  private static instance: DeviceService;

  constructor(private readonly deviceRepository: DeviceRepository) {
    // 인스턴스 저장
    DeviceService.instance = this;
  }

  // 정적 메서드 추가
  static getInstance(): DeviceService | null {
    return DeviceService.instance || null;
  }

  private connections = new Map<number, WebSocket>();

  async connection(ws: WebSocket, req: IncomingMessage) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const deviceId = url.searchParams.get('device_id');
    if (!deviceId) {
      ws.send(JSON.stringify({ error: 'device_id가 없습니다.' }));
      ws.close(1008, 'device_id missing'); // 1008 = Policy Violation
      return;
    }
    const numberDeviceId = Number(deviceId);
    if (isNaN(numberDeviceId)) {
      ws.send(JSON.stringify({ error: 'device_id가 숫자가 아닙니다' }));
      ws.close(1008, 'device_id is not number'); // 1008 = Policy Violation
      return;
    }

    this.connections.set(numberDeviceId, ws);
    await this.deviceRepository.connectDevice(numberDeviceId);

    // 메시지 이벤트 직접 처리
    ws.on('message', (data) => {
      const deviceInfoDto = this.messageToDto(ws, data);
      this.deviceInfo(numberDeviceId, deviceInfoDto);
    });
    ws.on('close', () => {
      this.delete(numberDeviceId);
    });
  }

  messageToDto(ws: WebSocket, data: RawData): DeviceInfoDto {
    const inputString = JSON.stringify(data);
    const input = JSON.parse(inputString) as {
      type: string;
      data: number[];
    };
    //메세지 파싱
    const resultStr = input.data
      .map((num) => String.fromCharCode(num))
      .join('');
    //객체로
    let info: DeviceInfoDto;
    try {
      info = JSON.parse(resultStr) as DeviceInfoDto;
    } catch (e) {
      throw new BadRequestException('입력값이 json이 아님');
    }
    //단 하나라도 0이 아니면서 nullable일때
    if (
      !info.type ||
      !info.payload ||
      (info.payload.lat !== 0 && !info.payload.lat) ||
      (info.payload.lon !== 0 && !info.payload.lon) ||
      (info.payload.humidity !== 0 && !info.payload.humidity) ||
      (info.payload.temperature !== 0 && !info.payload.temperature)
    ) {
      ws.close(1008, '400 Bad Request');
      throw new BadRequestException('알맞은 형식이 아님');
    }
    return info;
  }

  deviceInfo(deviceId: number, deviceInfoDto: DeviceInfoDto) {
    void this.deviceRepository.saveInfo({
      deviceId,
      humidity: deviceInfoDto.payload.humidity,
      temperature: deviceInfoDto.payload.temperature,
      latitude: deviceInfoDto.payload.lat,
      longitude: deviceInfoDto.payload.lon,
    });
  }

  delete(deviceId: number) {
    this.connections.delete(deviceId);
    void this.deviceRepository.disconnectDevice(deviceId);
  }

  send<T>(deviceId: number, type: string, payload: T) {
    const ws = this.connections.get(deviceId);
    if (ws) ws.send(JSON.stringify({ type, payload }));
  }

  isConnect(deviceId: number) {
    return this.connections.has(deviceId);
  }
}
