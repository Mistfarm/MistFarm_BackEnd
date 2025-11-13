import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../../DB/entity/user.entity';

export const DecoraterUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: UserEntity }>();
    return request.user;
  },
);
