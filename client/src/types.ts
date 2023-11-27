import { Session } from 'next-auth';

export interface SessionWithToken extends Session {
  accessToken: string;
  error: unknown;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  image: string;
}
