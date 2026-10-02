import { CapabilitiesScroll } from "./components/CapabilitiesScroll";
import { ContactDialog } from "./components/ContactDialog";
import { ContactForm } from "./components/ContactForm";
import { ContactWordmark } from "./components/ContactWordmark";
import { Eyebrow } from "./components/Eyebrow";
import { FaqAccordion } from "./components/FaqAccordion";
import { HeroRotator } from "./components/HeroRotator";
import { Logo } from "./components/Logo";
import { Navigation } from "./components/Navigation";
import { MetricsSection } from "./components/MetricsSection";
import { OutcomesSection } from "./components/OutcomesSection";
import { ParallaxSection } from "./components/ParallaxSection";
import { Reveal } from "./components/Reveal";
import { ScrollToTop } from "./components/ScrollToTop";
import { StatementSection } from "./components/StatementSection";
import { SectionSvgSystem } from "./components/SvgVisualSystem";
import { siteContent } from "./site-content";
import { ServiceCardSlider } from "./components/ServiceCardSlider";
import { serviceCards } from "./service-cards";
import { ServicesCylinder } from "./components/ServicesCylinder";
import { ButtonLabel } from "./components/ButtonLabel";
import { AboutIntro } from "./components/AboutIntro";

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <HeroRotator />
      <AboutIntro />
      <ServiceCardSlider {...serviceCards} />
      <CapabilitiesScroll />
      <MetricsSection />
      <OutcomesSection />
      <ServicesCylinder />
      <ParallaxSection />
      <StatementSection />

      <section className="faq section-pad" id="questions">
        <div className="shell faq-layout">
          <div className="faq-intro">
            <Reveal><h2>The questions that come up first.</h2></Reveal>
            <Reveal delay={0.06}>
              <p>Six things almost everyone asks on the first call, answered here so you don’t have to.</p>
            </Reveal>
          </div>
          <FaqAccordion />
          <div className="faq-cta-row">
            <p>No commitment. We will tell you if we are not the right fit.</p>
            <button className="button faq-cta" data-open-contact type="button">
              <ButtonLabel>Book a discovery call <span aria-hidden="true" className="button-icon">→</span></ButtonLabel>
            </button>
          </div>
        </div>
      </section>

      <section className="contact section-pad" id="contact">
        <SectionSvgSystem className="contact-system" kind="bracket" />
        <div className="shell contact-layout">
          <div className="contact-copy">
            <Reveal><Eyebrow>{siteContent.contact.eyebrow}</Eyebrow></Reveal>
            <Reveal delay={0.06}><h2>{siteContent.contact.title}</h2></Reveal>
            <Reveal delay={0.12}><p>{siteContent.contact.description}</p></Reveal>
          </div>
          <ContactForm idPrefix="inline-contact" variant="inline" />
        </div>
        <ContactWordmark />
      </section>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <div>
            <a aria-label="StarDust Studio home" className="wordmark" href="#top"><Logo wordmark={false} /></a>
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
      <ScrollToTop />
    </main>
  );
}
