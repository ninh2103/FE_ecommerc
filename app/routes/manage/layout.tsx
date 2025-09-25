import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <main className="flex-1 p-6 bg-muted">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
