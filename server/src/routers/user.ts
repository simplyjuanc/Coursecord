import { Router } from 'express';
import User from '../controllers/user';
import Course from '../controllers/course';
import Auth from '../middlewares/auth';


const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);

authRouter.put('/:userId/:roleId', User.assignRoleToUser);
authRouter.delete('/:userId/:roleId', User.removeRoleFromUser);
authRouter.delete('/:userId', User.deleteUser);
authRouter.get('/:userId/courses', User.getUserCourses);

router.post('/signIn', User.signIn);
router.get('/:orgId/users', User.getUsersByOrg);
router.get('/student/course/:userId', Course.getCoursesWithStudent);
router.get('/instructor/course/:userId', Course.getCoursesWithInstructor);
router.get('/:courseId/instructors', User.getInstructorsByCourse);
router.get('/:courseId/students', User.getStudentsByCourse);

export default router;