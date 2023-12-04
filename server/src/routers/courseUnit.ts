import { Router } from 'express';
import Auth from '../middlewares/auth';
import Unit from '../controllers/courseUnit';

const router = Router();


authRouter.post('/org/:orgId/:sectionId', Unit.addCourseUnit);
authRouter.put('/section/:sectionId/:unitId', Unit.addUnitToSection);
authRouter.put('/:unitId', Unit.editUnit);
authRouter.delete('/:unitId', Unit.deleteUnit);

authRouter.delete('/:sectionId/:unitId', Unit.removeUnitFromSection); //TODO: add client side functionality for this

router.get('/:unitId', Unit.getUnit); //SHOULD PROBABLY BE PROTECTED


export default router;