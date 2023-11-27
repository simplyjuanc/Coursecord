import { Request, Response } from 'express';
import Organisation from '../models/organisation';
import Course from '../models/course';
import { RequestWithUser } from '../types';
import User from '../models/user';

async function addOrganisation(req: Request, res: Response) {
  try {
    const { name } = req.body;

    const existingOrg = await Organisation.getOrganisationByName(name);
    if (existingOrg) {
      return res.status(409).send({ message: 'Organisation name exists' });
    }

    const ownerId = (req as RequestWithUser).user.id;
    const newOrg = await Organisation.createOrganisation(name, ownerId);

    await User.addOrgToUser(ownerId, newOrg.id);
    await User.assignRoleToUser(ownerId, newOrg.roles[0]);

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

    const userId = (req as RequestWithUser).user.id;
    const updatedOrg = await Organisation.editOrganisation(orgId, newData, userId);
    //TODO: Make a more descriptive error when about unauthorised deletion
    res.status(200).send(updatedOrg);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function deleteOrganisation(req: Request, res: Response) {
  try {
    const { orgId } = req.params;

    const ownerId = (req as RequestWithUser).user.id;
    if(!await User.userIsOrgOwner(ownerId, orgId)) {
      return res.status(401).send({message: 'Unauthorised'})
    }

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
