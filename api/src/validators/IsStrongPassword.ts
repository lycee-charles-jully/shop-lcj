import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export const IsStrongPassword = (validationOptions?: ValidationOptions) =>
    (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isStringPassword',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value?: string, validationArguments?: ValidationArguments) {
                    if (!value)
                        return false;
                    if (!value.match(/[a-z]/))
                        return false;
                    if (!value.match(/[A-Z]/))
                        return false;
                    if (!value.match(/\d/))
                        return false;
                    return value.length >= 8;
                },
                defaultMessage: (validationArguments?: ValidationArguments) =>
                    'The password should contain at least one capital letter, one lowercase letter and a number',
            },
        });
    };