export interface RegisterRequest {
    email: string;
    password?: string;
}
export interface RegisterResponse {
    id: number;
    email: string;
}
export interface LoginRequest {
    email: string;
    password?: string;
}
export interface LoginResponse {
    token: string;
}
export interface ValidateUserRequest {
    token: string;
}
export interface ValidateUserResponse {
    userId: number;
    isValid: boolean;
}
