
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 md:p-8">
        <div className="md:hidden mb-4">
          <MobileNav />
        </div>
        <div className="flex-1 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
