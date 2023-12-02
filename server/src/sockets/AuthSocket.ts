import { Socket } from "socket.io";
import User from "../models/user";
import Auth from "../middlewares/auth";
import { SocketWithUser } from "../../@types/types";
import { NextFunction } from 'connect';

export async function AuthSocket(socket: Socket, next: NextFunction) {
  try {
    const accessToken: string = socket.handshake.auth.accessToken;
    if (!accessToken) next(new Error("Unauthorised"));

    const googleUser = await Auth.getGoogleUser(accessToken);
    if (!googleUser) throw new Error("Missing Google Auth user data");

    const user = await User.getUserByEmail(googleUser.email);
    if (!user) throw new Error("User not found");

    (socket as SocketWithUser).user = user;
    next();
  } catch (error) {
    console.error(error);
    next(new Error("Authorisation Error"));
  }
}
