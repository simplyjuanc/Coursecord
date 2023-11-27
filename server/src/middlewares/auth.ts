import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { RequestWithUser } from '../types';

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.status(401).send({ message: 'Unauthorised' });
    }

    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.status !== 200) {
      return res.status(401).send({ message: 'Unauthorised' });
    }

    (req as RequestWithUser).user = response.data;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send('Authorisation Error');
  }
}
