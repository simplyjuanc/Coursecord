import { getCourseData } from '@/services/reduxFetchService';
import { useAppDispatch } from '@/store';
import { setCourseInfo, setSyllabus } from '@/store/slices/courseSlice';
import { useParams } from 'next/navigation';

export default async function Dashboard({
  params,
}: {
  params: { courseId: string };
}) {
  await getCourseData(params.courseId);

  return <div>dashboard!</div>;
}
