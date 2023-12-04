import { Router } from 'express';
import Course from '../controllers/course';
import Auth from '../middlewares/auth';


const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);


//TODO: add client side functionality for this
router.get('/', Course.getCourses);

authRouter.post('/:orgId', Course.addCourse);
authRouter.put('/:courseId', Course.editCourse);
authRouter.delete('/:courseId', Course.deleteCourse);

authRouter.get('/:courseId/management', Course.getCourseManagementInfo);
router.get('/course', Course.getCourses);
router.get('/:courseId', Course.getCourseById);

authRouter.put('/:courseId/instructor/:userId', Course.addInstructorToCourse);
authRouter.put('/:courseId/student/:userId', Course.addStudentToCourse);
authRouter.delete('/:courseId/instructor/:userId', Course.removeInstructorFromCourse);
authRouter.delete('/:courseId/student/:userId', Course.removeStudentFromCourse);

export default router;
