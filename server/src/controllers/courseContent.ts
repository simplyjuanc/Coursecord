import { Request, Response } from 'express';

async function addContentToOrganisation(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function addContentToUnit(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function removeContentFromUnit(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function deleteContent(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function editContent(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error)
    res.status(500).send({message: 'Internal Server Error'})
  }
}

export default {
  addContentToOrganisation,
  addContentToUnit,
  removeContentFromUnit,
  deleteContent,
  editContent
};
