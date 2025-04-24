import { ReactNode } from "react";
import DesktopSidebar from "@/components/DesktopSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";

interface Props {
  children: ReactNode;
}

const AdminDesktopLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <DesktopSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="px-5 py-6">{children}</main>
      </div>
      {/* MobileNav opcional para desktop, mas pode ser removido */}
      <MobileNav />
    </div>
  );
};

export default AdminDesktopLayout;
