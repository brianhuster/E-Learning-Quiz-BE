import { Request } from 'express';
import { ProfileResponse } from 'src/auth/dto/response/profile.response';

export interface RequestWithUser extends Request {
  user: ProfileResponse;
}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: number;
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}
