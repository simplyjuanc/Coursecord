import { Router } from 'express';
import UserRouter from './user';
import OrganisationRouter from './organisation';
import CourseRouter from './course';
import CourseSectionRouter from './courseSection';
import CourseUnitRouter from './courseUnit';


const router = Router();

router.use('/user', UserRouter);
router.use('/org', OrganisationRouter);
router.use('/course', CourseRouter);
router.use('/section', CourseSectionRouter);
router.use('/unit', CourseUnitRouter);

export default router;
