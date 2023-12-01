import { Section, SessionWithToken, Unit } from '@/types';

const baseUrl = process.env.API_URL || 'http://localhost:5000';

export async function getCourseUsers(
  courseId: string,
  /* orgId: string, (constant for now)*/ session: SessionWithToken
) {
  try {
    //gets all members of an organisation and includes the instructors and students a specific course
  } catch (error) {
    console.log(error);
  }
}

export async function assignRoleToUser(
  userId: string,
  roleId: string,
  session: SessionWithToken
) {
  try {
    //assigns a role to a user
  } catch (error) {
    console.log(error);
  }
}

export async function removeRoleFromUser(
  userId: string,
  roleId: string,
  session: SessionWithToken
) {
  try {
    //removes a role from a user
  } catch (error) {
    console.log(error);
  }
}

export async function setUserRoles(
  userId: string,
  roles: string[],
  session: SessionWithToken
) {
  try {
    //sets the roles for a user
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(userId: string, session: SessionWithToken) {
  try {
    //deletes a user
  } catch (error) {
    console.log(error);
  }
}

export async function getCourseWithRoles(
  courseId: string,
  session: SessionWithToken
) {
  try {
    //gets a course and includes the instructors, students and the roles for the organisation
  } catch (error) {
    console.log(error);
  }
}

export async function getStudentsByCourse(
  courseId: string,
  session: SessionWithToken
) {
  try {
    //gets all students for a course
  } catch (error) {
    console.log(error);
  }
}

export async function getInstructorsByCourse(
  courseId: string,
  session: SessionWithToken
) {
  try {
    //gets all instructors for a course
  } catch (error) {
    console.log(error);
  }
}

export async function editSection(
  sectionId: string,
  newContent: Partial<Section>,
  session: SessionWithToken
) {
  try {
    //edits a section
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSection(
  sectionId: string,
  session: SessionWithToken
) {
  try {
    //deletes a section
  } catch (error) {
    console.log(error);
  }
}

export async function editUnit(
  unitId: string,
  newContent: Partial<Unit>,
  session: SessionWithToken
) {
  try {
    //edits a unit
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUnit(
  unitId: string,
  session: SessionWithToken
) {
  try {
    //deletes a unit
  } catch (error) {
    console.log(error);
  }
}

export async function getCourses(
  courseId: string,
  session: SessionWithToken
) {
  try {
    //gets a course
  } catch (error) {
    console.log(error);
  }
}

export async function getUserData(
  userId: string,
  session: SessionWithToken
) {
  try {
    //gets a user
  } catch (error) {
    console.log(error);
  }
}

export async function getCourseData(
  courseId: string,
  session: SessionWithToken
) {
  try {
    //gets a course
  } catch (error) {
    console.log(error);
  }
}
