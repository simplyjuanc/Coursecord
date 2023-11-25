import { Request, Response } from 'express';
import Organisation from '../models/organisation';
import Course from '../models/course';

async function addOrganisation(req: Request, res: Response) {
  try {
    const { name } = req.body;

    const existingOrg = await Organisation.getOrganisationByName(name);
    if (existingOrg) {
      return res.status(409).send({ message: 'Organisation name exists' });
    }

    const ownerId = 'placeholder'; //placeholder before oauth
    const newOrg = await Organisation.createOrganisation(name, ownerId);

    res.status(201).send(newOrg);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getOrganisations(req: Request, res: Response) {
  try {
    const orgs = await Organisation.getOrganisations();
    res.status(200).send(orgs);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function getOrganisationById(req: Request, res: Response) {
  try {
    const { orgId } = req.params;
    const org = await Organisation.getOrganisationById(orgId);
    res.status(200).send(org);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function editOrganisation(req: Request, res: Response) {
  try {
    const { orgId } = req.params;
    const newData = req.body;
    const updatedOrg = await Organisation.editOrganisation(orgId, newData);
    res.status(200).send(updatedOrg);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function deleteOrganisation(req: Request, res: Response) {
  try {
    const { orgId } = req.params;
    await Course.deleteCoursesInOrganisation(orgId);
    const deletedOrg = await Organisation.deleteOrganisation(orgId);
    res.status(204).send(deletedOrg);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default {
  addOrganisation,
  getOrganisations,
  getOrganisationById,
  editOrganisation,
  deleteOrganisation,
};
