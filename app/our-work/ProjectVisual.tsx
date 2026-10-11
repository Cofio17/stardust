import type { Project } from "./projects";
import { Arrow } from "../components/Arrow";

function ObjectStudy({ kind }: { kind: "vase" | "lamp" | "bowl" }) {
  return (
    <svg viewBox="0 0 160 170" fill="none" aria-hidden="true">
      <ellipse cx="80" cy="150" rx="47" ry="7" fill="#42382a" opacity=".1" />
      {kind === "vase" ? <>
        <path d="M64 30h32v31c0 16 29 27 29 57 0 23-18 31-45 31s-45-8-45-31c0-30 29-41 29-57V30Z" fill="#d5c8ac" />
        <ellipse cx="80" cy="30" rx="16" ry="5" fill="#716858" />
        <ellipse cx="80" cy="30" rx="11" ry="3" fill="#302e26" />
        <path d="M67 63c-4 25-22 27-23 50" stroke="#fff" strokeOpacity=".3" strokeWidth="3" />
      </> : kind === "lamp" ? <>
        <path d="M78 77h5v68h-5z" fill="#5e4231" /><ellipse cx="80" cy="145" rx="28" ry="5" fill="#664833" />
        <path d="M32 77c0-32 21-49 48-49s48 17 48 49H32Z" fill="#d5c8ac" />
        <ellipse cx="80" cy="77" rx="48" ry="5" fill="#ad8f6c" />
      </> : <>
        <path d="M25 102h110c-4 32-25 46-55 46s-51-14-55-46Z" fill="#d5c8ac" />
        <ellipse cx="80" cy="102" rx="55" ry="13" fill="#b0a38b" /><ellipse cx="80" cy="102" rx="46" ry="9" fill="#827663" />
      </>}
    </svg>
  );
}

function Landscape() {
  return (
    <svg viewBox="0 0 640 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="640" height="340" fill="#c6d8d6" />
      <circle cx="490" cy="68" r="28" fill="#f6efd7" />
      <path d="m0 210 130-146 129 137 130-108 251 131v116H0Z" fill="#96b1ab" />
      <path d="m0 242 148-91 121 70 174-78 197 129v68H0Z" fill="#547b70" />
      <path d="m0 298 171-69 219 63 250-90v138H0Z" fill="#244c40" />
      <path d="m254 220 69-48 70 48v83H254Z" fill="#d2b99a" />
      <path d="m245 220 78-61 80 61" stroke="#173f36" strokeWidth="16" />
      <path d="M312 237h26v66h-26z" fill="#324e43" /><path d="M267 236h28v29h-28zM352 236h28v29h-28z" fill="#e9e4cf" />
      <path d="m324 303-21 37h93l-48-37" fill="#bba98d" />
      <path d="M75 194v107M544 169v128" stroke="#173f36" strokeWidth="8" />
      <path d="m75 147-34 76h68zm469-29-38 85h76z" fill="#173f36" />
    </svg>
  );
}

