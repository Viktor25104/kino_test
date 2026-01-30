import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { RedisModule } from './infrastructure/redis/redis.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret_key',
            signOptions: { expiresIn: '1h' },
        }),
        RedisModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService],
})
export class AppModule { }
