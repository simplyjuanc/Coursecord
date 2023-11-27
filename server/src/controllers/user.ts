import { Request, Response } from 'express';
import User from '../models/user';
import Auth from '../middlewares/auth';
import { RequestWithUser } from '../types';
import Organisation from '../models/organisation';
import Role from '../models/role';

async function signIn(req: Request, res: Response) {
  try {
    const { oauth_id, oauth_provider } = req.body;
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).send('Unauthorised');
    }
    const user = await Auth.getGoogleUser(accessToken);
    if (!user) {
      return res.status(401).send('Unauthorised');
    }

    const userInfo = {
      email: user.email,
      name: user.name,
      profile_url: user.picture,
      oauth_id,
      oauth_provider,
    };

    const existingUser = await User.getUserByEmail(userInfo.email);
    if (existingUser && existingUser.oauth_provider !== oauth_provider) {
      return res
        .status(409)
        .send({ message: 'User account exists with a different provider' });
    }

    if (existingUser) {
      const updatedUser = await User.updateUser(userInfo);
      return res.status(200).send(updatedUser);
    }

    const newUser = await User.createUser(userInfo);
    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getUsersByOrg(req: Request, res: Response) {
  try {
    const { orgId } = req.params;
    const users = await User.getUsersByOrg(orgId);
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getInstructorsByOrg(req: Request, res: Response) {
  try {
    const { orgId } = req.params;
    const instructors = await User.getUsersWithRoleByOrg(orgId, 'Instructor');
    res.status(200).send(instructors);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getInstructorsByCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const instructors = await User.getInstructorsByCourse(courseId);
    res.status(200).send(instructors);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getStudentsByOrg(req: Request, res: Response) {
  try {
    const { orgId } = req.params;
    const students = await User.getUsersWithRoleByOrg(orgId, 'Student');
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getStudentsByCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const students = await User.getStudentsByCourse(courseId);
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function assignRoleToUser(req: Request, res: Response) {
  try {
    const { userId, roleId } = req.params;
    const org = await Organisation.getOrganisationWithRole(roleId);
    if (!org) {
      return res.status(401).send({ message: 'Invalid Role' });
    }
    const userRoles = (req as RequestWithUser).user.roles;
    if (!(await Role.userRolesIncludeAdmin(userRoles, org.id))) {
      return res.status(401).send({ message: 'Unauthorised' });
    }

    const updatedUser = await User.addRoleToUser(userId, roleId);
    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function removeRoleFromUser(req: Request, res: Response) {
  try {
    const { userId, roleId } = req.params;
    const org = await Organisation.getOrganisationWithRole(roleId);
    if (!org) {
      return res.status(401).send({ message: 'Invalid Role' });
    }
    const userRoles = (req as RequestWithUser).user.roles;
    if (!(await Role.userRolesIncludeAdmin(userRoles, org.id))) {
      return res.status(401).send({ message: 'Unauthorised' });
    }

    const updatedUser = await User.removeRoleFromUser(userId, roleId);
    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function deleteUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const authUserId = (req as RequestWithUser).user.id;
    if (userId != authUserId) {
      return res.status(401).send(authUserId);
    }

    const deletedUser = await User.deleteUser(userId)
    res.status(204).send(deletedUser)
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default {
  signIn,
  getUsersByOrg,
  getInstructorsByOrg,
  getInstructorsByCourse,
  getStudentsByOrg,
  getStudentsByCourse,
  assignRoleToUser,
  removeRoleFromUser,
  deleteUser,
};
