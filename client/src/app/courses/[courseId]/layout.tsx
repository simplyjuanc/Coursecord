import { getCourseData } from '@/services/setInStoreService';
import NavSidebar from "@/components/navSidebar/navSidebar";


export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <NavSidebar />
      {children}
    </div>
  );
}
