import UserModel from "../models/user";
import Auth from "../middlewares/auth";
import { NextFunction } from 'connect';
import { SocketWithUser } from "../../@types/types";

export async function AuthSocket(socket: SocketWithUser, next: NextFunction) {
  try {
    console.log("Authenticating socket connection");
    
    const accessToken: string = socket.handshake.auth.accessToken;
    if (!accessToken) next(new Error("Unauthorised"));

    const googleUser = await Auth.getGoogleUser(accessToken);
    if (!googleUser) throw new Error("Missing Google Auth user data");
    
    const user = await UserModel.getUserByEmail(googleUser.email);
    if (!user) throw new Error("User not found");
    
    socket.user = user 
    socket.isCourseInstructor = await UserModel.isCourseInstructor(user.id, '') // TODO get courseId from socket
    
    next();
  } catch (error) {
    console.error(error);
    next(new Error("Authorisation Error"));
  }
}
