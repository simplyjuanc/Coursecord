//This whole file is not part of the MVP

import { Request, Response } from 'express';

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

export default { addRole, removeRole, editRole };