export function ProjectVisual({ theme, name }: Pick<Project, "theme" | "name">) {
  return (
    <div className={`project-visual visual-${theme}`} role="img" aria-label={`${name} concept interface: ${theme === "forma" ? "an editorial homeware store with a curated product collection" : theme === "noma" ? "a nature retreat booking page with dates and a reservation summary" : theme === "solutions" ? "a CRM with a sales pipeline, opportunity owners, and a shared customer history" : "an operations dashboard with a shared queue and an automated workflow"}`}>
      <div className="visual-art" aria-hidden="true">
        <span className="visual-brand">{name}<span>®</span></span>
        <span className="visual-note">{theme === "forma" ? "Objects for the everyday." : theme === "noma" ? "Somewhere slower." : theme === "solutions" ? "Relationships, connected." : "Work, in sync."}</span>
        <div className="mock-window">
          <div className="mock-chrome"><i /><i /><i /><span>{name.toLowerCase()}.example</span><b><Arrow /></b></div>
          {theme === "forma" ? (
            <div className="forma-screen">
              <div className="mock-site-nav"><strong>forma.</strong><span>Shop &nbsp; Our story &nbsp; Journal</span><span>Bag (0)</span></div>
              <div className="forma-heading"><span>FEWER, BETTER THINGS</span><h3>A little intention.<br />Every day.</h3><p>Thoughtful objects. Made to stay.</p></div>
              <div className="mock-products">
                {(["vase", "lamp", "bowl"] as const).map((kind, index) => <div key={kind}><div className="object-study"><ObjectStudy kind={kind} /></div><p>{["The everyday vase", "Arc table light", "Gather bowl"][index]}<span>€{[48, 125, 36][index]}</span></p></div>)}
              </div>
            </div>
          ) : theme === "noma" ? (
            <div className="noma-screen">
              <div className="mock-site-nav"><strong>noma<span>↟</span></strong><span>Our stays &nbsp; The experience</span><span>Find your quiet <Arrow /></span></div>
              <div className="noma-landscape"><Landscape /><div><span>LESS NOISE. MORE NATURE.</span><h3>A good place<br />to do less.</h3></div></div>
              <div className="noma-booking"><div><small>WHERE</small><b>The woodland cabin</b></div><div><small>CHECK IN — CHECK OUT</small><b>Oct 16 — Oct 19</b></div><div><small>GUESTS</small><b>2 people</b></div><span>Find a stay <Arrow /></span></div>
            </div>
          ) : theme === "solutions" ? (
            <div className="solutions-screen">
              <aside className="solutions-sidebar"><strong>solutions<span>▦</span></strong><span className="mock-selected">▦ &nbsp; Pipeline</span><span>◎ &nbsp; Contacts</span><span>✓ &nbsp; Tasks</span><span>◷ &nbsp; Activity</span><small>YOUR TEAM<br />Sales & relationships</small></aside>
              <div className="solutions-dashboard"><div className="relay-top"><span>Workspace / Sales pipeline</span><b>SD</b></div><h3>Good relationships start here.</h3><p>Your opportunities. A clear next move.</p><div className="crm-toolbar"><span>All opportunities &nbsp;⌄</span><span>+ New opportunity</span></div><div className="crm-pipeline">{["New leads", "In conversation", "Proposal sent"].map((stage, index) => <div className="crm-column" key={stage}><div className="crm-stage"><i /><span>{stage}</span><b>2</b></div>{[0, 1].map((card) => <div className="crm-deal" key={card}><small>{["NORTHLINE", "FIELD STUDIO", "COAST & CO.", "VERDE", "ATELIER", "COMMON GROUND"][index * 2 + card]}</small><strong>{["Website redesign", "Client portal", "Store launch", "Booking platform", "Team dashboard", "Workflow setup"][index * 2 + card]}</strong><span>Next: {index === 0 ? "Discovery call" : index === 1 ? "Review the brief" : "Follow up"}</span><div><i>{card === 0 ? "AM" : "JL"}</i><span>{card === 0 ? "Today" : "Tomorrow"}</span></div></div>)}</div>)}</div></div>
            </div>
          ) : (
            <div className="relay-screen">
              <aside className="relay-sidebar"><strong>relay<span><Arrow /></span></strong><span className="mock-selected">▦ &nbsp; Overview</span><span>☷ &nbsp; Requests</span><span>⇄ &nbsp; Workflows</span><span>◎ &nbsp; Activity</span><small>YOUR WORKSPACE<br />Studio operations</small></aside>
              <div className="relay-dashboard"><div className="relay-top"><span>Workspace / Overview</span><b>SD</b></div><h3>Everything in motion.</h3><p>A clear view of what happens next.</p><div className="mock-stats"><div><small>IN PROGRESS</small><strong>12</strong></div><div><small>COMPLETED</small><strong>38 <em><Arrow /></em></strong></div><div><small>NEEDS REVIEW</small><strong>03</strong></div></div><div className="mock-queue"><div><strong>Your shared queue</strong><span>View all <Arrow /></span></div>{["New project enquiry", "Proposal approval", "Client onboarding"].map((label, index) => <div key={label}><i /><span>{label}</span><b>{["In progress", "Review", "Complete"][index]}</b></div>)}</div></div>
            </div>
          )}
        </div>
        <div className={`visual-detail detail-${theme}`}>
          {theme === "forma" ? <><small>MADE FOR YOUR EVERYDAY</small><div className="detail-object"><ObjectStudy kind="vase" /></div><strong>The everyday vase</strong><span>Sand / Stoneware <b>€48</b></span><div className="mock-action">Add to bag &nbsp; +</div></> : theme === "noma" ? <><span className="detail-icon">↟</span><small>YOUR NEXT SLOW WEEKEND</small><strong>The woodland cabin</strong><span>2 guests · 3 nights</span><div className="detail-rule" /><span>Oct 16 — Oct 19 <b>€420</b></span><div className="mock-action">Reserve your stay <Arrow /></div></> : theme === "solutions" ? <><small>CONTACT / SHARED HISTORY</small><div className="crm-contact-avatar">AM</div><strong>Alex Morgan</strong><span>Northline · Website redesign</span><div className="detail-rule" /><div className="crm-contact-note"><small>NEXT STEP</small><strong>Discovery call</strong><span>Today, 10:00 · Jamie Lee</span></div><span className="crm-contact-history">◷ &nbsp; Notes & conversations, together</span></> : <><small>WORKFLOW / LIVE</small><strong>A smoother handoff.</strong><div className="detail-flow"><span>✓ &nbsp; Request received</span><i>↓</i><span>✓ &nbsp; Owner assigned</span><i>↓</i><span>◎ &nbsp; Ready for review</span></div><span className="detail-status">● &nbsp; Everything is up to date</span></>}
        </div>
        <span className="visual-edition">STARDUST STUDIO &nbsp; / &nbsp; CONCEPT {theme === "forma" ? "01" : theme === "noma" ? "02" : theme === "solutions" ? "04" : "03"}</span>
      </div>
    </div>
  );
}
