import { Router } from 'express';
import Auth from '../middlewares/auth';
import Unit from '../controllers/courseUnit';

const router = Router();


router.post('/unit/org/:orgId/:sectionId', Auth.requireAuth, Unit.addCourseUnit);
router.put('/unit/section/:sectionId/:unitId', Auth.requireAuth, Unit.addUnitToSection);
router.put('/unit/:unitId', Auth.requireAuth, Unit.editContent);
router.delete('/unit/:sectionId/:unitId', Auth.requireAuth,Unit.removeUnitFromSection);
router.delete('/unit/:unitId', Auth.requireAuth, Unit.deleteContent);
router.get('/section/units/:sectionId', Unit.getUnitsBySection);


export default router;