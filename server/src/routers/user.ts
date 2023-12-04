import { Router } from 'express';
import User from '../controllers/user';
import Course from '../controllers/course';
import Auth from '../middlewares/auth';


const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);

authRouter.delete('/:userId', User.deleteUser);
authRouter.get('/:userId/courses', User.getUserCourses);
authRouter.get('/:courseOrOrgId/:isOrg', User.getUserRoles);

router.post('/signIn', User.signIn);
router.get('/users', User.getUsers);

export default router;