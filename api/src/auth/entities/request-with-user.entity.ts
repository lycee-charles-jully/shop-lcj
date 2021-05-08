import { Request } from 'express';
import { UserDoc } from '../../schemas/user.schema';

export interface RequestWithUserEntity extends Request {
    user: UserDoc;
}