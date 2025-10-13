import { ArgumentsHost, Catch, Injectable } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Injectable()
@Catch() // 모든 예외 잡기
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 기본 BaseExceptionFilter 처리
    super.catch(exception, host);

    // 추가로 로깅, 알림, 커스텀 처리 가능
    console.log('Caught an exception:', exception);
  }
}
