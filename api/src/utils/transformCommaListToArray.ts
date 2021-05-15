import { TransformFnParams } from 'class-transformer';

export const transformCommaListToArray = ({ value }: TransformFnParams) => (value as string || '')
    .split(',')
    .filter(e => !!e);
