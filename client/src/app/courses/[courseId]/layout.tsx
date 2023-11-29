import NavSidebar from "@/components/navSidebar/navSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <NavSidebar />
      {children}
    </div>
  );
}
