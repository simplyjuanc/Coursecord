export const adminUser = {
  id: '5f5b4a1b7b136f00f63385b7',
  email: 'adminUser@gmail.com',
  name: 'Admin test user',
  image: 'testpicture',
  oauth_id: 'testoauthid',
  oauth_provider: 'google',
};

export const studentUser = {
  id: '5f5b4a347b136f00f63385b9',
  email: 'studentUser@gmail.com',
  name: 'Student test user',
  image: 'testpicture',
  oauth_id: 'testoauthid',
  oauth_provider: 'google',
};

export const instructorUser = {
  id: '5f5b4a4c7b136f00f63385bb',
  email: 'instructorUser@gmail.com',
  name: 'Instructor test user',
  image: 'testpicture',
  oauth_id: 'testoauthid',
  oauth_provider: 'google',
};

//has no permission therefore pleb
export const plebUser = {
  id: '5f5b4a5e7b136f00f63385bd',
  email: 'plebUser@gmail.com',
  name: 'Pleb test user',
  image: 'testpicture',
  oauth_id: 'testoauthid',
  oauth_provider: 'google',
};

export const adminUserOrg = {
  id: '5f5b4a297b136f00f63385b8',
  name: 'Test Org1',
  owner_id: adminUser.id,
};

export const course1 = {
  id: '5f5b4a587b136f00f63385bc',
  title: 'Test Course1',
  description: 'Test Course1 description',
  organisation_id: adminUserOrg.id,
};

export const units = [
  {
    id: '5f5b4a647b136f00f63385bd',
    title: 'Introduction to Programming',
    type: 'Core',
    markdown_body: '',
    organisation_id: '5f5b4a297b136f00f63385b8',
  },
  {
    id: '5f5b4a6f7b136f00f63385be',
    title: 'Data Structures and Algorithms',
    type: 'Elective',
    markdown_body: '',
    organisation_id: '5f5b4a297b136f00f63385b8',
  },
  {
    id: '5f5b4a7b7b136f00f63385bf',
    title: 'Web Development Basics',
    type: 'Core',
    markdown_body: '',
    organisation_id: '5f5b4a297b136f00f63385b8',
  },
  {
    id: '5f5b4a867b136f00f63385c0',
    title: 'Database Design Fundamentals',
    type: 'Elective',
    markdown_body: '',
    organisation_id: '5f5b4a297b136f00f63385b8',
  },
  {
    id: '5f5b4a927b136f00f63385c1',
    title: 'Software Engineering Principles',
    type: 'Core',
    markdown_body: '',
    organisation_id: '5f5b4a297b136f00f63385b8',
  },
  {
    id: '5f5b4a9d7b136f00f63385c2',
    title: 'Advanced Algorithms',
    type: 'Elective',
    markdown_body: '',
    organisation_id: '5f5b4a297b136f00f63385b8',
  },
  {
    id: '5f5b4aa87b136f00f63385c3',
    title: 'Mobile App Development',
    type: 'Core',
    markdown_body: '',
    organisation_id: '5f5b4a297b136f00f63385b8',
  },
  {
    id: '5f5b4ab47b136f00f63385c4',
    title: 'Machine Learning Basics',
    type: 'Elective',
    markdown_body: '',
    organisation_id: '5f5b4a297b136f00f63385b8',
  },
  {
    id: '5f5b4abf7b136f00f63385c5',
    title: 'Network Security',
    type: 'Core',
    markdown_body: '',
    organisation_id: '5f5b4a297b136f00f63385b8',
  },
  {
    id: '5f5b4ac97b136f00f63385c6',
    title: 'Cloud Computing Fundamentals',
    type: 'Elective',
    markdown_body: '',
    organisation_id: '5f5b4a297b136f00f63385b8',
  },
];

export const sections = [
  {
    id: '5f5b4ad57b136f00f63385c8',
    title: 'Introduction to Programming Concepts',
    // course_id: '5f5b4a587b136f00f63385bc',
  },
  {
    id: '5f5b4ae07b136f00f63385ca',
    title: 'Advanced Web Development',
    // course_id: '5f5b4a587b136f00f63385bc',
  },
  {
    id: '5f5b4aec7b136f00f63385cc',
    title: 'Database Management Systems',
    // course_id: '5f5b4a587b136f00f63385bc',
  },
  {
    id: '5f5b4af77b136f00f63385ce',
    title: 'Software Design Patterns',
    // course_id: '5f5b4a587b136f00f63385bc',
  },
];
