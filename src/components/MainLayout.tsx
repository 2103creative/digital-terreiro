import React from "react";
import DesktopSidebar from "@/components/DesktopSidebar";
import DashboardHeader from "@/components/DashboardHeader";

interface MainLayoutProps {
  title?: string;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:flex">
      {/* Sidebar fixo no padrão do site */}
      <div className="hidden md:flex">
        <DesktopSidebar />
      </div>
      <div className="flex-1">
        <DashboardHeader />
        {title && (
          <header className="container mx-auto px-4 py-6">
            <h1 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">{title}</h1>
          </header>
        )}
        <main className="container mx-auto px-4 pb-8">{children}</main>
      </div>
    </div>
  );
};

export { MainLayout };
