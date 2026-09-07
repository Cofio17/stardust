import { CapabilitiesScroll } from "./components/CapabilitiesScroll";
import { BuiltForSection } from "./components/BuiltForSection";
import { ContactDialog } from "./components/ContactDialog";
import { ContactForm } from "./components/ContactForm";
import { FaqAccordion } from "./components/FaqAccordion";
import { HeroRotator } from "./components/HeroRotator";
import { Logo } from "./components/Logo";
import { Navigation } from "./components/Navigation";
import { MetricsSection } from "./components/MetricsSection";
import { OutcomesSection } from "./components/OutcomesSection";
import { Reveal } from "./components/Reveal";
import { StatementSection } from "./components/StatementSection";
import { SectionSvgSystem } from "./components/SvgVisualSystem";
import { siteContent } from "./site-content";

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <HeroRotator />
      <BuiltForSection />
      <CapabilitiesScroll />
      <MetricsSection />
      <OutcomesSection />
      <StatementSection />

      <section className="faq section-pad" id="questions">
        <div className="shell faq-layout">
          <div className="faq-intro">
            <Reveal><h2>The questions that come up first.</h2></Reveal>
            <Reveal delay={0.06}>
              <p>Asked on almost every discovery call, so they may as well be answered before it.</p>
            </Reveal>
          </div>
          <FaqAccordion />
          <div className="faq-cta-row">
            <p>No commitment. We map the operation first.</p>
            <button className="button faq-cta" data-open-contact type="button">
              Book a discovery call <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="contact section-pad" id="contact">
        <SectionSvgSystem className="contact-system" kind="bracket" />
        <div className="shell contact-layout">
          <div className="contact-copy">
            <Reveal><p className="eyebrow">{siteContent.contact.eyebrow}</p></Reveal>
            <Reveal delay={0.06}><h2>{siteContent.contact.title}</h2></Reveal>
            <Reveal delay={0.12}><p>{siteContent.contact.description}</p></Reveal>
          </div>
          <ContactForm idPrefix="inline-contact" variant="inline" />
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <div>
            <a aria-label="StarDust Studio home" className="wordmark" href="#top"><Logo /></a>
            <div className="footer-links">
              {siteContent.nav.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
              <a href="#contact">Start a project</a>
            </div>
          </div>
          <div className="footer-meta">
            <a className="footer-email" href={`mailto:${siteContent.temporaryEmail}`}>{siteContent.temporaryEmail}</a>
            <small>Temporary contact placeholder</small>
          </div>
        </div>
      </footer>
      <ContactDialog />
    </main>
  );
}
