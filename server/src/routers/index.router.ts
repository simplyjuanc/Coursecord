import { Router } from 'express';
import UserRouter from './user';
import OrganisationRouter from './organisation';
import RoleRouter from './role';
import CourseRouter from './course';
import CourseSectionRouter from './courseSection';
import CourseUnitRouter from './courseUnit';


const router = Router();

router.use(UserRouter);
router.use(OrganisationRouter);
router.use(RoleRouter);
router.use(CourseRouter);
router.use(CourseSectionRouter);
router.use(CourseUnitRouter);


export default router;
