import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "../../components/Arrow";
import { notFound } from "next/navigation";
import { ProjectVisual } from "../ProjectVisual";
import { getProject, projects } from "../projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return { title: `${project.name} — ${project.title}`, description: project.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <main id="top" className="work-page case-page">
      <header className="case-header">
        <Link className="work-back" href="/our-work"><Arrow direction="left" /> All projects</Link>
        <div className="case-eyebrow"><span>{project.name} / {project.category}</span><span className="concept-label">Concept project</span></div>
        <h1>{project.title}</h1>
        <p className="case-summary">{project.summary}</p>
        <dl className="case-facts"><div><dt>PROJECT</dt><dd>{project.name}</dd></div><div><dt>SCOPE</dt><dd>{project.services.join(" / ")}</dd></div><div><dt>TIMELINE</dt><dd>{project.duration} / {project.year}</dd></div></dl>
      </header>
      <div className="case-cover work-shell"><ProjectVisual theme={project.theme} name={project.name} /></div>
      <div className="case-body">
        <aside className="case-index" aria-label="In this story"><p>IN THIS STORY</p><a href="#challenge">01 / The challenge</a><a href="#process">02 / The process</a><a href="#solution">03 / The solution</a><a href="#results">04 / The result</a><span>5 MIN READ</span></aside>
        <article className="case-article" aria-label={`${project.name} project story`}>
          <p className="case-lead">{project.intro}</p>
          <section id="challenge" className="case-section"><p className="work-kicker">01 / THE CHALLENGE</p><h2>Where we started.</h2>{project.challenge.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
          <blockquote className="case-insight"><span aria-hidden="true">“</span><p>{project.insight}</p><cite>The idea that guided the work</cite></blockquote>
          <section id="process" className="case-section"><p className="work-kicker">02 / THE PROCESS</p><h2>Making the pieces fit.</h2><div className="case-process">{project.process.map((step, index) => <div key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></div>)}</div></section>
          <figure className="case-diagram"><figcaption><span>THE SOLUTION, AT A GLANCE</span><Arrow /></figcaption><ol>{project.flow.map((step, index) => <li key={step.title}><span className="diagram-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p>{index < project.flow.length - 1 && <span className="diagram-arrow" aria-hidden="true"><Arrow direction="right" /></span>}</li>)}</ol><p className="diagram-note">One connected journey. Every step has a purpose.</p></figure>
          <section id="solution" className="case-section"><p className="work-kicker">03 / THE SOLUTION</p><h2>A clearer way forward.</h2>{project.solution.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
          <div className="case-gallery">{project.images.map((img) => <figure key={img.src}><div><Image src={img.src} alt={img.alt} width={1440} height={1080} sizes="(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 430px" /></div><figcaption>{img.caption}</figcaption></figure>)}</div>
          <section id="results" className="case-section"><p className="work-kicker">04 / THE RESULT</p><h2>What the work made possible.</h2><div className="case-outcomes">{project.outcomes.map((outcome) => <div key={outcome.value}><strong>{outcome.value}</strong><span>{outcome.label}</span></div>)}</div><p>{project.result}</p><div className="case-takeaway"><span>WHAT WE TOOK AWAY</span><p>{project.takeaway}</p></div><p className="case-concept-note">This is a fictional concept study. The project, timeline, and outcomes illustrate our approach; they are not client performance claims.</p></section>
        </article>
      </div>
      <section className="case-next work-shell" aria-label="Next project"><Link href={`/our-work/${nextProject.slug}`}><div><p className="work-kicker">UP NEXT / {nextProject.category}</p><h2>{nextProject.name}<span>{nextProject.summary}</span></h2></div><span className="next-arrow" aria-hidden="true"><Arrow /></span></Link></section>
    </main>
  );
}
