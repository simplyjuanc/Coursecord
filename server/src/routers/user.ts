import { Router } from 'express';
import User from '../controllers/user';
import Course from '../controllers/course';
import Auth from '../middlewares/auth';


const router = Router();

router.post('/signIn', User.signIn);
router.get('/:orgId/users', User.getUsersByOrg);
router.put('/user/:userId/:roleId', Auth.requireAuth, User.assignRoleToUser);
router.delete('/user/:userId/:roleId', Auth.requireAuth, User.removeRoleFromUser);
router.delete('/user/:userId', Auth.requireAuth, User.deleteUser);
router.get('/student/course/:userId', Course.getCoursesWithStudent);
router.get('/instructor/course/:userId', Course.getCoursesWithInstructor);
router.get('/:courseId/instructors', User.getInstructorsByCourse);
router.get('/:courseId/students', User.getStudentsByCourse);


export default router;