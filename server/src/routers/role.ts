import { Router } from 'express';
import Role from '../controllers/role';


const router = Router();

//role router
router.get('/org/:orgId', Role.getRolesByOrg);
router.get('/user/:userId', Role.getRolesByUser);

//Not part of MVP
router.post('/:orgId', Role.addRole);
router.delete('/:roleId', Role.removeRole);
router.put('/:roleId', Role.editRole);


export default router;