import { DbUser, Section, SessionWithToken, Unit } from '@/types';

const baseUrl = process.env.API_URL || 'http://localhost:5000';

export async function getSyllabus(courseId: string, session: SessionWithToken) {
  try {
    const syllabusResponse = await fetch(
      `${baseUrl}/section/syllabus/${courseId}`,
      {
        method: 'GET',
        headers: {
          Authorization: session.accessToken,
        },
      }
    );

    if (!syllabusResponse.ok) {
      console.log('Syllabus could not be retrieved');
      return undefined;
    }

    return await syllabusResponse.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getUnit(unitId: string, session: SessionWithToken) {
  try {
    const unitResponse = await fetch(`${baseUrl}/unit/${unitId}`, {
      method: 'GET',
      headers: {
        Authorization: session.accessToken,
      },
    });

    if (!unitResponse.ok) {
      console.log('Unit could not be retrieved');
      return undefined;
    }

    return await unitResponse.json();
  } catch (error) {
    console.log(error);
  }
}

export async function addUnit(
  unit: Partial<Unit>,
  sectionId: string,
  session: SessionWithToken
) {
  try {
    const unitResponse = await fetch(
      `${baseUrl}/unit/auth/org/${'656b40666c0ea5f66060c942'}/${sectionId}`,
      {
        method: 'POST',
        headers: {
          Authorization: session.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unit),
      }
    );

    return unitResponse.ok ? await unitResponse.json() : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function editUnit(unit: Unit, session: SessionWithToken) {
  try {
    console.log(session.accessToken);
    const { id, ...unitData } = unit;
    const unitResponse = await fetch(`${baseUrl}/unit/auth/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: session.accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unitData),
    });

    return unitResponse.ok;
  } catch (error) {
    console.log(error);
  }
}

export async function addSection(
  section: Partial<Section>,
  course_id: string,
  session: SessionWithToken
) {
  try {
    const sectionResponse = await fetch(
      `${baseUrl}/section/auth/${course_id}`,
      {
        method: 'POST',
        headers: {
          Authorization: session.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(section),
      }
    );

    return sectionResponse.ok ? await sectionResponse.json() : null;
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
  courseId: string
) {
  try {
    const res = await fetch(`${baseUrl}/user/${courseId}/students`);
    const data:DbUser[] = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getInstructorsByCourse(
  courseId: string,
) {
  try {
    const res = await fetch(`${baseUrl}/user/${courseId}/instructors`);
    const data:DbUser[] = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}


async function fetchHelper (url:string, cb:Function) {
   try {
     const res = await fetch(url);
     const data = await res.json();
     cb(data);
   } catch (err) {
     console.log(err)
   }
}


export async function editSection(
  sectionId: string,
  newContent: Partial<Section>,
  session: SessionWithToken
) {
  try {
    const sectionResponse = await fetch(
      `${baseUrl}/section/auth/${sectionId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: session.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContent),
      }
    );

    return sectionResponse.ok;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSection(
  sectionId: string,
  session: SessionWithToken
) {
  try {
    const sectionResponse = await fetch(
      `${baseUrl}/section/auth/${sectionId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: session.accessToken,
        },
      }
    );

    return sectionResponse.ok;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserRoles(
  courseOrOrgId: string,
  isOrg: boolean,
  session: SessionWithToken
) {
  try {
    const userResponse = await fetch(
      `${baseUrl}/user/auth/${courseOrOrgId}/${isOrg}`,
      {
        method: 'GET',
        headers: {
          Authorization: session.accessToken,
        },
      }
    );

    console.log(userResponse.status);
    if (!userResponse.ok) {
      console.log('Roles could not be retrieved');
      return [];
    }

    return await userResponse.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getCourseData(courseId: string) {
  try {
    const courseResponse = await fetch(`${baseUrl}/course/${courseId}`, {
      method: 'GET',
    });

    if (!courseResponse.ok) {
      console.log('Course could not be retrieved');
      return null;
    }

    return await courseResponse.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getLastResult<T>(promises: Promise<T>[]) {
  if (!promises.length) throw new RangeError('No last result from no promises');
  const results: T[] = [];
  await Promise.all(
    promises.map((p) =>
      p.then((v) => {
        results.push(v);
      })
    )
  );
  return results[results.length - 1];
}

export async function getOrgManagementInfo(
  orgId: string,
  session: SessionWithToken
) {
  try {
    const orgResponse = await fetch(`${baseUrl}/org/auth/${orgId}/management`, {
      method: 'GET',
      headers: {
        Authorization: session.accessToken,
      },
    });

    if (!orgResponse.ok) {
      console.log('Organisation could not be retrieved');
      return null;
    }

    return await orgResponse.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getCourseManagementInfo(
  course_id: string,
  session: SessionWithToken
) {
  try {
    const courseResponse = await fetch(
      `${baseUrl}/course/auth/${course_id}/management`,
      {
        method: 'GET',
        headers: {
          Authorization: session.accessToken,
        },
      }
    );

    if (!courseResponse.ok) {
      console.log('Course could not be retrieved');
      return null;
    }

    return await courseResponse.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUsers(): Promise<
  { id: string; name: string; email: string }[] | null
> {
  try {
    const usersResponse = await fetch(`${baseUrl}/user/users`, {
      method: 'GET',
    });

    if (!usersResponse.ok) {
      console.log('Users could not be retrieved');
      return null;
    }

    return await usersResponse.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function addUserToCourse(
  courseId: string,
  role: string,
  userId: string,
  session: SessionWithToken
) {
  try {
    const userResponse = await fetch(
      `${baseUrl}/course/auth/${courseId}/${role}/${userId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: session.accessToken,
        },
      }
    );

    return userResponse.ok;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUserFromCourse(
  courseId: string,
  role: string,
  userId: string,
  sesion: SessionWithToken
) {
  try {
    const userResponse = await fetch(
      `${baseUrl}/course/auth/${courseId}/${role}/${userId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: sesion.accessToken,
        },
      }
    );

    return userResponse.ok;
  } catch (error) {
    console.log(error);
  }
}

export async function addAdminToOrganisation(
  orgId: string,
  userId: string,
  sesion: SessionWithToken
) {
  try {
    const userResponse = await fetch(
      `${baseUrl}/org/auth/${orgId}/admin/${userId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: sesion.accessToken,
        },
      }
    );

    return userResponse.ok;
  } catch (error) {
    console.log(error);
  }
}

export async function removeAdminFromOrganisation(
  orgId: string,
  userId: string,
  sesion: SessionWithToken
) {
  try {
    const userResponse = await fetch(
      `${baseUrl}/org/auth/${orgId}/admin/${userId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: sesion.accessToken,
        },
      }
    );

    return userResponse.ok;
  } catch (error) {
    console.log(error);
  }
}
