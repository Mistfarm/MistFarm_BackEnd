import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('🔐 AuthJwtGuard 실행됨');
    const request = context.switchToHttp().getRequest();
    console.log('   - Authorization header:', request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.log('❌ 인증 실패:', err || info);
      throw err || new UnauthorizedException();
    }
    console.log('✅ 인증 성공:', user.user_id);
    return user;
  }
}
