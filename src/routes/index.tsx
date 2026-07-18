import { createFileRoute } from "@tanstack/react-router";
import { Aurora } from "@/components/portfolio/Aurora";
import { LenisProvider } from "@/components/portfolio/LenisProvider";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { LoadingScreen } from "@/components/portfolio/LoadingScreen";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Journey } from "@/components/portfolio/Journey";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Achievements } from "@/components/portfolio/Achievements";
import { Interests } from "@/components/portfolio/Interests";
import { Gallery } from "@/components/portfolio/Gallery";
import { Resume } from "@/components/portfolio/Resume";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ishaan Singh — Aspiring Software Developer & Creative Web Designer" },
      {
        name: "description",
        content:
          "Portfolio of Ishaan Singh — building modern digital experiences through code, creativity, and continuous learning.",
      },
      { property: "og:title", content: "Ishaan Singh — Developer & Designer" },
      {
        property: "og:description",
        content: "Building modern digital experiences through code, creativity, and continuous learning.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <LoadingScreen />
      <LenisProvider />
      <CustomCursor />
      <Aurora />
      <Navbar />
      <Hero />
      <About />
      <Journey />
      <Skills />
      <Projects />
      <Achievements />
      <Interests />
      <Gallery />
      <Resume />
      <Contact />
      <Footer />
    </main>
  );
}
