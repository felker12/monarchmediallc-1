export interface LoginResponse {
    token: string;
    expiresAtUtc: string; // ISO String format
    username: string;
}