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
  label: "Where teams usually start",
  title: "Start with what’s in the way.",
  text: "Almost every project begins with one specific frustration. These are the four we hear most.",
  link: { label: "Tell us yours", url: "#contact" },
  theme: "light",
  cards: [
    {
      id: "connected-workflows",
      title: "Get your tools talking.",
      description: "Work slows down in the gaps: the export, the re-entry, the message asking whether something was done. We connect the systems you already pay for, make every handoff explicit, and let the right information move on its own.",
      label: "Connect your workflow",
      url: "#contact",
      media: { type: "image", src: "/images/hero-route.webp", alt: "A thread connecting routes across layered maps" }
    },
    {
      id: "custom-products",
      title: "Build the tool that doesn’t exist.",
      description: "Some work is too specific for anything you can buy. We shape a product around how your team actually operates, prove it with a working prototype early, and grow it from there instead of guessing it all up front.",
      label: "Custom products",
      media: { type: "image", src: "/images/hero-structure.webp", alt: "Connected architectural blocks arranged into a structure" }
    },
    {
      id: "clearer-decisions",
      title: "See the whole picture.",
      description: "Decisions get slow when the answer lives in four places. We pull the numbers that matter into one clear view, so your team can see what changed, what it means, and what to do next, without opening five tabs first.",
      label: "Information with purpose",
      media: { type: "image", src: "/images/hero-clarity.webp", alt: "Translucent papers arranged into a clear path" }
    },
    {
      id: "less-repeat-work",
      title: "Let the routine run itself.",
      description: "Every team has work that runs on copy, paste and reminders. We automate the predictable parts, flag the exceptions that genuinely need a person, and hand back the hours your team should be spending on customers.",
      label: "Explore automation",
      url: "#contact",
      media: { type: "image", src: "/images/process-flow.webp", alt: "An abstract arrangement illustrating a connected process" }
    }
  ]
};
