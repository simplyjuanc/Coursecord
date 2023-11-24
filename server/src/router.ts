import {Router} from 'express';
import Organisation from './controllers/organisation'

const router = Router();

router.post('/organisation', Organisation.addOrganisation);
router.get('/organisation', Organisation.getOrganisations);

export default router;