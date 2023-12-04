import { Router } from 'express';
import Section from '../controllers/courseSection';
import Auth from '../middlewares/auth';

const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);

authRouter.post('/:courseId', Section.addSection);
authRouter.put('/:sectionId', Section.editSection);
authRouter.delete('/:sectionId', Section.deleteSection);

router.get('/syllabus/:courseId/', Section.getCourseSyllabus);

export default router;
