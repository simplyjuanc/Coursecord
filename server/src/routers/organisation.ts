import { Router } from 'express';
import Auth from '../middlewares/auth';
import Organisation from '../controllers/organisation';

const router = Router();
const authRouter = Router();

router.use('/auth', Auth.requireAuth, authRouter);

authRouter.post('/add', Organisation.addOrganisation);
authRouter.put('/:orgId', Organisation.editOrganisation);
authRouter.delete('/:orgId', Organisation.deleteOrganisation);

//USED BY CLIENT
authRouter.get('/:orgId/management', Organisation.getOrgManagementInfo);
//TILL HERE

router.get('/get', Organisation.getOrganisations);
router.get('/:orgId', Organisation.getOrganisationById);

export default router;
