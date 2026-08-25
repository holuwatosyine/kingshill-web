import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LiquidButton from "@/components/effects/LiquidButton";
import InteractiveImage from "@/components/effects/InteractiveImage";
import useBrandGlassShine from "@/components/effects/useBrandGlassShine";
import LogoImage from "@/assets/kingshill-logo-official.webp";
const FooterWordmarkScene = lazy(() => import("@/components/effects/FooterWordmarkScene"));
const FooterShaderBackground = lazy(() => import("@/components/effects/FooterShaderBackground"));
const TestimonialShaderBackground = lazy(() => import("@/components/effects/TestimonialShaderBackground"));
import { experienceState } from "@/experience/state";
import "@/components/HomeExperience.css";

const LusionHero = lazy(() => import("@/components/effects/LusionHero"));
const KingshillPassage = lazy(() => import("@/components/effects/KingshillPassage"));

const programmes = [
  {
    title: "Life Coaching Certification",
    copy: "The foundation of all our training — our professionally accredited life coaching certification programme with international recognition.",
    meta: "20+ designations",
    image: "/kingshill-course-feature.jpg",
  },
  {
    title: "NLP Training Program",
    copy: "Neuro-Linguistic Programming certification designed to teach advanced communication and influence techniques.",
    meta: "Professional",
    image: "/IMG-20250827-WA0022.webp",
  },
  {
    title: "Corporate Coaching Program",
    copy: "Specialized training for coaching larger corporates, their teams, and organizational development.",
    meta: "Enterprise",
    image: "/IMG-20250827-WA0020.webp",
  },
  {
    title: "Transitional Youth Coaching Program",
    copy: "Specialized program designed for coaching young professionals and students.",
    meta: "Youth focused",
    image: "/IMG-20250821-WA0003.webp",
  },
];

const testimonials = [
  {
    name: "Adunni Okonkwo",
    role: "Life Coach & Entrepreneur",
    quote: "Kingshill gave me the practical clarity to build a coaching practice that now reaches more than 200 clients.",
  },
  {
    name: "Emeka Chibueze",
    role: "Corporate Trainer",
    quote: "NLP training sharpened how I lead, communicate, and work with people.",
  },
  {
    name: "Fatima Ibrahim",
    role: "Youth Development Specialist",
    quote: "Youth coaching gave me the confidence and tools to build an organisation for young Nigerians.",
  },
];

