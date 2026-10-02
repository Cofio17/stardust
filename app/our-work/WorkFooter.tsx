import Link from "next/link";
import { ButtonLabel } from "../components/ButtonLabel";
import { Logo } from "../components/Logo";
import { siteContent } from "../site-content";

export function WorkFooter() {
  return (
    <>
      <section className="work-contact">
        <div className="work-shell">
          <p className="work-kicker">THE NEXT STORY COULD BE YOURS</p>
          <h2>Something in mind?<br />Let’s give it shape.</h2>
          <button className="button button-lime" data-open-contact type="button"><ButtonLabel>Start a project <span aria-hidden="true">↗</span></ButtonLabel></button>
        </div>
      </section>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <div>
            <Link aria-label="StarDust Studio home" className="wordmark" href="/"><Logo wordmark={false} /></Link>
            <div className="footer-links">{siteContent.nav.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</div>
          </div>
          <div className="footer-meta"><a className="footer-email" href={`mailto:${siteContent.temporaryEmail}`}>{siteContent.temporaryEmail}</a><small>Temporary contact placeholder</small></div>
        </div>
      </footer>
    </>
  );
}
