export const mockCourse = {
  id: '1',
  title: 'Introduction to Computer Science',
  description:
    'An introductory course covering the basics of computer science.',
  organisation_id: '1',
};

export const mockCourse2 = {
  id: '201',
  title: 'Introduction to Programming',
  description: 'A beginner-friendly course on programming',
  organisation_id: '1',
};

export const mockOrganisation = {
  id: '1',
  name: 'Example University',
  owner_id: '101',
};

export const mockUser = {
  id: '101',
  name: 'John Doe',
  email: 'john.doe@example.com',
  oauth_id: 'oauth123',
  oauth_provider: 'google',
  image: 'https://example.com/john_doe.jpg',
};

export const mockCourseSection = {
  id: '301',
  title: 'Getting Started with Programming',
  course_id: '201',
};
export const mockCourseUnit = {
  id: '401',
  title: 'Variables and Data Types',
  type: 'lecture',
  markdown_body: 'This is the content of the lecture',
  organisation_id: '1',
};
export const mockHelpRequest = {
  id: '501',
  course_id: '201',
  instructor_id: '101',
  status: 'WAITING',
  content: 'I need help with the first assignment',
};
