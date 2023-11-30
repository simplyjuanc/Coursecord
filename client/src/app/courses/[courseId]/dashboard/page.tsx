import { getCourseData } from '@/services/reduxFetchService';

export default async function Dashboard({
  params,
}: {
  params: { courseId: string };
}) {
  await getCourseData(params.courseId);

  return <div>dashboard!</div>;
}
