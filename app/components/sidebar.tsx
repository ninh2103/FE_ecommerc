import React from "react";
import {
  LayoutDashboard,
  Users,  
  Package,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Users", icon: Users, href: "/users" },
  { label: "Products", icon: Package, href: "/products" },
  { label: "Orders", icon: ShoppingCart, href: "/orders" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={`h-screen bg-background border-r flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex items-center justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors hover:bg-accent text-muted-foreground ${collapsed ? "justify-center" : ""}`}
          >
            <item.icon className="w-5 h-5" />
            {!collapsed && <span className="text-base font-medium">{item.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}
