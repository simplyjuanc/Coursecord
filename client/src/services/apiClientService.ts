import { Section, SessionWithToken, Unit } from '@/types';

const baseUrl = process.env.API_URL || 'http://localhost:5000';

export async function getSyllabus(courseId: string, session: SessionWithToken) {
  try {
    const syllabusResponse = await fetch(`${baseUrl}/section/syllabus/${courseId}`, {
      method: 'GET',
      headers: {
        Authorization: session.accessToken,
      },
    });

    if (!syllabusResponse.ok) {
      console.log('Syllabus could not be retrieved');
      return undefined;
    }

    return await syllabusResponse.json();
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
    const unitResponse = await fetch(`${baseUrl}/unit/${unitId}`, {
      method: 'PUT',
      headers: {
        Authorization: session.accessToken,
      },
      body: JSON.stringify(newContent),
    });

    return unitResponse.ok;
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
