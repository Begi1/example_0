// types/index.ts
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string; // In production, ensure you never store plain text passwords
    createdAt: Date;
    teams?: string[];
}

export interface SignInRequestBody {
  email: string;
  password: string;
}

export interface ProtectedResponse {
  message: string;
  user: User;
}