import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "../components/Arrow";
import { Eyebrow } from "../components/Eyebrow";
import { ProjectVisual } from "./ProjectVisual";
import { projects } from "./projects";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore our concept projects in e-commerce, web apps, and automation. The problems, the process, and the thinking behind each solution."
};

export default function OurWorkPage() {
  return (
    <main id="top" className="work-page">
      <section className="work-intro work-shell">
        <Eyebrow variant="mono">Our Work</Eyebrow>
        <div className="work-intro-row"><h1>Good work.<br /><span>A story behind it.</span></h1><div className="work-intro-copy"><p>A closer look at the problems we untangle, the decisions we make, and the things we bring to life.</p><a href="#projects">Explore the work <Arrow direction="down" /></a></div></div>
      </section>
      <section className="work-projects work-shell" id="projects" aria-label="Project collection">
        <div className="work-section-bar"><p>SELECTED CONCEPTS <span>({String(projects.length).padStart(2, "0")})</span></p><span>A little of what’s possible.</span></div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <Link className={`project-card${index === 0 || (projects.length % 2 === 0 && index === projects.length - 1) ? " project-featured" : ""}`} href={`/our-work/${project.slug}`} key={project.slug}>
              <div className="project-cover"><ProjectVisual theme={project.theme} name={project.name} /><span className="project-open" aria-hidden="true"><Arrow /></span></div>
              <div className="project-card-info"><div><p className="project-category">{project.category}</p><h2>{project.name}<span> / {project.summary}</span></h2></div><span className="project-read">Read the story <Arrow /></span></div>
            </Link>
          ))}
        </div>
        <p className="work-demo-note">A collection of fictional demo projects, created to show our approach. Client stories will live here next.</p>
      </section>
    </main>
  );
}
