import React, { useEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ClarityWaterScene from "@/components/effects/ClarityWaterScene";

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const pointScene = (clientX: number, clientY: number) => {
      targetX = (clientX / window.innerWidth - 0.5) * 2;
      targetY = (clientY / window.innerHeight - 0.5) * 2;
    };

    const onPointerMove = (event: PointerEvent) => pointScene(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) pointScene(touch.clientX, touch.clientY);
    };

    const render = (time: number) => {
      currentX += (targetX - currentX) * 0.035;
      currentY += (targetY - currentY) * 0.035;
      const driftX = Math.sin(time * 0.00011) * 0.42;
      const driftY = Math.cos(time * 0.000085) * 0.32;
      const scroll = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);

      hero.style.setProperty("--scene-x", `${(currentX + driftX) * 0.72}%`);
      hero.style.setProperty("--scene-y", `${(currentY + driftY) * 0.55}%`);
      hero.style.setProperty("--copy-x", `${currentX * -5}px`);
      hero.style.setProperty("--copy-y", `${currentY * -3 - scroll * 34}px`);
      hero.style.setProperty("--hero-scroll", scroll.toString());
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <section ref={heroRef} className="kh-hero kh-hero--clarity" aria-labelledby="hero-title">
      <ClarityWaterScene />
      <div className="kh-hero__clarity-grade" aria-hidden="true" />

      <div className="kh-hero__grid">
        <div className="kh-hero__kicker">
          <span>01</span>
          <span>Nigeria's first registered coaching academy</span>
        </div>

        <h1 id="hero-title" className="kh-hero__title">
          <span>Discover</span>
          <span className="kh-hero__title-indent">purpose.</span>
          <span className="kh-hero__title-outline">Discover life.</span>
        </h1>

        <div className="kh-hero__statement">
          <p>
            We develop people who transform lives, organisations and communities.
          </p>
          <Link to="/training" className="kh-hero__link">
            Explore programmes
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <a href="#programmes" className="kh-hero__scroll" aria-label="Scroll to discover more">
          <span>Scroll to discover</span>
          <ArrowDownRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
