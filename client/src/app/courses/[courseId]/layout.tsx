import Sidebar from "@/components/sidebar/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-7">
      <Sidebar />
      <div className="col-span-6">{children}</div>
    </div>
  );
}
