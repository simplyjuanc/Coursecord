import UserModel from "../models/user";
import RoleModel from "../models/role";
import Auth from "../middlewares/auth";
import { NextFunction } from 'connect';
import { SocketWithUser } from "../../@types/types";

export async function AuthSocket(socket: SocketWithUser, next: NextFunction) {
  try {
    const accessToken: string = socket.handshake.auth.accessToken;
    if (!accessToken) next(new Error("Unauthorised"));

    const googleUser = await Auth.getGoogleUser(accessToken);
    if (!googleUser) throw new Error("Missing Google Auth user data");
    
    const user = await UserModel.getUserByEmail(googleUser.email);
    if (!user) throw new Error("User not found");
    
    const roles = await RoleModel.getUserOrgRoles(user.id, '656b40666c0ea5f66060c942'); // TODO: get org id from socket
    socket.user = user 
    socket.roles = roles
    
    next();
  } catch (error) {
    console.error(error);
    next(new Error("Authorisation Error"));
  }
}
