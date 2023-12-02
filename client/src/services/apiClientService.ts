import { Section, SessionWithToken, Unit } from '@/types';

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

export async function editUnit(
  unit: Unit,
  session: SessionWithToken
) {
  try {
    console.log(session.accessToken);
    const {id, ...unitData} = unit;
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
  session: SessionWithToken
) {
  try {
    const sectionResponse = await fetch(
      `${baseUrl}/section/auth/${section.course_id}`,
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

export async function deletSection(
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

export async function getRolesByUser(
  userId: string,
  session: SessionWithToken
) {
  try {
    const userResponse = await fetch(`${baseUrl}/role/user/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: session.accessToken,
      },
    });

    console.log(userResponse.status);
    if (!userResponse.ok) {
      console.log('Roles could not be retrieved');
      return [];
    }

    console.log('made it here');
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

