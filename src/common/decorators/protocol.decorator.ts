import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Protocol = createParamDecorator(
  (defaultValue: string, ctx: ExecutionContext) => {
    console.log('defaultVal' + defaultValue)
    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
  },
);
