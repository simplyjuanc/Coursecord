import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { GoogleUser, RequestWithUser } from '../@types/types';
import User from '../models/user';
import { User as TUser } from '@prisma/client';
import {
  adminUser,
  instructorUser,
  plebUser,
  studentUser,
} from '../mocks/initialDbMocks';

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('AUTH MIDDLEWARE: Env:', process.env.NODE_ENV);
    const bypassUser = await bypassAuth(req);
    if (bypassUser) {
      (req as RequestWithUser).user = bypassUser;
      return next();
    }

    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.status(401).send({ message: 'No access token found' });
    }

    const googleUser = await getGoogleUser(accessToken);
    if (!googleUser) {
      return res.status(401).send({ message: 'No Google user found' });
    }

    const user = await User.getUserByEmail(googleUser.email);
    if (!user) {
      return res.status(404).send({ message: 'No user email found' });
    }

    (req as RequestWithUser).user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send('Authorisation Error');
  }
}

async function getGoogleUser(
  accessToken: string
): Promise<GoogleUser | undefined> {
  const response = await axios.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (response.status !== 200) return;

  return response.data;
}

async function bypassAuth(req: Request) {
  if (!(process.env.NODE_ENV === 'test' && req.headers['x-test-user'])) {
    return null;
  }
  let user: TUser;

  switch (req.headers['x-test-user']) {
    case 'admin':
      user = adminUser;
    case 'instructor':
      user = instructorUser;
    case 'student':
      user = studentUser;
    case 'pleb':
      user = plebUser;
    default:
      user = plebUser;
  }

  return user;
}

export default { requireAuth, getGoogleUser };
