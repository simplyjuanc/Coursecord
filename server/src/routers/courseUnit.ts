import { Router } from 'express';
import Auth from '../middlewares/auth';
import Unit from '../controllers/courseUnit';

const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);

authRouter.post('/org/:orgId/:sectionId', Unit.addCourseUnit);
authRouter.put('/:unitId', Unit.editUnit);
authRouter.delete('/:unitId', Unit.deleteUnit);

authRouter.delete('/:sectionId/:unitId', Unit.removeUnitFromSection); //TODO: add client side functionality for this
authRouter.put('/section/:sectionId/:unitId', Unit.addUnitToSection); //^^^

authRouter.get('/:courseId/:unitId', Unit.getUnit);


export default router;