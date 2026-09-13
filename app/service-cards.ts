export type ServiceCard = {
  id: string;
  title: string;
  description: string;
  label?: string;
  url?: string;
  media:
    | { type: "image"; src: string; alt: string }
    | { type: "video"; src: string; poster: string; alt: string };
};

export type ServiceCardSliderContent = {
  label?: string;
  title: string;
  text?: string;
  link?: { label: string; url: string };
  theme?: "light" | "dark" | "gray" | "yellow";
  cards: ServiceCard[];
};

// Local artwork already used by the site; replace these entries with CMS data as needed.
export const serviceCards: ServiceCardSliderContent = {
  label: "From friction to flow",
  title: "Make room for better work.",
  text: "A clearer process. A tool that fits. A little more room to move. Here’s where we can start.",
  link: { label: "Find your starting point", url: "#contact" },
  theme: "light",
  cards: [
    {
      id: "connected-workflows",
      title: "Connect the moving parts.",
      description: "Bring scattered tools and handoffs into a workflow your team can follow from start to finish. We connect the systems you already use, clarify who owns each step, and keep the right information moving without another round of copy and paste.",
      label: "Connect your workflow",
      url: "#contact",
      media: { type: "image", src: "/images/hero-route.webp", alt: "A thread connecting routes across layered maps" }
    },
    {
      id: "custom-products",
      title: "Build around your people.",
      description: "Shape a useful product around the way your team actually works. From the first prototype to the everyday details, we build with the people who will use it, so the finished tool feels familiar, solves a real problem, and has room to grow.",
      label: "Custom products",
      media: { type: "image", src: "/images/hero-structure.webp", alt: "Connected architectural blocks arranged into a structure" }
    },
    {
      id: "clearer-decisions",
      title: "See the next step clearly.",
      description: "Put useful information in reach, so the next decision starts with context instead of another search. We bring scattered data into a clear, practical view that helps your team spot what matters, understand what changed, and decide where to go next.",
      label: "Information with purpose",
      media: { type: "image", src: "/images/hero-clarity.webp", alt: "Translucent papers arranged into a clear path" }
    },
    {
      id: "less-repeat-work",
      title: "Let the routine run itself.",
      description: "Give your team more time for the work that needs their attention. We automate repeatable tasks, connect routine approvals, and make exceptions easy to spot, so everyday operations keep moving while your people focus on customers, decisions, and new ideas.",
      label: "Explore automation",
      url: "#contact",
      media: { type: "image", src: "/images/process-flow.webp", alt: "An abstract arrangement illustrating a connected process" }
    }
  ]
};
