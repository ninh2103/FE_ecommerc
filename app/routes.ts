import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("login", "routes/auth/login/login.tsx"), route("register", "routes/auth/register/register.tsx"),  route("dashboard", "routes/manage/layout.tsx", [
  // child routes
  index("routes/manage/dashboard/dashboard.tsx"),
  route("settings", "routes/manage/setting/setting.tsx"),
]),] satisfies RouteConfig;
