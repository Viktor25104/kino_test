import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { Redis } from 'ioredis';
import * as bcrypt from 'bcryptjs';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, ValidateUserRequest, ValidateUserResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
    ) { }

    async onModuleInit() {
        // Optional connection check
    }

    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const { email, password } = data;
        if (!email || !password) {
            throw new Error('Email and password required');
        }
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
            },
        });
        return { id: user.id, email: user.email };
    }

    async login(data: LoginRequest): Promise<LoginResponse> {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (!user || !await bcrypt.compare(data.password, user.passwordHash)) {
            throw new Error('Invalid credentials');
        }
        const token = this.jwtService.sign({ sub: user.id, email: user.email });
        // Save session in Redis (1 hour TTL)
        await this.redis.set(`session:${token}`, user.id, 'EX', 3600);
        return { token };
    }

    async validateUser(data: ValidateUserRequest): Promise<ValidateUserResponse> {
        const userId = await this.redis.get(`session:${data.token}`);
        if (!userId) {
            return { userId: 0, isValid: false };
        }
        return { userId: parseInt(userId), isValid: true };
    }
}
