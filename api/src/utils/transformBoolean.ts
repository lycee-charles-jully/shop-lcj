import { TransformFnParams } from 'class-transformer';

export const transformBoolean = ({ value }: TransformFnParams) => value === '' || value === 'true' || value === '1';