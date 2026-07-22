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
import { SiteContentProvider } from "@/hooks/useSiteContent";
import { defaultContent } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: defaultContent.seo.title },
      { name: "description", content: defaultContent.seo.description },
      { property: "og:title", content: defaultContent.seo.ogTitle },
      { property: "og:description", content: defaultContent.seo.ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: defaultContent.seo.ogTitle },
      { name: "twitter:description", content: defaultContent.seo.ogDescription },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: defaultContent.personal.fullName,
          jobTitle: defaultContent.personal.role,
          email: defaultContent.admin.email,
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteContentProvider>
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
    </SiteContentProvider>
  );
}
