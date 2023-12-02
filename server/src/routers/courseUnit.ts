import { Router } from 'express';
import Auth from '../middlewares/auth';
import Unit from '../controllers/courseUnit';

const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);

authRouter.post('/org/:orgId/:sectionId', Unit.addCourseUnit);
authRouter.put('/section/:sectionId/:unitId', Unit.addUnitToSection);
authRouter.put('/:unitId', Unit.editContent);
authRouter.delete('/:sectionId/:unitId', Unit.removeUnitFromSection);
authRouter.delete('/:unitId', Unit.deleteContent);
router.get('/:unitId', Unit.getUnit);

router.get('/section/:sectionId', Unit.getUnitsBySection);

export default router;