'use client';
import { getCourseData, getUserData } from '@/services/setInStoreService';
import NavSidebar from '@/components/navSidebar/navSidebar';
import { useAppSelector } from '@/store';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SessionWithToken } from '@/types';

export default function Layout({ children }: { children: React.ReactNode }) {
  const course = useAppSelector((state) => state.course.courseInfo);
  const { data: session } = useSession();
  const { courseId } = useParams() as { courseId: string };

  useEffect(() => {
    (async function () {
      if (!course) getCourseData(courseId);
      if(session) getUserData((session as SessionWithToken).user);
      console.log('GOT COURSE DATA');
    })();
  }, [courseId]);

  return (
    <div className='flex'>
      <NavSidebar />
      {children}
    </div>
  );
}
