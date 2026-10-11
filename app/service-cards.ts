import type { IllustrationKind } from "./components/service-illustration-scenes";

export type ServiceCard = {
  id: string;
  title: string;
  description: string;
  label?: string;
  url?: string;
  media:
    | { type: "image"; src: string; alt: string; animation?: IllustrationKind }
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

// Each story has its own illustration in the shared studio art style.
export const serviceCards: ServiceCardSliderContent = {
  label: "Where teams usually start",
  title: "Start with what’s in the way.",
  text: "Almost every project begins with one specific frustration. These are the four we hear most.",
  link: { label: "Tell us yours", url: "#contact" },
  theme: "light",
  cards: [
    {
      id: "connected-workflows",
      title: "Get your tools talking.",
      description: "Your CRM, forms, email and calendar each hold part of the picture. We connect them so leads, bookings and updates move on their own instead of being copied by hand.",
      label: "Automation and integrations",
      url: "#contact",
      media: { type: "image", animation: "satellite", src: "/images/studio/demo-connected-tools.png", alt: "A satellite connecting order, calendar and task windows along an orbit" }
    },
    {
      id: "custom-products",
      title: "Build the tool that doesn’t exist.",
      description: "Client portals, booking systems, membership platforms. When nothing off the shelf fits, we build it around how your team works, with accounts, roles and online payments included.",
      label: "Web applications",
      media: { type: "image", animation: "tailoring", src: "/images/studio/demo-custom-fit.png", alt: "Hands tailoring a browser interface with a measuring tape and stitching" }
    },
    {
      id: "clearer-decisions",
      title: "Ask your data a question.",
      description: "An AI assistant that reads your documents and databases and answers in plain language. Search works on meaning, so nobody has to guess the exact wording. Proven on a database with a billion rows.",
      label: "AI knowledge assistant",
      media: { type: "image", animation: "clarity", src: "/images/studio/demo-clarity.png", alt: "A magnifying glass bringing scattered reports into one clear dashboard" }
    },
    {
      id: "less-repeat-work",
      title: "Let the routine run itself.",
      description: "New leads sorted with a reply drafted, support calls transcribed and flagged on the ticket, data kept clean. We automate the predictable parts and leave the judgement to your team.",
      label: "AI and automation",
      url: "#contact",
      media: { type: "image", animation: "automation", src: "/images/studio/demo-automation.png", alt: "A wind-up machine turning routine paperwork into completed tasks" }
    }
  ]
};
