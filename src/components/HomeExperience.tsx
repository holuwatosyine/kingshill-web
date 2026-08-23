import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LogoImage from "@/assets/kingshill-logo-official.webp";
import CommunityImage from "@/assets/img-20250827-wa0023.jpg";
import LeadersImage from "@/assets/img-20250827-wa0020-1.jpg";
import LiquidButton from "@/components/effects/LiquidButton";
import InteractiveImage from "@/components/effects/InteractiveImage";
import FooterWordmarkScene from "@/components/effects/FooterWordmarkScene";
import TestimonialShaderBackground from "@/components/effects/TestimonialShaderBackground";
import { experienceState } from "@/experience/state";
import "@/components/HomeExperience.css";

const ClarityWaterScene = lazy(() => import("@/components/effects/ClarityWaterScene"));
const CloudPrelude = lazy(() => import("@/experience/CloudPrelude"));
const LusionConnectors = lazy(() => import("@/components/effects/LusionConnectors"));

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
    quote: "Training with Kingshill School of Discovery was the springboard to transforming my career. The practical approach and expert guidance helped me build a successful coaching practice that has impacted over 200 clients.",
  },
  {
    name: "Emeka Chibueze",
    role: "Corporate Trainer",
    quote: "The NLP training program at Kingshill exceeded my expectations. The skills I learned have enhanced my professional capabilities, personal relationships and leadership style.",
  },
  {
    name: "Fatima Ibrahim",
    role: "Youth Development Specialist",
    quote: "The Youth Coaching Program gave me the tools and confidence to make a real impact in young people's lives. I've since launched a youth empowerment organization that has reached over 500 young Nigerians.",
  },
];

