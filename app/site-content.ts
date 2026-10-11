import type { IllustrationKind } from "./components/service-illustration-scenes";

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
  email: "hello@starduststudio.dev",
  nav: [
    { label: "Services", href: "/#what-we-solve" },
    { label: "Our Work", href: "/our-work" },
    { label: "How we work", href: "/#how-we-work" },
    { label: "FAQ", href: "/#questions" }
  ],
  hero: {
    /* Three display lines. Only the middle one swaps, naming what we launch, so
       the rotator does real work instead of carrying a joke. Singular, because
       after "your" a plural reads as something the visitor already owns.
       "Launch" is the ordinary word for shipping a site, which is why the space
       theme lands without a pun. Single words only: the rotator slot is one grid
       cell with overflow hidden, so a two-word entry wraps and is clipped when
       the viewport is narrow. */
    titleLead: "We build your",
    titleTail: "Then we stay in orbit.",
    messages: ["website", "platform", "AI"],
    description:
      "Custom software for small and mid-sized businesses. Websites, web apps, AI and automation, built by a small team from Novi Sad, Serbia.",
    featuredWork: {
      name: "Solution Pathway Academy",
      label: "Case study",
      description: "Classes, payments and student chat on one platform.",
      href: "/our-work"
    },
    images: [
      {
        src: "/images/studio/workflow.webp",
        alt: "Teammates connecting their tools and sharing order information across screens"
      },
      {
        src: "/images/studio/custom.webp",
        alt: "A designer and client reviewing a custom scheduling app"
      },
      {
        src: "/images/studio/clarity.webp",
        alt: "A teammate finding useful information in a consolidated dashboard"
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
        "Your CRM, forms, email and calendars connected, old data cleaned up and de-duplicated, and routine work that stops depending on someone copying it by hand.",
      bullets: ["Connect the tools you already use", "Clean, de-duplicated data", "Less manual entry"],
      accent: "lime"
    },
    {
      title: "Growth",
      eyebrow: "Turn interest into revenue",
      description:
        "Every new lead sorted against your own data, with a reply drafted and ready to send. On-brand posts and ad drafts made from what you already have.",
      bullets: ["AI lead responder", "AI content generator", "Technical SEO"],
      accent: "cobalt"
    },
    {
      title: "Customer experience",
      eyebrow: "Keep the promise you sold",
      description:
        "Every support call transcribed, checked for emotion and recurring issues, and flagged on the CRM ticket, so managers see where problems are building.",
      bullets: ["AI call analysis", "AI knowledge assistant", "Client portals"],
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
      from: 0,
      label: "Rows behind our largest AI build",
      note: "A knowledge assistant kept in sync and free of duplicates.",
      suffix: "B",
      value: 1
    },
    {
      from: 80,
      label: "Fewer checking errors",
      note: "After automating pre-review checks for a scientific journal.",
      suffix: "%+",
      value: 95
    },
    {
      from: 1,
      label: "Business days to a fixed-price proposal",
      note: "Written scope, timeline and price after one free call.",
      value: 5
    },
    {
      from: 14,
      label: "Days of free fixes after launch",
      note: "Then optional monthly support, if you want it.",
      value: 30
    }
  ] satisfies Metric[],
  approach: [
    {
      eyebrow: "Start with the problem",
      title: "The first conversation does the heavy lifting.",
      description: "It starts with a free 30-minute call. We ask what is actually going wrong, what it costs you, and what it would look like if it worked, and we tell you honestly if we are not the right team.",
      detail: "Show us the website, the spreadsheet, or the process your team works around every day. We look at where people lose time and which tools already do their job well. Usually within five business days, you get a written proposal with the scope, the timeline and a fixed price.",
      takeawayTitle: "A clear starting point",
      takeaways: ["The problem and scope in plain language", "A timeline split into clear milestones", "A fixed price, agreed before work starts"],
      image: {
        animation: "conversation" as IllustrationKind,
        src: "/images/studio/demo-conversation.png",
        alt: "Speech bubbles turning a tangled process into a clear plan above an open notebook"
      }
    },
    {
      eyebrow: "Make it real early",
      title: "See it before we build it.",
      description: "We build in milestones of one to two weeks, and every milestone ends with a working demo. You react to something real while a change is still cheap, instead of waiting for one big reveal at the end.",
      detail: "Each demo covers a journey that matters: a customer booking and paying, a lead getting a drafted reply, a question answered from your own data. You try it on your own workflow, and your feedback shapes the next milestone, so nothing surprises you on launch day.",
      takeawayTitle: "Something you can actually try",
      takeaways: ["A working demo every one to two weeks", "Built and tested on your real workflow", "Feedback turned into the next milestone"],
      image: {
        animation: "prototype" as IllustrationKind,
        src: "/images/studio/demo-prototype.png",
        alt: "A hand testing a clickable tablet prototype connected to a paper wireframe"
      }
    },
    {
      eyebrow: "Ship, then keep going",
      title: "Launch is the start of the useful part.",
      description: "Launch includes deployment, a proper handover and 30 days of bug fixes at no extra cost. After that, optional monthly maintenance, updates and small improvements, whenever you need them.",
      detail: "Before launch, we check the details that make a product dependable: mobile layouts, loading speed, payments, and the connections behind them. Once the project is paid, all code, accounts and documentation belong to you, so you are never locked in to our studio.",
      takeawayTitle: "A launch with a plan behind it",
      takeaways: ["Deployment and a practical handover", "30 days of bug fixes at no extra cost", "Code, accounts and documentation that belong to you"],
      image: {
        animation: "launch" as IllustrationKind,
        src: "/images/studio/demo-launch-orbit.png",
        alt: "A browser space capsule with a support satellite staying in orbit after launch"
      }
    }
  ],
  statement: "The software your business runs on should feel like it was built for your business.",
  faq: [
    {
      question: "What does a project like this cost?",
      answer:
        "Every project gets a written scope, timeline and fixed price, usually within five business days of a free 30-minute intro call. We would rather shape the scope with you than quote a guess, and if the budget and the idea don’t match, we say so early."
    },
    {
      question: "How quickly can we see something working?",
      answer:
        "We work in milestones of one to two weeks, and each one ends with a working demo. You see real progress from the first weeks, so you are never waiting on one big reveal at the end."
    },
    {
      question: "We already have a site and a developer. Can you still help?",
      answer:
        "Yes. We regularly take over existing WordPress, PHP and JavaScript codebases, work alongside an in-house team, or handle one specific piece of it. If the honest answer is to keep what you have, you will hear that instead of a pitch."
    },
    {
      question: "Who owns the code and the accounts?",
      answer:
        "You do. Once the project is paid, all code, accounts and documentation belong to you, including prompts and infrastructure on AI projects. If you ever decide to move on, you take everything with you and nothing quietly stops working."
    },
    {
      question: "What happens after launch?",
      answer:
        "Every launch includes 30 days of bug fixes at no extra cost. After that, we can stay on for monthly maintenance, updates and small improvements, or simply when you need us. Nothing is finished the week it goes live."
    },
    {
      question: "How do you handle our data?",
      answer:
        "AI answers come from your own documents and databases, not guesswork. Where privacy matters, open models can run on your own servers so sensitive data stays in-house. And if AI is not the right tool for a task, we tell you before any work starts."
    }
  ] satisfies FaqItem[],
  contact: {
    eyebrow: "First contact",
    title: "Tell us what you need.",
    description:
      "Send a short note: the problem you want solved, the tools you use today, and your timeline. We reply within one business day and usually send a proposal within a week."
  }
};
