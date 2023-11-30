'use client';
import { getCourseData, getUserData } from '@/services/reduxFetchService';
import { useAppSelector } from '@/store';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SessionWithToken } from '@/types';
import Sidebar from '@/components/sidebar/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const course = useAppSelector((state) => state.course.courseInfo);
  const { data: session } = useSession();
  const { courseId } = useParams() as { courseId: string };

  useEffect(() => {
    (async function () {
      if (!course) {
        getCourseData(courseId);
      }
      if (session) getUserData((session as SessionWithToken).user);
    })();
  }, [courseId]);

  return (
    <div className='flex'>
      <Sidebar />
      {children}
    </div>
  );
}
