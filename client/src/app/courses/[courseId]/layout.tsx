'use client';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser, setRoles } from '@/store/slices/userSlice';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SessionWithToken } from '@/types';
import Sidebar from '@/components/sidebar/sidebar';
import { getUserRoles } from '@/services/apiClientService';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.user.id);
  const { courseId } = useParams() as { courseId: string };

  useEffect(() => {
    (async function () {
      const userSession = session as SessionWithToken | undefined;
      if (userSession && userSession.user.id !== userId) {
        dispatch(setUser({ userId: userSession.user.id }));
        const userRoles = await getUserRoles(courseId, false, userSession);
        
        if (userRoles) dispatch(setRoles({ roles: userRoles }));
      }
    })();
  }, [courseId, dispatch, session, userId]);

  return (
    <div className='flex'>
      <Sidebar />
      {children}
    </div>
  );
}
