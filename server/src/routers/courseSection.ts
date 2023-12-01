import { Router } from 'express';
import Section from '../controllers/courseSection';
import Auth from '../middlewares/auth';


const router = Router();

router.post('/:courseId/section', Auth.requireAuth, Section.addSection);
router.put('/section/:sectionId', Auth.requireAuth, Section.editSection);
router.delete('/section/:sectionId', Auth.requireAuth, Section.deleteSection);
router.get('/syllabus/:courseId/', Section.getSectionsByCourse);


export default router;
