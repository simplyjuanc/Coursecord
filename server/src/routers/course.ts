import { Router } from 'express';
import Course from '../controllers/course';
import Auth from '../middlewares/auth';

const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);


router.get('/', Course.getCourses);
authRouter.post('/:orgId', Course.addCourse);
authRouter.put('/:courseId', Course.editCourse);
authRouter.delete(':orgId/:courseId', Course.deleteCourse);

router.get('/:orgId/course', Course.getCoursesByOrganisation);
router.get('/:courseId', Course.getCourseById);

export default router;
