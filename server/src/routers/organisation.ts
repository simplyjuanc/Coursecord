import { Router } from 'express';
import Auth from '../middlewares/auth';
import Organisation from '../controllers/organisation';

const router = Router();


router.post('/organisation', Auth.requireAuth, Organisation.addOrganisation);
router.get('/organisation', Organisation.getOrganisations);
router.get('/organisation/:orgId', Organisation.getOrganisationById);
router.put('/organisation/:orgId', Auth.requireAuth, Organisation.editOrganisation);
router.delete('/organisation/:orgId', Auth.requireAuth, Organisation.deleteOrganisation);


export default router;