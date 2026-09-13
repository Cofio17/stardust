# Service card slider

Komponenta je dodata na početnu stranicu, posle `BuiltForSection`. Primeri opisuju usluge studija; ne predstavljaju izmišljene klijentske projekte. Sadržaj se menja u `app/service-cards.ts`.

## Analiza i prilagođavanje

Pregledani su Blade, SCSS i JavaScript fajlovi `case-study-card-slider` iz `C:/laragon/www/popart-cms`, kao i `abstracts`, `base.scss`, `typography.scss`, `arrow-btn`, `animated-fade`, `parallax-image` i `autoplay-video`. Izvor koristi Inter, žutu/sivu paletu, GSAP i Swiper 11 sa Mousewheel modulom, razmacima 16/32 px i prelomima 480/768/1024 px. Duplirani naslov služi smeni dva sloja pri hover animaciji. Crvena debug ivica nije preneta.

Ciljni projekat koristi Next.js App Router, React 19, globalni CSS i Tailwind 3, Outfit preko `next/font`, Motion za animacije i Lenis za skrol. Ne koristi Sass. Na zahtev korisnika dodat je Swiper 14.2.0 preko React integracije sa Mousewheel i A11y modulima. Pre implementacije pregledana je lokalna Next.js dokumentacija o client komponentama, CSS-u, slikama i videu.

| Izvor | Prilagođavanje |
| --- | --- |
| Blade/CMS polja | Tipizirani React props i zaseban fajl podataka |
| Swiper | Native CSS scroll-snap, touch scroll, Pointer Events, horizontalni točkić i Shift+točkić; bez nove zavisnosti |
| `container-sm` | Postojeći `shell`: 1440 px maksimum, odnosno 680 px ispod 900 px; leva ivica kartica prati isti razmak |
| `section-label` / Inter | Postojeći `eyebrow` / Outfit, postojeće vrednosti za veličinu slova i razmake |
| `arrow-btn` | Postojeći `button`, `button-ghost`, `button-ghost-light` i `link-arrow` |
| SCSS paleta | CSS tokeni `porcelain`, `surface`, `graphite`, `mist`, `ink-muted`, `accent` |
| `js-fade-in` | Postojeći `Reveal` za uvodni blok |
| `geo-bg-block` / `js-parallax-image` | PopArt geometrija i njena posebna GSAP zavisnost nisu potrebni; ostaju lokalne ilustracije i diskretno uvećanje medija |
| Dva naslova za hover | Jedan `h3`, uz animaciju visine detalja; isti sadržaj se otkriva fokusom |
| Video ScrollTrigger | IntersectionObserver, odloženo postavljanje `src`, pauza van vidljivog područja ili kada je dokument skriven |

## Odvojeni slojevi

- `app/components/ServiceCardSlider.tsx`: markup, semantika kartica i kontrole.
- `app/components/service-card-slider.css`: izolovane `service-card-*` klase, teme i responsive stilovi.
- `app/components/useCardSlider.ts`: navigacija, prevlačenje, točkić, praćenje pozicije i video ponašanje, uz uklanjanje listenera/observera pri unmount-u.
- `app/service-cards.ts`: tipovi i primeri sadržaja.
- `public/videos/service-structure.mp4`: raniji probni video-loop, više se ne koristi u karticama. Druga kartica koristi statičnu `hero-structure.webp` sliku, bez automatskog pomeranja kadra. Podrška komponente za video ostaje dostupna.

## Upotreba

```tsx
<ServiceCardSlider
  title="Make room for better work."
  label="From friction to flow"
  text="A clearer process. A tool that fits."
  theme="dark"
  link={{ label: "Start a project", url: "#contact" }}
  cards={serviceCards.cards}
/>
```

Teme su `light` (podrazumevana), `dark`, `gray` i `yellow`. `yellow` je blaga mešavina postojećeg amber i porcelain tokena. Polja `label`, `text`, `link` i `theme` u sekciji su opciona. Kartica zahteva stabilan `id`, `title`, `description` i `media`; `label` i `url` su opcioni. Slika koristi `{ type: "image", src, alt }`, a video `{ type: "video", src, poster, alt }`. Primeri koriste lokalne assete iz `public`; udaljene slike zahtevaju odgovarajući Next.js `images.remotePatterns` konfiguracioni unos.

Video je namenjen nemoj pozadinskoj ilustraciji kao u izvornoj komponenti. Dugme Play/Pause je izvan linka kartice. `preload="none"` i izostavljen početni `src` sprečavaju rano preuzimanje videa; poster ostaje dostupan. Sa uključenim reduced motion, video čeka ručno pokretanje i detalji kartice su odmah vidljivi. Slike koriste `next/image`, responsive `sizes`, lazy loading i async decoding.

Horizontalni točkić i Shift+točkić pomeraju kartice; običan vertikalni točkić nastavlja da skroluje stranicu kroz Lenis. Na krajevima slider pušta wheel događaje. Prevlačenje ne aktivira link. Tastatura podržava Tab, strelice, Home i End; kontrole imaju nazive, fokus, stanje disabled i live opis pozicije. Kartica bez URL-a je fokusabilan članak. Prazan niz izostavlja celu sekciju, a jedna kartica onemogućava oba navigaciona dugmeta.

## Provera

U lokalnom Chromium pregledaču proverene su širine 320, 390, 600, 768, 1000, 1440 i 1920 px, uz pregled screenshotova za telefon, tablet, desktop i teme. Provereni su hover/fokus, jedan naslov po kartici, tastatura, prevlačenje mišem i emuliranim touch gestom, mali touchpad pomaci, Shift+točkić, vertikalni skrol sa Lenis-om, 200% veličina teksta, video autoplay/pauza/ručno pokretanje, lazy i responsive slike, reduced motion, slike/video sa i bez linka, jedna kartica i prazan niz. Nije bilo runtime grešaka niti horizontalnog overflow-a stranice. Touch provera je emulacija; fizički iOS/Android uređaji nisu korišćeni.

Privremena QA ruta nije deo isporuke. Standardne projektne provere: `npm run typecheck`, `npm run lint`, `npm run build`.

Swiper koristi 1.1 karticu na telefonu, 2.1 iznad 600 px i 2.5 iznad 1000 px, sa razmacima 16/32 px. Opisi kartica su sada stalno vidljivi na svim ure?ajima, a samo dodatni CTA/label sloj ima hover animaciju. Integracija prati [Swiper React dokumentaciju](https://swiperjs.com/react).
