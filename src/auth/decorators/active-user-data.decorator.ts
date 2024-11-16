import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../active-user.interface';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];

    return field ? user?.[field] : user;
  },
);