import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // HTTP Server for GraphQL
    await app.listen(8001);
}
bootstrap();
