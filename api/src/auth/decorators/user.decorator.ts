import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDoc, User as UserEntity } from '../../schemas/user.schema';

export const User = createParamDecorator(
    (key: keyof UserEntity | '_id', ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as UserDoc;

        return key ? user?.[key] : user;
    },
);