const HomeExperience = () => {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [activeProgramme, setActiveProgramme] = useState(0);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || experienceState.reducedMotion) return;
    let frame = 0;
    const move = () => {
      page.style.setProperty("--home-pointer-x", String(experienceState.pointer.smoothNdcX));
      page.style.setProperty("--home-pointer-y", String(experienceState.pointer.smoothNdcY));
      page.style.setProperty("--home-pointer-speed", String(experienceState.pointer.smoothSpeed));
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    let frame = 0;
    const updateProgress = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      page.style.setProperty("--page-progress", `${Math.min(window.scrollY / maxScroll, 1)}`);
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
      <Suspense fallback={<div className="kh-cloud-prelude" aria-hidden="true" />}>
        <CloudPrelude />
      </Suspense>

      <section id="opening" className="kh2-hero kh-hero--clarity" aria-labelledby="home-title">
        <Suspense
          fallback={(
            <div className="kh-clarity-scene" aria-hidden="true">
              <div className="kh-clarity-scene__fallback" />
            </div>
          )}
        >
          <ClarityWaterScene />
        </Suspense>
        <div className="kh2-hero__grade" aria-hidden="true" />
        <div className="kh2-shell kh2-hero__layout">
          <div className="kh2-eyebrow kh2-hero__eyebrow">
            <span>01</span>
            <p>Nigeria’s first registered coaching academy</p>
          </div>

          <h1 id="home-title" className="kh2-hero__title">
            <span>Discover purpose.</span>
            <span>Discover life.</span>
          </h1>
          <div className="kh2-hero__reflection" aria-hidden="true">
            <span>Discover purpose.</span>
            <span>Discover life.</span>
          </div>

          <div className="kh2-hero__intro">
            <p>At KingsHill, We Unlock Potential. We Raise Builders and Reformers.</p>
            <div className="kh2-actions">
              <LiquidButton className="kh2-button kh2-button--gold" to="/training">
                Explore programmes <span aria-hidden="true">↗</span>
              </LiquidButton>
              <a className="kh2-text-link" href="#perspective">
                Meet Kingshill <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="kh2-hero__foot">
            <span>CCC accredited</span>
            <span>Lagos · Since 1999</span>
            <span className="kh2-hero__gesture">Life Transformation &amp; Social Development</span>
          </div>
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
              <figcaption>We Make You See The Future and Secure it.</figcaption>
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
                  onMouseEnter={() => setActiveProgramme(index)}
                  onFocus={() => setActiveProgramme(index)}
                  aria-label={`Explore ${programme.title}`}
                >
                  <span className="kh2-programme__number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="kh2-programme__content">
                    <strong>{programme.title}</strong>
                    <span>{programme.copy}</span>
                  </span>
                  <span className="kh2-programme__meta">{programme.meta}</span>
                  <span className="kh2-programme__arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>

            <div className="kh2-programmes__visual" data-reveal="drift" aria-live="polite">
              <InteractiveImage
                key={programmes[activeProgramme].image}
                src={programmes[activeProgramme].image}
                alt={`${programmes[activeProgramme].title} at Kingshill`}
                className="kh2-programmes__image"
              >
                <div className="kh2-programmes__caption">
                  <span>Training program</span>
                  <strong>{programmes[activeProgramme].title}</strong>
                </div>
              </InteractiveImage>
            </div>
          </div>
        </div>
      </section>

      <section id="connectors" className="kh2-connectors" aria-label="Interactive connector field">
        <Suspense fallback={<div className="kh-lusion-connectors" aria-hidden="true" />}>
          <LusionConnectors />
        </Suspense>
      </section>

      <section id="contact" className="kh2-finale" aria-label="Kingshill alumni and contact information">
        <div className="kh2-section kh2-proof">
          <TestimonialShaderBackground />
          <div className="kh2-shell">
            <div className="kh2-section-head" data-reveal="clip">
              <div className="kh2-eyebrow kh2-eyebrow--dark"><span>05</span><p>Kingshill Alumni</p></div>
              <h2>Meet some of our 1000+ graduates</h2>
            </div>
            <div className="kh2-testimonials" data-reveal="focus">
              {testimonials.map((testimonial, index) => (
                <article key={testimonial.name} className="kh2-testimonial" data-cursor="text">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <blockquote>“{testimonial.quote}”</blockquote>
                  <footer><strong>{testimonial.name}</strong><small>{testimonial.role}</small></footer>
                </article>
              ))}
            </div>
            <div className="kh2-proof__gallery" data-reveal="drift">
              <figure className="kh2-proof__main-image"><InteractiveImage src={CommunityImage} alt="Participants gathered for a Kingshill-supported learning session" /></figure>
              <figure className="kh2-proof__side-image"><InteractiveImage src={LeadersImage} alt="Leaders at a Kingshill partner event in Nigeria" /></figure>
              <p>We love keeping in touch with our students after they have graduated and celebrating their success stories and transformative journeys.</p>
            </div>
            <div className="kh2-stats" data-reveal="rise">
              <div><strong>25+</strong><span>Years of Excellence</span></div>
              <div><strong>1,000+</strong><span>Graduates</span></div>
              <div><strong>CCC</strong><span>Accredited</span></div>
            </div>
          </div>
        </div>
        <div className="kh2-footer-zone">
          <div className="kh2-shell">
          <div className="kh2-contact-grid">
            <div>
              <span className="kh2-contact-grid__label">Visit</span>
              <address>14 Adedotun Dina Street<br />Mende–Maryland, Lagos</address>
            </div>
            <div>
              <span className="kh2-contact-grid__label">Talk</span>
              <a href="tel:+2349090550072">+234 909 055 0072</a>
              <a href="tel:+2349090550073">+234 909 055 0073</a>
            </div>
            <div>
              <span className="kh2-contact-grid__label">Write</span>
              <a href="mailto:pg@thecoachingnations.com">pg@thecoachingnations.com</a>
            </div>
          </div>

          <footer className="kh2-footer">
            <Link to="/" className="kh2-footer__brand" aria-label="Kingshill School of Discovery home">
              <img src={LogoImage} alt="" />
              <span><strong>Kingshill</strong><small>School of Discovery</small></span>
            </Link>
            <nav aria-label="Footer navigation">
              <Link to="/about">About</Link>
              <Link to="/training">Training</Link>
              <Link to="/faculty">Faculty</Link>
              <Link to="/contact">Contact</Link>
            </nav>
            <p>© 2026 Kingshill School of Discovery</p>
          </footer>
          <FooterWordmarkScene />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeExperience;
