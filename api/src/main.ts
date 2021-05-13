import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.use(helmet({
        contentSecurityPolicy: process.env.NODE_ENV === 'development' ? false : {
            directives: {
                defaultSrc: [ `'self'` ],
                scriptSrc: [ `'self'` ],
                objectSrc: [ `'none'` ],
                upgradeInsecureRequests: [],
            },
        },
        referrerPolicy: false,
        xssFilter: false,
        ieNoOpen: false,
    }));

    app.use(cookieParser());

    app.enableCors();

    if (process.env.NODE_ENV === 'development') {
        const config = new DocumentBuilder()
            .setTitle('Shop LCJ')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('swagger', app, document, {
            swaggerOptions: { persistAuthorization: true },
            customSiteTitle: 'Shop LCJ API',
        });
    }

    await app.listen(process.env.API_PORT || 5000);
}

bootstrap();
