import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Certifications } from "@/components/sections/Certifications";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { config } from "@/portfolio.config";
import type { SectionId } from "@/portfolio.config";

interface PortfolioPageProps {
  theme: string;
  onToggleTheme: () => void;
  topOffset: number;
}

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  about:          About,
  skills:         Skills,
  experience:     Experience,
  projects:       Projects,
  education:      Education,
  certifications: Certifications,
  testimonials:   Testimonials,
  contact:        Contact,
};

export function PortfolioPage({ theme, onToggleTheme, topOffset }: PortfolioPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} topOffset={topOffset} />
      <Hero />
      {config.sections
        .filter((s) => s.show)
        .map(({ id }) => {
          const Section = SECTION_COMPONENTS[id];
          return Section ? <Section key={id} /> : null;
        })}
    </div>
  );
}
