import { Router } from 'express';
import Course from '../controllers/course';
import Auth from '../middlewares/auth';

const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);

authRouter.post('/:orgId/course', Course.addCourse);
authRouter.put('/course/:courseId', Course.editCourse);
authRouter.delete('/course/:orgId/:courseId', Course.deleteCourse);

router.get('/course', Course.getCourses);
router.get('/:orgId/course', Course.getCoursesByOrganisation);
router.get('/course/:courseId', Course.getCourseById);

export default router;
