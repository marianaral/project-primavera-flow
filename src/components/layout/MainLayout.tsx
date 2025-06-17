
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background font-sans overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 w-full min-w-0 p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="md:hidden mb-3">
          <MobileNav />
        </div>
        <div className="w-full max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
