import { Request, Response } from 'express';
import Role from '../models/role';

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

async function getRolesByUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const roles = await Role.getRolesByUser(userId);
    res.status(200).send(roles);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default { addRole, removeRole, editRole, getRolesByUser };
