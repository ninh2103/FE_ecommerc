import React from "react";
import { Sun, Moon, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";

// You may want to use a theme context or next-themes for real dark mode switching
export default function Navbar() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 border-b bg-background">
      {/* Logo */}
      <div className="flex items-center h-full">
        <img
          src={darkMode ? "/app/welcome/logo-dark.svg" : "/app/welcome/logo-light.svg"}
          alt="Logo"
          width={40}
          height={40}
          className="h-10 w-10"
        />
      </div>
      {/* Right side: Avatar + Dark mode toggle */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-yellow-500" />
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            id="dark-mode-toggle"
          />
          <Moon className="w-5 h-5 text-blue-500" />
        </div>
      </div>
    </nav>
  );
}
