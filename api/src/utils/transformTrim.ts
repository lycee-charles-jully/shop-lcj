import { TransformFnParams } from 'class-transformer';

export const transformTrim = ({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : value;