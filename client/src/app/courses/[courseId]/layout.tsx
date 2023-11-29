import Sidebar from '@/components/sidebar/sidebar';
import { getCourseData } from '@/services/setInStoreService';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='w-full'>{children}</div>
    </div>
  );
}
