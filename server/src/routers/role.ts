import { Router } from 'express';
import Role from '../controllers/role';


const router = Router();

//role router
router.get('/:orgId/roles', Role.getRolesByOrg);
router.get('/user/role/:userId', Role.getRolesByUser);


//Not part of MVP
router.post('/:orgId/role', Role.addRole);
router.delete('/role/:roleId', Role.removeRole);
router.put('/role/:roleId', Role.editRole);


export default router;