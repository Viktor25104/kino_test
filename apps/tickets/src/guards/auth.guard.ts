import { CanActivate, ExecutionContext, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GqlExecutionContext } from '@nestjs/graphql';
import { lastValueFrom, Observable } from 'rxjs';

interface AuthService {
    ValidateUser(data: { token: string }): Observable<{ userId: number; isValid: boolean }>;
}

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
    private authService: AuthService;

    constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) { }

    onModuleInit() {
        this.authService = this.client.getService<AuthService>('AuthService');
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new UnauthorizedException('No token provided');

        const token = authHeader.split(' ')[1];
        if (!token) throw new UnauthorizedException('Invalid token format');

        try {
            const response = await lastValueFrom(this.authService.ValidateUser({ token }));
            if (!response || !response.isValid) throw new UnauthorizedException('Invalid token');

            // Extract email from token payload
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            req.user = { id: response.userId, email: payload.email };

            return true;
        } catch (e) {
            throw new UnauthorizedException('Token validation failed');
        }
    }
}
