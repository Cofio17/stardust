export type Project = {
  slug: string;
  name: string;
  category: string;
  title: string;
  summary: string;
  theme: "forma" | "noma" | "relay" | "solutions";
  year: string;
  duration: string;
  services: string[];
  intro: string;
  challenge: string[];
  insight: string;
  process: { title: string; description: string }[];
  flow: { title: string; description: string }[];
  solution: string[];
  images: { src: string; alt: string; caption: string }[];
  outcomes: { value: string; label: string }[];
  result: string;
  takeaway: string;
};

// Fictional concept work. Replace these entries with verified client stories.
export const projects: Project[] = [
  {
    slug: "forma-store",
    name: "Forma",
    category: "E-commerce · Digital experience",
    title: "A considered store for considered objects.",
    summary: "Turning a beautiful catalogue into a clear, confident path to purchase.",
    theme: "forma",
    year: "2026",
    duration: "6 weeks",
    services: ["Strategy", "UI / UX design", "E-commerce", "Development"],
    intro: "Forma is a concept homeware brand built around fewer, better things. We imagined a store that brings the same care to shopping as the brand brings to its objects: quiet, useful, and easy to navigate.",
    challenge: [
      "The original concept looked like a magazine. Large imagery set the mood, but shoppers had to hunt for dimensions, materials, and delivery details. The things that help someone decide were scattered across the page.",
      "On mobile, the journey became even longer. Moving from a collection to the right product, then to checkout, meant too much scrolling and too many decisions. The challenge was to keep the character while making the next step obvious."
    ],
    insight: "A beautiful product page should answer a question before it asks for a purchase.",
    process: [
      { title: "Start with the questions", description: "We mapped what someone needs to know before buying: size, material, care, availability, and delivery. Those questions became the structure of every product page." },
      { title: "Make the important things visible", description: "We brought product choices and the add-to-bag action together. Supporting details sit nearby, while editorial photography gives each object room to breathe." },
      { title: "Follow the whole journey", description: "We worked through collection browsing, product selection, the bag, and checkout as one connected experience, including empty states and small-screen layouts." }
    ],
    flow: [
      { title: "Discover", description: "A focused collection with useful filters" },
      { title: "Decide", description: "Product details, options, and delivery together" },
      { title: "Bring it home", description: "A clear bag and a short checkout" }
    ],
    solution: [
      "The final concept pairs a warm editorial identity with a practical shopping system. Collections are easy to scan, product information follows a consistent order, and the bag keeps the total and delivery expectations visible.",
      "Behind the pages, a reusable set of product, collection, and content components means a new launch can feel fresh without rebuilding the store. The brand gets room to tell its story, and the shopper gets a clear path forward."
    ],
    images: [
      { src: "/images/studio/clarity.webp", alt: "A studio team planning the structure and priorities of a digital experience", caption: "01 / Mapping the questions before designing the screens." },
      { src: "/images/studio/prototype.webp", alt: "Designers reviewing a prototype on a tablet alongside paper wireframes", caption: "02 / Working through the journey with a connected prototype." }
    ],
    outcomes: [
      { value: "One", label: "consistent product-page system" },
      { value: "3 steps", label: "from discovery to checkout" },
      { value: "Mobile first", label: "at every point in the journey" }
    ],
    result: "The demo delivers a complete storefront direction: a clearer buying journey, a repeatable content system, and a visual identity that holds together from the first collection to the final confirmation. Commercial performance would be measured after a real launch.",
    takeaway: "Clarity can be part of the brand. It does not have to come at the expense of character."
  },
  {
    slug: "noma-booking",
    name: "Noma",
    category: "Web app · Booking platform",
    title: "Less organising. More getting away.",
    summary: "A booking experience that brings stays, availability, and people into one place.",
    theme: "noma",
    year: "2026",
    duration: "8 weeks",
    services: ["Product strategy", "UI / UX design", "Web app", "Development"],
    intro: "Noma is a concept booking platform for small, independent stays. We explored how a guest could find the right place and reserve it with confidence, while a host could manage the day without a collection of spreadsheets.",
    challenge: [
      "Booking a stay often starts on a beautiful website and ends in a chain of emails. Availability is unclear, the price needs confirming, and guests cannot tell whether their preferred dates are actually reserved.",
      "For the host, those same conversations create a second problem: keeping the calendar, guest details, and confirmations in sync. We needed to design both sides of the booking, not just the public-facing pages."
    ],
    insight: "A reservation should feel certain for the guest and manageable for the host.",
    process: [
      { title: "Map both sides", description: "We followed a reservation from the first search through arrival, identifying what the guest sees and what the host needs at each step." },
      { title: "Design for confidence", description: "Dates, guest counts, availability, and the full price come together before confirmation. Clear states distinguish an available stay, a pending booking, and a confirmed reservation." },
      { title: "Bring the day into one view", description: "A simple host workspace connects upcoming stays, guest information, and the calendar. We also designed for changes and cancellations rather than only the happy path." }
    ],
    flow: [
      { title: "Find a stay", description: "Explore places and check available dates" },
      { title: "Reserve", description: "Review guests, dates, and the full price" },
      { title: "Stay in sync", description: "Confirmation connects guest and host" }
    ],
    solution: [
      "The concept gives guests a direct journey from discovery to confirmation. The booking summary remains consistent as they choose dates and add details, so there is no last-minute surprise about what they are reserving.",
      "The host experience uses the same reservation information in a practical calendar and daily overview. Instead of copying details between tools, the team has a shared view of what is booked, what is changing, and what needs attention."
    ],
    images: [
      { src: "/images/studio/conversation.webp", alt: "A team talking through the needs of a digital product", caption: "01 / Understanding the guest journey and the host’s working day." },
      { src: "/images/studio/prototype.webp", alt: "A booking interface being reviewed on a tablet", caption: "02 / Testing the reservation flow before building the full platform." }
    ],
    outcomes: [
      { value: "One calendar", label: "a shared view of every reservation" },
      { value: "Full price", label: "visible before confirming" },
      { value: "Both sides", label: "guest and host designed together" }
    ],
    result: "The demo connects the guest journey and the host workspace in one product direction. It makes booking states explicit, keeps reservation information consistent, and provides a foundation for testing with real guests and hosts.",
    takeaway: "The best guest experience starts with a better day for the person behind it."
  },
  {
    slug: "relay-operations",
    name: "Relay",
    category: "Automation · Internal tools",
    title: "From scattered tasks to a shared rhythm.",
    summary: "Connecting the handoffs that used to live in inboxes and spreadsheets.",
    theme: "relay",
    year: "2026",
    duration: "5 weeks",
    services: ["Workflow mapping", "Automation", "Internal tools", "Integrations"],
    intro: "Relay is a concept operations workspace for a small service team. The goal was simple: let people see what needs to happen next, while the system takes care of the repetitive work between steps.",
    challenge: [
      "A new request arrived by email, became a row in a spreadsheet, and then moved through a series of private messages. Every handoff relied on someone remembering to update the next person.",
      "The work itself was not especially complex. The coordination was. Without a shared view of ownership and status, the team spent too much time checking whether something had happened rather than doing the work."
    ],
    insight: "Automate the handoff. Keep the human judgement.",
    process: [
      { title: "Find the repeated handoffs", description: "We mapped a request from intake to completion, separating repeatable steps from the decisions that genuinely need a person." },
      { title: "Give each task a home", description: "Every request gets a clear status, owner, and next action. The workspace brings exceptions forward instead of treating every update as equally urgent." },
      { title: "Make the system explain itself", description: "An activity history shows what ran, what changed, and what failed. Retry and review states keep a broken integration from quietly becoming a lost request." }
    ],
    flow: [
      { title: "Capture", description: "Requests arrive in one shared queue" },
      { title: "Route", description: "Rules assign the owner and next action" },
      { title: "Resolve", description: "People review, the system updates" }
    ],
    solution: [
      "The concept replaces scattered updates with a shared request queue. Routine acknowledgements and status changes happen automatically, while the team stays in control of approvals and exceptions.",
      "A visible activity trail connects the workspace to the tools around it. That makes automation something the team can understand and maintain, with a clear recovery path whenever a step needs attention."
    ],
    images: [
      { src: "/images/studio/workflow.webp", alt: "Colleagues coordinating work across connected tools", caption: "01 / Mapping the real handoffs across the team’s existing tools." },
      { src: "/images/studio/automation.webp", alt: "A team reviewing an automated workflow together", caption: "02 / Making automated steps visible and easy to review." }
    ],
    outcomes: [
      { value: "One queue", label: "for incoming work and ownership" },
      { value: "Less copying", label: "with connected status updates" },
      { value: "Clear history", label: "for every automated handoff" }
    ],
    result: "The demo establishes a shared operations model with explicit ownership, connected updates, and a visible exception path. The next step in a real rollout would be a small pilot measuring handoff time and manual updates.",
    takeaway: "Useful automation gives a team more confidence, not another black box to manage."
  },
  {
    slug: "solutions-crm",
    name: "Solutions",
    category: "CRM · Custom web app",
    title: "Every relationship. A clear next step.",
    summary: "A CRM concept that brings leads, clients, and follow-ups into one shared workspace.",
    theme: "solutions",
    year: "2026",
    duration: "7 weeks",
    services: ["Product strategy", "UI / UX design", "CRM", "Development"],
    intro: "Solutions is an imaginary CRM for a small sales and service team. We explored a practical question: how do you keep customer relationships personal when their details are spread across inboxes, spreadsheets, and people’s heads?",
    challenge: [
      "In the scenario we designed for, a new enquiry starts in an inbox. A salesperson adds it to a spreadsheet, keeps notes elsewhere, and sets a reminder in their own calendar. A colleague covering for them has no clear view of the last conversation or the next promise.",
      "Adding another tool would only help if it made the working day simpler. The CRM needed a clear owner, an understandable pipeline, and a next action for every opportunity, without asking the team to maintain the same information twice."
    ],
    insight: "The useful part of a CRM is knowing what to do next, and why.",
    process: [
      { title: "Follow a real working day", description: "We mapped the concept journey from a first enquiry to an ongoing client relationship. That revealed the three essentials: who owns it, what has happened, and what comes next." },
      { title: "Make the pipeline actionable", description: "A focused board puts opportunities into clear stages. Each card carries its owner and next task, while the contact view brings notes and conversations together." },
      { title: "Design the handover", description: "We worked through reassignment, overdue follow-ups, and the move from won opportunity to active client. A shared activity history preserves context when ownership changes." }
    ],
    flow: [
      { title: "Capture the lead", description: "Contact details and source in one record" },
      { title: "Move it forward", description: "A clear stage, owner, and next action" },
      { title: "Keep the context", description: "Client history stays with the relationship" }
    ],
    solution: [
      "The concept combines a sales pipeline, contact records, and follow-up tasks in a single workspace. The overview makes today’s priorities visible, and each opportunity opens into a complete view of the relationship.",
      "Instead of treating a sale as the end of the record, the CRM carries its history into the client relationship. Permissions and clear ownership define who can make changes, while reminders bring the right person back at the right time."
    ],
    images: [
      { src: "/images/studio/workflow.webp", alt: "A team bringing customer information together across connected screens", caption: "01 / Connecting the handoffs from enquiry to client relationship." },
      { src: "/images/studio/clarity.webp", alt: "A team reviewing a clearer shared view of its business information", caption: "02 / Prioritising the information that helps someone act." }
    ],
    outcomes: [
      { value: "One pipeline", label: "a shared view of every opportunity" },
      { value: "Clear ownership", label: "a person and a next step for every lead" },
      { value: "Shared history", label: "context that survives a handover" }
    ],
    result: "This concept study sets out a CRM direction with connected contacts, opportunities, and tasks. It demonstrates the intended workflows and interface; response times, adoption, and commercial outcomes would need to be measured in a real implementation.",
    takeaway: "A customer relationship should outlast the spreadsheet, and the person who last updated it."
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
