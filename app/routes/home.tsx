import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ecommerce" },
    { name: "description", content: "Ecommerce" },
  ];
}

export default function Home() {
  return <Welcome />;
}
