import { User } from "@prisma/client";
import { Request } from "express";

export type GoogleUser ={
  email: string;
  name: string;
  picture: string;
}

export type UserInfo = {
  oauth_id: string;
  oauth_provider: string;
  email: string;
  name: string;
  profile_url: string;
};

export interface RequestWithUser extends Request {
  user: User;
}
