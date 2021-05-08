import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { MongoConflictError } from './MongoConflictError';

export function handleMongoError(e: unknown) {
    if (!(e instanceof MongoError))
        throw e;
    if (e.code === MongoErrorCodes.DUPLICATE_KEY_ERROR) {
        const conflictKey = Object.keys((e as MongoConflictError).keyPattern)[0];
        throw new ConflictException(`The field ${conflictKey} already exist in the database`);
    }
    throw new InternalServerErrorException(e);
}


export enum MongoErrorCodes {
    DUPLICATE_KEY_ERROR = 11000,
}
