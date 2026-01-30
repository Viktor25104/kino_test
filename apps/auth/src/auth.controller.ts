import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterRequest, LoginRequest, ValidateUserRequest } from './interfaces/auth.interface';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @GrpcMethod('AuthService', 'Register')
    async register(data: RegisterRequest) {
        return this.authService.register(data);
    }

    @GrpcMethod('AuthService', 'Login')
    async login(data: LoginRequest) {
        return this.authService.login(data);
    }

    @GrpcMethod('AuthService', 'ValidateUser')
    async validateUser(data: ValidateUserRequest) {
        return this.authService.validateUser(data);
    }
}
