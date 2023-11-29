//This whole file is not part of the MVP

import { Request, Response } from 'express';
import { Role } from '../models';


async function getRoles(req: Request, res: Response) {
  try {
    const roles = await Role.findMany(); // TODO: Get roles only for organisation
    if (!roles) {
      return res.status(404).send({ message: 'Roles not found' });
    }
    res.status(200).send(roles);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

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

export default {getRoles, addRole, removeRole, editRole };
