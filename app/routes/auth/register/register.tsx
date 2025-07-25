import React from "react";
import { RegisterForm } from "~/components/register-form";
import { cn } from "~/lib/utils";

export default function Register() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md bg-white/80 dark:bg-neutral-900/80 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 backdrop-blur-md p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
