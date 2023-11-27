import { Router } from 'express';
import Organisation from './controllers/organisation';
import Course from './controllers/course';
import User from './controllers/user';
import Role from './controllers/role';
import Section from './controllers/section';
import Content from './controllers/courseContent';
import {requireAuth} from './middlewares/auth'

const router = Router();

router.post('/organisation', Organisation.addOrganisation);
router.get('/organisation', Organisation.getOrganisations);
router.get('/organisation/:orgId', Organisation.getOrganisationById);
router.put('/organisation/:orgId', Organisation.editOrganisation);
router.delete('/organisation/:orgId', Organisation.deleteOrganisation);

router.get('/course', Course.getCourses);
router.post('/:orgId/course', Course.addCourse);
router.get('/:orgId/course', Course.getCoursesByOrganisation);
router.get('/course/:courseId', Course.getCourseById);
router.put('/course/:courseId', Course.editCourse);
router.delete('/course/:orgId/:courseId', Course.deleteCourse);

//everything below here has an empty controller currently;
//I decided to scaffold it to get a general Idea of what
//functionality we needed to add 
router.post('/signIn', requireAuth, User.signIn);
router.get('/:orgId/users', User.getUsersByOrg);
router.get('/:orgId/instructors', User.getInstructorsByOrg);
router.get('/:orgId/students', User.getStudentsByOrg);
router.get('/:courseId/instructors', User.getInstructorsByCourse);
router.get('/:courseId/students', User.getStudentsByOrg);
router.put('/user/:userId/:roleId', User.assignRoleToUser);
router.delete('/user/:userId/:roleId', User.removeRoleFromUser);
router.delete('/user/:userId', User.deleteUser);

router.post('/:courseId/section', Section.addSection);
router.put('/section/:sectionId', Section.editSection);
router.delete('/section/:sectionId', Section.deleteSection);

router.post('/content/:orgId/:sectionId', Content.addCourseUnit);
router.put('/content/:sectionId/:contentId', Content.addUnitToSection);
router.put('/content/:contentId', Content.editContent);
router.delete('/content/:sectionId/:contentId', Content.removeContentFromUnit);
router.delete('/content/:contentId', Content.deleteContent);

//Not part of MVP
router.post('/:orgId/role', Role.addRole);
router.delete('/role/:roleId', Role.removeRole);
router.put('/role/:roleId', Role.editRole);

export default router;
