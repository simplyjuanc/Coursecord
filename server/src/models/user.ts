import { UserInfo } from '../types';
import { User } from './index';

async function getUserByEmail(email: string) {
  const user = await User.findUnique({ where: { email } });
  return user;
}

async function createUser(userInfo: UserInfo) {
  const newUser = await User.create({
    data: userInfo,
  });
  return newUser;
}

async function updateUser(userInfo: UserInfo) {
  const updatedUser = await User.update({
    where: { email: userInfo.email },
    data: {
      ...userInfo,
    },
  });

  return updatedUser;
}

export default { getUserByEmail, createUser, updateUser };
