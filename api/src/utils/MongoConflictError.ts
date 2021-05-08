import { MongoError } from 'mongodb';

export class MongoConflictError extends MongoError {
    driver: boolean;
    index: number;
    keyPattern: { [key: string]: number };
    keyValue: { [key: string]: any };
}