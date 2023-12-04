import { Router } from 'express';
import Auth from '../middlewares/auth';
import Organisation from '../controllers/organisation';

const router = Router();


authRouter.post('/add', Organisation.addOrganisation);
authRouter.put('/:orgId', Organisation.editOrganisation);
authRouter.delete('/:orgId', Organisation.deleteOrganisation);
authRouter.put('/:orgId/admin/:userId', Organisation.addAdminToOrganisation);
authRouter.delete(
  '/:orgId/admin/:userId',
  Organisation.removeAdminFromOrganisation
);
authRouter.get('/:orgId/management', Organisation.getOrgManagementInfo);

router.get('/get', Organisation.getOrganisations);

export default router;