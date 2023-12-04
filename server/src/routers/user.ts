import { Router } from 'express';
import User from '../controllers/user';
import Course from '../controllers/course';
import Auth from '../middlewares/auth';


const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);

//MAY CHANGE
authRouter.put('/:userId/:roleId', User.assignRoleToUser);
authRouter.delete('/:userId/:roleId', User.removeRoleFromUser);
authRouter.delete('/:userId', User.deleteUser);
authRouter.get('/:userId/courses', User.getUserCourses);

router.post('/signIn', User.signIn);
router.get('/:orgId/users', User.getUsersByOrg); //CAN DEFINITELY BE DELETED
router.get('/student/course/:userId', Course.getCoursesWithStudent); //PROBABLY CAN BE DELETED
router.get('/instructor/course/:userId', Course.getCoursesWithInstructor); //PROBABLY CAN BE DELETED
router.get('/:courseId/instructors', User.getInstructorsByCourse); //PROBABLY CAN BE DELETED
router.get('/:courseId/students', User.getStudentsByCourse); //PROBABLY CAN BE DELETED

export default router;