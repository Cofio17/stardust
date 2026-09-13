export type Accent = "lime" | "cobalt" | "mist" | "porcelain";

export type Service = {
  title: string;
  description: string;
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
    { label: "What we solve", href: "#what-we-solve" },
    { label: "How we work", href: "#how-we-work" },
    { label: "Questions", href: "#questions" }
  ],
  hero: {
    /* Three display lines. Only the middle one swaps — it names the problem,
       which changes per client, while the promise around it stays fixed. */
    titleLead: "Good ideas stall on the",
    titleTail: "We put them in orbit.",
    messages: ["whiteboard", "launchpad", "shelf"],
    description:
      "We stay on it until your team opens it every morning without being asked.",
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
  marquee: ["Less busywork", "Clearer decisions", "Faster handoffs", "Better service"],
  builtFor: {
    title: "Built for real problems.",
    description: [
      "We like software that has a reason to exist. Sometimes that means building a completely new product. Sometimes it means replacing a process that should have been automated years ago.",
      "Whatever the starting point, we focus on making technology useful, understandable and genuinely valuable to the people using it."
    ],
    cards: [
      {
        number: "01",
        title: "From scratch",
        description:
          "Have an idea that doesn’t fit inside an existing tool? We can take it from an early concept to a complete, working product."
      },
      {
        number: "02",
        title: "Made to fit",
        description:
          "Your business shouldn’t have to change just to accommodate software. We build custom systems around the way you actually work."
      },
      {
        number: "03",
        title: "Our own ideas",
        description:
          "We don’t only build for clients. We create and develop our own products too — giving us firsthand experience of what it takes to turn an idea into something people use."
      },
      {
        number: "04",
        title: "Less busywork",
        description:
          "Good software should remove work, not create more of it. We automate repetitive processes and connect the pieces that shouldn’t require manual effort."
      }
    ]
  },
  services: [
    {
      title: "SEO Services",
      description: "Get found by the right people. Technical SEO, useful content, and a clear search strategy that brings qualified traffic to your site."
    },
    {
      title: "AI Solutions",
      description: "Put AI to practical use. Custom assistants, smarter search, and tools that turn your business knowledge into everyday help."
    },
    {
      title: "Full Web Apps",
      description: "From first sketch to a working product. We build custom platforms, customer portals, and business tools around the way you work."
    },
    {
      title: "Marketing Design",
      description: "Give your next campaign a clear visual voice. Landing pages, ad creative, and social content that feel like your brand."
    },
    {
      title: "Websites",
      description: "A better home for your business. Fast, thoughtful websites that tell your story clearly and make the next step feel natural."
    },
    {
      title: "UI/UX Design",
      description: "Make complex things feel simple. Research, user flows, and interfaces designed around the people who use your product."
    },
    {
      title: "E-commerce",
      description: "Turn browsing into buying. Online stores with considered product pages, smooth checkout, and the integrations you need to grow."
    },
    {
      title: "Automation",
      description: "Give repetitive work a quieter role. We connect your tools, simplify handoffs, and build workflows that keep things moving."
    }
  ] satisfies Service[],
  capabilities: [
    {
      title: "Operations",
      eyebrow: "Make the everyday lighter",
      description:
        "We find the handoffs, approvals, and repeatable decisions that quietly drain momentum — then shape a cleaner path through them.",
      bullets: ["Reduce repeat work", "Keep ownership visible", "Make progress easier to measure"],
      accent: "lime"
    },
    {
      title: "Growth",
      eyebrow: "Turn demand into movement",
      description:
        "Your best opportunities should not wait in a queue. We help teams capture intent, coordinate next steps, and keep good work moving.",
      bullets: ["Respond with useful context", "Shorten the distance to action", "Give teams more room to think"],
      accent: "cobalt"
    },
    {
      title: "Customer experience",
      eyebrow: "Make every interaction feel joined up",
      description:
        "From the first question to the final follow-up, we create systems that make service more consistent without making it less human.",
      bullets: ["Create calmer service journeys", "Carry context across teams", "Improve the moments customers remember"],
      accent: "mist"
    }
  ] satisfies Capability[],
  process: [
    {
      time: "Week 1",
      title: "Map the real process",
      description: "Not the diagram on the wall — the actual one, with every workaround and copy-paste."
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
      from: 51,
      label: "Successful partnerships",
      note: "Teams that came back for a second build.",
      value: 64
    },
    {
      from: 9,
      label: "Years in business",
      note: "Shipping production software since 2014.",
      value: 12
    },
    {
      from: 148,
      label: "Average traffic lift",
      note: "Measured six months after launch.",
      suffix: "%",
      value: 187
    },
    {
      from: 76,
      label: "Still with us after year one",
      note: "Retention across every engagement we have run.",
      suffix: "%",
      value: 94
    }
  ] satisfies Metric[],
  approach: [
    {
      eyebrow: "Find the focus",
      title: "A clear start makes all the difference.",
      description: "Every project starts with a conversation. We get to know your business, ask the useful questions, and work out what will make the biggest difference. Together, we turn a loose idea into a plan worth building.",
      image: {
        src: "/images/process-drag.webp",
        alt: "A fine thread connecting stacked paper slabs on a dark tabletop"
      }
    },
    {
      eyebrow: "Give it shape",
      title: "Thoughtful design. Practical foundations.",
      description: "We bring the idea into view with real screens, clear flows, and working prototypes. You see how the pieces fit together early, so we can refine the details before they become expensive decisions.",
      image: {
        src: "/images/process-shape.webp",
        alt: "Stone, cobalt, and glass layers connected by a bright line"
      }
    },
    {
      eyebrow: "Build what comes next",
      title: "Ready for launch. Built for what follows.",
      description: "We build, test, and launch with the everyday experience in mind. Then we stay close, using real feedback to improve the details and help your next idea take shape.",
      image: {
        src: "/images/process-flow.webp",
        alt: "An open path between sculptural dark and cobalt panels"
      }
    }
  ],
  statement: "Your best people should not spend their best hours on repeatable work.",
  faq: [
    {
      question: "What kind of problems do you solve?",
      answer:
        "The recurring work that slows a good team down: searching for context, moving information between systems, managing handoffs, and answering the same questions again and again."
    },
    {
      question: "Do we need a fully defined AI strategy?",
      answer:
        "No. We start with a specific, observable point of friction and work outward from there. A useful first improvement is usually more valuable than a perfect plan on paper."
    },
    {
      question: "Can you work with our existing systems?",
      answer:
        "Yes. We design around the tools and habits that already matter to your teams, keeping the experience coherent while avoiding unnecessary disruption."
    },
    {
      question: "How quickly can we see something working?",
      answer:
        "Most first prototypes are shaped in days, then tested with the people closest to the work. The timeline depends on the process, but learning starts early."
    },
    {
      question: "What happens after launch?",
      answer:
        "We stay close to adoption and the signals that show whether a change is helping. Together, we refine the system until it earns its place in the daily rhythm."
    },
    {
      question: "How do you handle data and privacy?",
      answer:
        "We keep data minimization, access, and clear ownership in view from the first conversation. The right approach is shaped around your requirements and risk profile."
    }
  ] satisfies FaqItem[],
  contact: {
    eyebrow: "Start with the stuck bit",
    title: "Let’s make work move.",
    description:
      "Tell us where momentum gets lost. We’ll bring a clear point of view and a practical next step."
  }
};
