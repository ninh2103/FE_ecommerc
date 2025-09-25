import type { Route } from "../../+types/root";
import BrandSection from "./homepage/Brand";
import CategorySection from "./homepage/Category";
import FeaturesSection from "./homepage/FeaturesSection";
import Hero from "./homepage/Hero";
import ProductSection from "./homepage/Product";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ecommerce" },
    { name: "description", content: "Ecommerce" },
  ];
}

export default function HomePage() {
  return (
    <main>
          <section id='home'>
            <Hero />
          </section>
          <section id='features' className='bg-white px-4 pt-4'>
            <FeaturesSection />
          </section>
          <section id='catgory' className='bg-white px-4 pt-4'>
            <CategorySection />
          </section>
          <section id='brand' className='bg-white px-4 pt-4'>
            <BrandSection />
          </section>
          <section id='brand' className='bg-white px-4 pt-4'>
            <ProductSection />
          </section>
        </main>
  )
}