const HomeExperience = () => {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useBrandGlassShine();
  const [activeProgramme, setActiveProgramme] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    let frame = 0;
    const updateProgress = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const pageProgress = Math.min(window.scrollY / maxScroll, 1);
      page.style.setProperty("--page-progress", `${pageProgress}`);
      const sections = Array.from(page.querySelectorAll<HTMLElement>(".kh2-section, .kh2-footer-zone"));
      let activeSectionIndex = 0;
      let activeLocal = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const local = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / Math.max(window.innerHeight + rect.height, 1)));
        section.style.setProperty("--section-progress", local.toFixed(4));
        if (rect.top <= window.innerHeight * 0.56) { activeSectionIndex = index; activeLocal = local; }
      });
      const chapters = ["HERO", "DISCOVERY", "PATHWAYS", "PROOF", "EPILOGUE"] as const;
      const chapterIndex = experienceState.entered ? Math.min(chapters.length - 1, activeSectionIndex) : 0;
      const chapter = experienceState.entered ? chapters[chapterIndex] : "ENTRY";
      const chapterEnergy = Math.min(1, Math.abs(experienceState.scroll.velocity) / 120 + experienceState.pointer.smoothSpeed * 0.25);
      experienceState.setChapter(chapter, activeLocal, Math.min(1, Math.abs(0.5 - activeLocal) * 2), chapterEnergy);
      page.style.setProperty("--chapter-progress", String(experienceState.chapter.progress));
      page.style.setProperty("--chapter-energy", String(experienceState.chapter.energy));
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={pageRef} className="kh2-page">
      <Suspense fallback={null}>
        <KingshillPassage />
      </Suspense>

            <section id="opening" className="kh2-hero kh2-hero--lusion" aria-labelledby="home-title">
        <div className="kh-lusion-hero__shell">
          <div className="kh-lusion-hero__eyebrow"><span>01</span><p>Nigeria&apos;s first registered coaching academy</p></div>
          <div className="kh-lusion-hero__caption">We create people who see further,<br />lead with purpose, and build what matters.</div>
          <div className="kh-lusion-hero__scene">
            <Suspense fallback={<div className="kh-lusion-hero__scene-fallback" aria-hidden="true" />}>
              <LusionHero />
            </Suspense>
          </div>
          <div className="kh-lusion-hero__bottom">
            <h1 id="home-title"><span>Discover purpose.</span><span>Discover life.</span></h1>
            <div className="kh-lusion-hero__statement">
              <p>At KingsHill, We Unlock Potential. We Raise Builders and Reformers.</p>
              <div className="kh2-actions">
                <LiquidButton className="kh2-button kh2-button--gold" to="/training">Explore programmes <span aria-hidden="true">↗</span></LiquidButton>
                <a className="kh2-text-link kh2-text-link--dark" href="#perspective">Meet Kingshill <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </div>
          <div className="kh-lusion-hero__foot"><span>CCC accredited</span><span>Lagos · Since 1999</span><span>Life Transformation &amp; Social Development</span></div>
        </div>
      </section>

      <section id="perspective" className="kh2-section kh2-perspective" aria-label="About Kingshill">
        <div className="kh2-shell">
          <div className="kh2-section-head" data-reveal="clip">
            <div className="kh2-eyebrow kh2-eyebrow--dark">
              <span>02</span>
              <p>About Kingshill</p>
            </div>
          </div>

          <div className="kh2-perspective__body">
            <figure className="kh2-perspective__figure" data-reveal="drift">
              <InteractiveImage
                className="kh2-image-wrap"
                src="/IMG-20250827-WA0019.webp"
                alt="A Kingshill facilitator speaking at a professional development event"
              />
              <figcaption className="kh2-perspective__anchor" data-typography-anchor>We Make You See The Future and Secure it.</figcaption>
            </figure>

            <div className="kh2-perspective__copy" data-reveal="rise">
              <p className="kh2-lead">
                At KingsHill, We Unlock Potential. We Raise Builders and Reformers.
              </p>
              <p>
                At Kingshill Coaching Academy, we believe in the power of human potential. Founded as Nigeria's first
                registered coaching academy, we have been pioneering excellence in coaching education for over two decades.
              </p>
              <Link className="kh2-text-link kh2-text-link--dark" to="/about">
                Read our story <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div className="kh2-principles" data-reveal="focus" aria-label="Kingshill focus">
            <div><span>01</span><strong>Peak Performance</strong><p>Unlock human potential</p></div>
            <div><span>02</span><strong>Productivity</strong><p>Achieve organizational goals</p></div>
            <div><span>03</span><strong>Excellence</strong><p>Maintain highest standards</p></div>
          </div>
        </div>
      </section>

      <section id="programmes" className="kh2-section kh2-programmes" aria-labelledby="programmes-title">
        <div className="kh2-shell">
          <div className="kh2-section-head kh2-section-head--light" data-reveal="clip">
            <div className="kh2-eyebrow">
              <span>03</span>
              <p>Training programs</p>
            </div>
            <h2 id="programmes-title">Our diplomas and programmes</h2>
          </div>

          <div className="kh2-programmes__grid">
            <div className="kh2-programmes__list" data-reveal="rise">
              {programmes.map((programme, index) => (
                <Link
                  key={programme.title}
                  to="/training"
                  className={`kh2-programme ${activeProgramme === index ? "is-active" : ""}`}
                  style={{ "--programme-distance": Math.abs(index - activeProgramme) } as React.CSSProperties}
                  onMouseEnter={() => setActiveProgramme(index)}
                  onFocus={() => setActiveProgramme(index)}
                  aria-label={`Explore ${programme.title}`}
                >
                  <span className="kh2-programme__number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="kh2-programme__content">
                    <strong>{programme.title}</strong>
                    <span>{programme.copy}</span>
                  </span>
                  <span className="kh2-programme__arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>

            <div className="kh2-programmes__signal" data-brand-glass data-reveal="drift" aria-live="polite" style={{ "--program-angle": `${activeProgramme * 90}deg` } as React.CSSProperties}>
              <div className="kh2-programmes__signal-index"><strong>{String(activeProgramme + 1).padStart(2, "0")}</strong></div>
              <div className="kh2-programmes__signal-copy"><h3>{programmes[activeProgramme].title}</h3><p>{programmes[activeProgramme].copy}</p><Link to="/training" className="kh2-programmes__signal-link">View programme <span aria-hidden="true">↗</span></Link></div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="kh2-finale" aria-label="Kingshill client stories and academy details">
        <div className="kh2-section kh2-proof">
          <Suspense fallback={null}><TestimonialShaderBackground /></Suspense>
          <div className="kh2-shell">
            <div className="kh2-proof-intro" data-reveal="clip">
              <div className="kh2-eyebrow kh2-eyebrow--dark"><span>04</span><p>Client stories</p></div>
              <h2>What changes<br /><em>after Kingshill.</em></h2>
            </div>
            <div className="kh2-client-signal" data-reveal="focus">
              <div className="kh2-client-signal__lead" data-cursor="text">
                <div className="kh2-client-signal__lead-top"><span>{String(activeTestimonial + 1).padStart(2, "0")}</span><span>Kingshill outcome</span></div>
                <blockquote>“{testimonials[activeTestimonial].quote}”</blockquote>
                <footer><strong>{testimonials[activeTestimonial].name}</strong><small>{testimonials[activeTestimonial].role}</small></footer>
              </div>
              <div className="kh2-client-signal__archive">
                <div className="kh2-client-signal__archive-label"><span>Inside the work</span><i aria-hidden="true">↗</i></div>
                <div className="kh2-client-signal__choices" role="list">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.name}
                      type="button"
                      className={`kh2-client-record ${activeTestimonial === index ? "is-active" : ""}`}
                      data-cursor="text"
                      onClick={() => setActiveTestimonial(index)}
                      onFocus={() => setActiveTestimonial(index)}
                      aria-pressed={activeTestimonial === index}
                      role="listitem"
                    >
                      <span className="kh2-client-record__top"><span>{String(index + 1).padStart(2, "0")}</span><span>{testimonial.role}</span></span>
                      <strong>{testimonial.name}</strong>
                      <span aria-hidden="true">↗</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="kh2-stats" data-reveal="rise">
              <div><strong>25+</strong><span>Years of Excellence</span></div>
              <div><strong>1,000+</strong><span>People reached</span></div>
              <div><strong>CCC</strong><span>Accredited</span></div>
            </div>
          </div>
        </div>
        <footer className="kh2-footer-zone">
          <Suspense fallback={null}><FooterShaderBackground /></Suspense>
          <div className="kh2-shell">
            <div className="kh2-footer__masthead">
              <div className="kh2-footer__identity">
                <span className="kh2-footer__utility-label">Kingshill / Lagos</span>
                <div className="kh2-footer__closing">
                  <h2 className="kh2-footer__closing-fallback">See further.<br /><em>Lead with purpose.</em></h2>
                </div>
                <p>Coaching education for people, teams, and organisations ready to move with clarity.</p>
              </div>
              <div className="kh2-footer__signature" aria-hidden="true"><Suspense fallback={null}><FooterWordmarkScene /></Suspense></div>
            </div>

            <div className="kh2-footer__directory" data-brand-glass>
              <div className="kh2-footer__directory-column kh2-footer__directory-column--programmes">
                <span className="kh2-footer__utility-label">Our programmes</span>
                {programmes.map((programme) => <Link key={programme.title} to="/training">{programme.title}</Link>)}
              </div>
              <div className="kh2-footer__directory-column">
                <span className="kh2-footer__utility-label">Contact us</span>
                <address>14 Adedotun Dina Street<br />Mende–Maryland, Lagos</address>
                <a href="tel:+2349090550072">+234 909 055 0072</a>
                <a href="tel:+2349090550073">+234 909 055 0073</a>
                <a href="mailto:pg@thecoachingnations.com">pg@thecoachingnations.com</a>
              </div>
              <div className="kh2-footer__directory-column kh2-footer__directory-column--social">
                <span className="kh2-footer__utility-label">Follow Kingshill</span>
                <a href="https://facebook.com/kingshillcoaching" target="_blank" rel="noreferrer">Facebook <span aria-hidden="true">↗</span></a>
                <a href="https://instagram.com/kingshillcoaching" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
                <a href="https://linkedin.com/company/kingshillcoaching" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
              </div>
            </div>

            <div className="kh2-footer__base">
              <span>Nigeria&apos;s first registered coaching academy</span>
              <span>CCC accredited</span>
              <span>Lagos · Since 1999</span>
              <span>Life Transformation &amp; Social Development</span>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default HomeExperience;
