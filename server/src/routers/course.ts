import { Router } from 'express';
import Course from '../controllers/course';
import Auth from '../middlewares/auth';

const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);

authRouter.post('/:orgId', Course.addCourse);
authRouter.put('/:courseId', Course.editCourse);
authRouter.delete('/:orgId/:courseId', Course.deleteCourse);

//USED BY CLIENT
authRouter.get('/:courseId/management', Course.getCourseManagementInfo);
router.get('/course', Course.getCourses);
router.get('/:courseId', Course.getCourseById);
//TILL HERE

router.get('/:orgId/course', Course.getCoursesByOrganisation); //CAN DEFINITELY BE DELETED

export default router;
