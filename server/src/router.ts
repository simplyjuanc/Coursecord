import { Router } from 'express';
import Organisation from './controllers/organisation';
import Course from './controllers/course';
import User from './controllers/user';
import Role from './controllers/role';
import Section from './controllers/courseSection';
import Unit from './controllers/courseUnit';
import Auth from './middlewares/auth';

const router = Router();

router.post('/organisation', Auth.requireAuth, Organisation.addOrganisation);
router.get('/organisation', Organisation.getOrganisations);
router.get('/organisation/:orgId', Organisation.getOrganisationById);
router.put(
  '/organisation/:orgId',
  Auth.requireAuth,
  Organisation.editOrganisation
);
router.delete(
  '/organisation/:orgId',
  Auth.requireAuth,
  Organisation.deleteOrganisation
);

router.get('/course', Course.getCourses);
router.post('/:orgId/course', Auth.requireAuth, Course.addCourse);
router.get('/:orgId/course', Course.getCoursesByOrganisation);
router.get('/course/:courseId', Course.getCourseById);
router.put('/course/:courseId', Auth.requireAuth, Course.editCourse);
router.delete(
  '/course/:orgId/:courseId',
  Auth.requireAuth,
  Course.deleteCourse
);

//everything below here has an empty controller currently;
//I decided to scaffold it to get a general Idea of what
//functionality we needed to add
router.post('/signIn', User.signIn);
router.get('/:orgId/users', User.getUsersByOrg);
router.get('/:orgId/instructors', User.getInstructorsByOrg);
router.get('/:orgId/students', User.getStudentsByOrg);
router.get('/:courseId/instructors', User.getInstructorsByCourse);
router.get('/:courseId/students', User.getStudentsByOrg);
router.put('/user/:userId/:roleId', Auth.requireAuth, User.assignRoleToUser);
router.delete(
  '/user/:userId/:roleId',
  Auth.requireAuth,
  User.removeRoleFromUser
);
router.delete('/user/:userId', Auth.requireAuth, User.deleteUser);

router.post('/:courseId/section', Auth.requireAuth, Section.addSection);
router.put('/section/:sectionId', Auth.requireAuth, Section.editSection);
router.delete('/section/:sectionId', Auth.requireAuth, Section.deleteSection);

router.post('/content/:orgId/:sectionId', Auth.requireAuth, Unit.addCourseUnit);
router.put(
  '/content/:sectionId/:unitId',
  Auth.requireAuth,
  Unit.addUnitToSection
);
router.put('/content/:contentId', Auth.requireAuth, Unit.editContent);
router.delete(
  '/content/:sectionId/:unitId',
  Auth.requireAuth,
  Unit.removeUnitFromSection
);
router.delete('/content/:contentId', Auth.requireAuth, Unit.deleteContent);

//Not part of MVP
router.post('/:orgId/role', Role.addRole);
router.delete('/role/:roleId', Role.removeRole);
router.put('/role/:roleId', Role.editRole);

export default router;
