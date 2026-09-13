export type Accent = "lime" | "cobalt" | "mist" | "porcelain";

export type Service = {
  title: string;
  description: string;
  /* Square 1024px PNG on a transparent background. See docs/service-icon-prompt.md
     for the shared style system every one of these has to sit inside. */
  icon: string;
};

export type Capability = {
  title: string;
  eyebrow: string;
  description: string;
  bullets: string[];
  accent: Accent;
};

export type TimeMoment = {
  time: string;
  title: string;
  description: string;
};

export type Metric = {
  /* `from` is where the counter starts on scroll — deliberately close to `value`
     so the climb reads as a slow arrival, not a slot machine. */
  from: number;
  label: string;
  note: string;
  suffix?: string;
  value: number;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const siteContent = {
  brand: "StarDust Studio",
  temporaryEmail: "hello@stardust.stud.io",
  nav: [
    { label: "Services", href: "#what-we-solve" },
    { label: "How we work", href: "#how-we-work" },
    { label: "FAQ", href: "#questions" }
  ],
  hero: {
    /* Three display lines. Only the middle one swaps, naming what we launch, so
       the rotator does real work instead of carrying a joke. Singular, because
       after "your" a plural reads as something the visitor already owns.
       "Launch" is the ordinary word for shipping a site, which is why the space
       theme lands without a pun. Single words only: the rotator slot is one grid
       cell with overflow hidden, so a two-word entry wraps and is clipped when
       the viewport is narrow. */
    titleLead: "We launch your",
    titleTail: "Then we stay in orbit.",
    messages: ["website", "product", "store"],
    description:
      "Design, engineering, and everything after launch. Same small team the whole way.",
    images: [
      {
        src: "/images/hero-route.webp",
        alt: "A lime thread tracing a route across layered paper maps on a graphite table"
      },
      {
        src: "/images/hero-structure.webp",
        alt: "Porcelain and cobalt architectural blocks connected by a lime line"
      },
      {
        src: "/images/hero-clarity.webp",
        alt: "Layered translucent papers and colored tabs arranged into a clear path"
      }
    ]
  },
  marquee: ["Websites", "Web apps", "E-commerce", "Automation", "AI tools", "SEO"],
  builtFor: {
    title: "Built for real problems.",
    description: [
      "We like software that has a reason to exist. Sometimes that means a brand new product. More often it means replacing a process that should have been automated three years ago.",
      "Either way the goal is the same: something useful, understandable, and genuinely worth the money to the people who open it every day."
    ],
    cards: [
      {
        number: "01",
        title: "From scratch",
        description:
          "An idea that doesn’t fit inside any existing tool. We take it from a rough concept to a product people can actually use."
      },
      {
        number: "02",
        title: "Made to fit",
        description:
          "Your business shouldn’t reshape itself around software. We build around the way you already work, including the parts that look odd on paper."
      },
      {
        number: "03",
        title: "Our own ideas",
        description:
          "We build and run our own products too. It keeps us honest about what launching something actually takes."
      },
      {
        number: "04",
        title: "Less busywork",
        description:
          "Good software removes work instead of adding another place to check. We automate the repetitive parts and connect what shouldn’t need a human at all."
      }
    ]
  },
  services: [
    {
      title: "SEO Services",
      description: "Be there when someone searches for exactly what you sell. Technical fixes, pages worth ranking, and a plan that keeps paying off after launch.",
      icon: "/images/service-seo.png"
    },
    {
      title: "AI Solutions",
      description: "Practical AI, not a science project. Assistants that know your business, search that understands the question, tools that save real hours.",
      icon: "/images/service-ai.png"
    },
    {
      title: "Full Web Apps",
      description: "Custom platforms, client portals, internal tools. Built from your workflow outward and tested by the people who will live in it.",
      icon: "/images/service-web-apps.png"
    },
    {
      title: "Marketing Design",
      description: "Campaigns that look like they came from one brand. Landing pages, ad creative, and social that stays recognisable at a glance.",
      icon: "/images/service-marketing-design.png"
    },
    {
      title: "Websites",
      description: "Fast, clear, and built to convert. A site that explains what you do and makes the next step feel obvious.",
      icon: "/images/service-websites.png"
    },
    {
      title: "UI/UX Design",
      description: "Make the complicated feel obvious. Research, user flows, and interfaces designed around the people who open them daily.",
      icon: "/images/service-ux.png"
    },
    {
      title: "E-commerce",
      description: "Stores built to sell. Product pages that answer the real objections, checkout that doesn’t lose the cart, stock that stays honest.",
      icon: "/images/service-ecommerce.png"
    },
    {
      title: "Automation",
      description: "Connect the tools, remove the copy-paste, and let predictable work happen without anyone remembering to chase it.",
      icon: "/images/service-automation.png"
    }
  ] satisfies Service[],
  capabilities: [
    {
      title: "Operations",
      eyebrow: "Make the everyday lighter",
      description:
        "We follow the work through its approvals, handoffs and half-remembered rules, then design a shorter path that your team doesn’t need reminding to follow.",
      bullets: ["Cut the repeat work", "Make ownership obvious", "See progress without asking"],
      accent: "lime"
    },
    {
      title: "Growth",
      eyebrow: "Turn interest into revenue",
      description:
        "Good leads cool off in the gap between curiosity and a reply. We close that gap with a site that answers the real questions and follow-up that doesn’t depend on anyone remembering.",
      bullets: ["Get found for what you sell", "Reply while it still matters", "Know which effort pays"],
      accent: "cobalt"
    },
    {
      title: "Customer experience",
      eyebrow: "Keep the promise you sold",
      description:
        "Delivery should feel like the pitch. We build systems that carry context between teams, so customers stop repeating themselves and your people stop apologising for it.",
      bullets: ["Carry context across teams", "Answer before they chase", "Stay personal as you scale"],
      accent: "mist"
    }
  ] satisfies Capability[],
  process: [
    {
      time: "Week 1",
      title: "Map the real process",
      description: "Not the diagram on the wall. The actual one, with every workaround and copy-paste."
    },
    {
      time: "Week 2",
      title: "Put it in real hands",
      description: "A working prototype on your own workflow, used by the people who do the job daily."
    },
    {
      time: "Week 6",
      title: "Keep what earns it",
      description: "We build on what your team adopts and cut what they route around. Unused is not saved."
    }
  ] satisfies TimeMoment[],
  metrics: [
    {
      from: 29,
      label: "Products shipped",
      note: "Live software in daily use, not a portfolio pile.",
      value: 38
    },
    {
      from: 1,
      label: "Years in business",
      note: "Same founding team since 2022.",
      value: 4
    },
    {
      from: 14,
      label: "Days to a working version",
      note: "Median across our last ten builds.",
      value: 21
    },
    {
      from: 76,
      label: "Clients who come back",
      note: "Across every engagement we have run.",
      suffix: "%",
      value: 92
    }
  ] satisfies Metric[],
  approach: [
    {
      eyebrow: "Start with the problem",
      title: "The first conversation does the heavy lifting.",
      description: "We ask what is actually going wrong, who it costs, and what it would look like if it worked. You leave with a clear scope, a realistic range, and an honest opinion, including the one where you don’t need us yet.",
      image: {
        src: "/images/process-drag.webp",
        alt: "A fine thread connecting stacked paper slabs on a dark tabletop"
      }
    },
    {
      eyebrow: "Make it real early",
      title: "See it before we build it.",
      description: "Screens, flows, and a clickable prototype come before the code. You react to something real while a change still costs an afternoon instead of a sprint.",
      image: {
        src: "/images/process-shape.webp",
        alt: "Stone, cobalt, and glass layers connected by a bright line"
      }
    },
    {
      eyebrow: "Ship, then keep going",
      title: "Launch is the start of the useful part.",
      description: "We release in pieces you can use as they land, then stay close and watch how the thing is really used. The parts that earn attention get more of it.",
      image: {
        src: "/images/process-flow.webp",
        alt: "An open path between sculptural dark and cobalt panels"
      }
    }
  ],
  statement: "The software your business runs on should feel like it was built for your business.",
  faq: [
    {
      question: "What does a project like this cost?",
      answer:
        "You get a real range in the first conversation, not after three meetings and a proposal. The number moves with scope, so we would rather shape the scope with you than quote a guess. If the budget and the idea don’t match, we say so early."
    },
    {
      question: "How quickly can we see something working?",
      answer:
        "A clickable prototype in the first couple of weeks, and something real enough to put in front of users usually inside a month. We release in pieces, so you are never waiting on one big reveal at the end."
    },
    {
      question: "We already have a site and a developer. Can you still help?",
      answer:
        "Often that is the easier job. We take over existing builds, work alongside an in-house team, or handle one specific piece of it. If the honest answer is to keep what you have, you will hear that instead of a pitch."
    },
    {
      question: "Who owns the code and the accounts?",
      answer:
        "You do, from day one. Repositories, hosting, domains and analytics stay in your name. If you ever decide to move on, you take everything with you and nothing quietly stops working."
    },
    {
      question: "What happens after launch?",
      answer:
        "We stay. Hosting, monitoring, small fixes and the occasional bigger idea, as a monthly arrangement or simply when you need us. Nothing is finished the week it goes live."
    },
    {
      question: "How do you handle our data?",
      answer:
        "We collect the minimum, keep access narrow, and write down who can see what. Anything involving customer data or AI gets its rules agreed in writing before a line of it is built."
    }
  ] satisfies FaqItem[],
  contact: {
    eyebrow: "First contact",
    title: "Tell us what you’re building.",
    description:
      "Describe what you are trying to build or fix. You will get a real person, a straight answer, and a next step within a day."
  }
};
