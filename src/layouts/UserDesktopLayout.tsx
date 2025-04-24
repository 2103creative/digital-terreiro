import { ReactNode } from "react";
import DesktopSidebar from "@/components/DesktopSidebar";
import DashboardHeader from "@/components/DashboardHeader";

interface Props {
  children: ReactNode;
}

const UserDesktopLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <DesktopSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="px-5 py-6">{children}</main>
      </div>
    </div>
  );
};

export default UserDesktopLayout;
