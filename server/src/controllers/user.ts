import { Request, Response } from 'express';
import User from '../models/user';
import Auth from '../middlewares/auth';
import { RequestWithUser } from '../types';
import Organisation from '../models/organisation';
import Course from '../models/course';

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
      image: user.picture,
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
    //TEMPORARY
    await Organisation.addAdminToOrganisation(
      '656b40666c0ea5f66060c942',
      newUser.id,
    );
    await Course.addStudentToCourse('656b40a56c0ea5f66060c947', newUser.id);
    //TEMPORARY^
    res.status(201).send(newUser);

    //todo send back roles with newUser
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

async function deleteUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const reqUserId = (req as RequestWithUser).user.id;
    if (userId != reqUserId) {
      return res.status(401).send(reqUserId);
    }

    const deletedUser = await User.deleteUser(userId);
    res.status(204).send(deletedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getUserCourses(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const userWithCourses = await User.getUserCourses(userId);
    res.status(200).send(userWithCourses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default {
  signIn,
  getInstructorsByCourse,
  getStudentsByCourse,
  deleteUser,
  getUserCourses,
};
