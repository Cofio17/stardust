import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const path = (d, opacity = 1, transform = "") => ({ d, opacity, transform });
const polar = (radius, angle) => [400 + radius * Math.cos(angle), 400 + radius * Math.sin(angle)];
const point = p => p.map(n => n.toFixed(2)).join(" ");
const curve = (fn, count, closed = false) => Array.from({ length: count + 1 }, (_, i) => `${i ? "L" : "M"}${point(fn(i / count))}`).join(" ") + (closed ? " Z" : "");
const ellipse = "M110 400 C110 318 240 252 400 252 C560 252 690 318 690 400 C690 482 560 548 400 548 C240 548 110 482 110 400 Z";
const studies = [
  {
    id: "orbital-knot", name: "Orbitalni čvor", stroke: 16,
    heading: "Then we stay in orbit.",
    description: "Tri masivne orbite oko jednog centra. Skulpturalan znak koji povezuje ime studija sa idejom dugoročne saradnje. Moj prvi izbor za ovaj sajt.",
    fit: "Pristup / saradnja nakon lansiranja · Iscrtavanje ili rotacija",
    paths: [path(ellipse), path(ellipse, .8, "rotate(60 400 400)"), path(ellipse, .6, "rotate(120 400 400)")]
  },
  {
    id: "spiral-flow", name: "Spiralni tok", stroke: 18,
    heading: "A shorter path forward.",
    description: "Jedna neprekinuta, debela linija koja se otvara iz centra. Velika silueta i miran ritam, bez sitnih tačaka i tehničkih oznaka.",
    fit: "Proces / automatizacija · Najbolji za iscrtavanje",
    paths: [path(curve(t => polar(45 + 265 * t, -Math.PI / 2 + t * Math.PI * 5.3), 360))]
  },
  {
    id: "nested-frames", name: "Složeni okviri", stroke: 14,
    heading: "Every piece fits.",
    description: "Četiri meka kvadratna okvira, svaki malo zakrenut. Arhitektonski motiv koji prati postojeće blokove i slojeve na fotografijama sajta.",
    fit: "Usluge / razvoj proizvoda · Postepeno iscrtavanje",
    paths: [300, 237, 174, 111].map((r, i) => path(`M${400-r+40} ${400-r} H${400+r-40} Q${400+r} ${400-r} ${400+r} ${400-r+40} V${400+r-40} Q${400+r} ${400+r} ${400+r-40} ${400+r} H${400-r+40} Q${400-r} ${400+r} ${400-r} ${400+r-40} V${400-r+40} Q${400-r} ${400-r} ${400-r+40} ${400-r} Z`, 1 - i * .15, `rotate(${i * 15 - 22.5} 400 400)`))
  },
  {
    id: "quiet-turbine", name: "Tiha turbina", stroke: 18,
    heading: "Let the routine run.",
    description: "Osam širokih zakrivljenih krakova. Ima energiju pokreta i jak obris, dok veoma spora rotacija zadržava pažnju na naslovu.",
    fit: "Automatizacija / operacije · Spora rotacija",
    paths: Array.from({ length: 8 }, (_, i) => path("M435 326 C527 219 615 235 667 316 C707 378 702 472 651 529", 1 - (i % 3) * .13, `rotate(${i * 45} 400 400)`))
  },
  {
    id: "wave-rosette", name: "Talasasta rozeta", stroke: 13,
    heading: "Clarity takes shape.",
    description: "Tri koncentrične, talasaste forme. Mekši i organski kontrast strogoj tipografiji; spoljašnji obris daje veličinu, a prazan centar ostavlja vazduh.",
    fit: "Dizajn / korisničko iskustvo · Rotacija ili iscrtavanje",
    paths: [270, 200, 130].map((r, i) => path(curve(t => { const a = t * Math.PI * 2; return polar(r + (26 - i * 5) * Math.cos(a * 8), a); }, 384, true), 1 - i * .2))
  },
  {
    id: "infinite-ribbon", name: "Beskonačna traka", stroke: 16,
    heading: "Built. Then made better.",
    description: "Tri paralelne putanje formiraju nagnutu beskonačnu petlju. Najmirnija kompozicija, za široku sekciju sa tekstom i jednim diskretnim gestom sa strane.",
    fit: "Dugoročna podrška / završna poruka · Iscrtavanje",
    paths: [0, 1, 2].map(i => path(curve(t => { const a = t * Math.PI * 2; return [400 + (295 - i * 38) * Math.cos(a), 400 + (160 - i * 28) * Math.sin(a * 2)]; }, 320, true), 1 - i * .2, "rotate(-25 400 400)"))
  }
];

mkdirSync(`${root}public/images/svg-studies`, { recursive: true });
writeFileSync(`${root}app/svg-studies/studies.json`, JSON.stringify(studies, null, 2) + "\n");
for (const study of studies) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" fill="none" role="img" aria-labelledby="title"><title id="title">${study.name} — StarDust Studio</title><g stroke="currentColor" color="#1a46cc" stroke-width="${study.stroke}" stroke-linecap="round" stroke-linejoin="round">${study.paths.map(p => `<path d="${p.d}" opacity="${p.opacity}" pathLength="1"${p.transform ? ` transform="${p.transform}"` : ""}/>`).join("")}</g></svg>\n`;
  writeFileSync(`${root}public/images/svg-studies/${study.id}.svg`, svg);
}
console.log(`Generated ${studies.length} SVG studies.`);
