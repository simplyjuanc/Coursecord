import { Router } from 'express';
import Course from '../controllers/course';
import Auth from '../middlewares/auth';


const router = Router();
router.get('/course', Course.getCourses);
router.post('/:orgId/course', Auth.requireAuth, Course.addCourse);
router.get('/:orgId/course', Course.getCoursesByOrganisation);
router.get('/course/:courseId', Course.getCourseById);
router.put('/course/:courseId', Auth.requireAuth, Course.editCourse);
router.delete('/course/:orgId/:courseId', Auth.requireAuth, Course.deleteCourse);


export default router;