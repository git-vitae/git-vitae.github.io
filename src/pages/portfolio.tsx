import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { config } from "@/portfolio.config";

interface PortfolioPageProps {
  theme: string;
  onToggleTheme: () => void;
}

const s = config.sections;

export function PortfolioPage({ theme, onToggleTheme }: PortfolioPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <Hero />
      {s.about          && <About />}
      {s.skills         && <Skills />}
      {s.experience     && <Experience />}
      {s.projects       && <Projects />}
      {s.education      && <Education />}
      {s.certifications && <Certifications />}
      {s.contact        && <Contact />}
    </div>
  );
}
