import { ReactNode } from "react";
import MobileNav from "@/components/MobileNav";

interface Props {
  children: ReactNode;
}

const UserMobileLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      <main className="flex-1 px-2 pt-4 pb-2">{children}</main>
      <MobileNav />
    </div>
  );
};

export default UserMobileLayout;
