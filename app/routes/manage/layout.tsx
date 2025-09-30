import { Outlet } from "react-router";
import TopBarAdmin from "~/layouts/TopBar-Admin";
import SideBarAdmin from "~/layouts/SideBar-Admin";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <TopBarAdmin />
      <div className="flex flex-1">
        <SideBarAdmin />
        <main className="flex-1 p-6 bg-muted">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
