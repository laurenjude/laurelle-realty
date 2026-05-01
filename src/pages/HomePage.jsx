import { Helmet } from "react-helmet-async";
import Hero from "../components/home/Hero";
import FeaturedProperties from "../components/home/FeaturedProperties";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Laurelle Realty Where AI Meets Home | Lagos Real Estate</title>
        <meta
          name="description"
          content="Discover premium residential properties in Lagos, Nigeria. AI-powered search, verified listings, and expert local guidance. Browse apartments, duplexes, and luxury homes in Lekki, Victoria Island, Ikoyi, and beyond."
        />
      </Helmet>

      {/* Navbar adds its own spacer div, so Hero starts directly */}
      <Hero />
      <FeaturedProperties />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
