import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeysGuard } from './guards/api-keys/api-keys.guard';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';

@Module({
    imports: [ConfigModule],
    providers: [{ provide: APP_GUARD, useClass: ApiKeysGuard }]
}) 
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*')
    }
}
