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

router.post('/signIn', User.signIn);
router.get('/:orgId/users', User.getUsersByOrg);
router.put('/user/:userId/:roleId', Auth.requireAuth, User.assignRoleToUser);
router.delete(
  '/user/:userId/:roleId',
  Auth.requireAuth,
  User.removeRoleFromUser
);
router.delete('/user/:userId', Auth.requireAuth, User.deleteUser);
router.get('/student/course/:userId', Course.getCoursesWithStudent);
router.get('/instructor/course/:userId', Course.getCoursesWithInstructor);

// router.get('/:orgId/instructors', User.getInstructorsByOrg);
router.get('/:courseId/instructors', User.getInstructorsByCourse);
router.get('/:courseId/students', User.getStudentsByCourse);
// router.get('/:orgId/students', User.getStudentsByOrg);

router.post('/:courseId/section', Auth.requireAuth, Section.addSection);
router.put('/section/:sectionId', Auth.requireAuth, Section.editSection);
router.delete('/section/:sectionId', Auth.requireAuth, Section.deleteSection);
router.get('/syllabus/:courseId/', Section.getSectionsByCourse);

router.post('/unit/:orgId/:sectionId', Auth.requireAuth, Unit.addCourseUnit);
router.put(
  '/unit/:sectionId/:unitId',
  Auth.requireAuth,
  Unit.addUnitToSection
);
router.put('/unit/:unitId', Auth.requireAuth, Unit.editContent);
router.delete(
  '/unit/:sectionId/:unitId',
  Auth.requireAuth,
  Unit.removeUnitFromSection
);
router.delete('/unit/:unitId', Auth.requireAuth, Unit.deleteContent);
router.get('section/units/:sectionId', Unit.getUnitsBySection)


//Not part of MVP
router.get('/user/role/:userId', Role.getRolesByUser);
router.post('/:orgId/role', Role.addRole);
router.delete('/role/:roleId', Role.removeRole);
router.put('/role/:roleId', Role.editRole);


export default router;
