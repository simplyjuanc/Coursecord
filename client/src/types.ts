import { Session, User } from 'next-auth';

export interface SessionWithToken extends Session {
  accessToken: string;
  error: unknown;
  user: DbUser
}

export interface DbUser extends User {
  id: string;
  oauth_id: string,
  oauth_provider: string,
  roles: string[]
}

