import { Request, Response } from 'express';
import Role from '../models/role';
// import { Role } from '../models';


async function getRolesByOrg(req: Request, res: Response) {
  try {
    const orgId = req.params.orgId;
    const roles = await Role.getRolesByOrg(orgId); // TODO: Get roles only for organisation
    if (!roles) {
      return res.status(404).send({ message: 'Roles not found' });
    }
    res.status(200).send(roles);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getRolesByUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const roles = await Role.getRolesByUser(userId);
    console.log(roles);
    res.status(200).send(roles);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

//This is not part of the MVP
async function addRole(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function removeRole(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function editRole(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}
//until here



export default { getRolesByOrg , addRole, removeRole, editRole, getRolesByUser };
