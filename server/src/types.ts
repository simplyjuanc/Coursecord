export type Course = {
  id: string;
  title: string;
  description: string;
  instructorss: string[];
  students: string[];
  syllabus: string[];
};

export type Organisation = {
  id: string;
  name: string;
  owner: string;
  courses: string[];
  members: string[];
  roles: string[];
}