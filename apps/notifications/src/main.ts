import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
            },
            consumer: {
                groupId: 'notifications-consumer',
            },
        },
    });

    await app.startAllMicroservices();
    await app.listen(3002);
    console.log('Notifications Service is running');
}
bootstrap();
