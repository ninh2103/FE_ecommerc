import { Outlet } from "react-router";
import Navbar from "~/components/navbar";
import Sidebar from "~/components/sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-muted">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
