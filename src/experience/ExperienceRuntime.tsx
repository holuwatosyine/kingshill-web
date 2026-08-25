import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import ExperiencePreloader from "@/experience/ExperiencePreloader";
import FluidPointer from "@/experience/FluidPointer";
import { experienceState } from "@/experience/state";
import "@/experience/experience.css";

const subpageVertex = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const subpageFragment = `
precision highp float;varying vec2 v;uniform vec2 r;uniform vec2 m;uniform float t;uniform float s;
float orb(vec2 p,vec2 c,float radius){return radius/length(p-c);}
void main(){vec2 uv=v;vec2 p=(gl_FragCoord.xy-.5*r)/r.y;vec2 pointer=(m-.5)*vec2(r.x/r.y,1.);float drift=t*.085+s*.8;float a=orb(p,vec2(sin(drift)*.38,cos(drift*.7)*.27),.075);float b=orb(p,vec2(cos(drift*.63)*.56,sin(drift*.91)*.33),.11);float c=orb(p,vec2(-.44+sin(drift*.54)*.18,-.32+cos(drift*.8)*.12),.07);float touch=orb(p,pointer,.032);float field=a+b+c+touch*.45;vec3 deep=vec3(.018,.07,.09),teal=vec3(.08,.38,.4),gold=vec3(.68,.55,.19),mist=vec3(.77,.88,.84);vec3 col=mix(deep,teal,smoothstep(.15,1.2,field));col=mix(col,gold,smoothstep(1.1,2.4,a+c));col=mix(col,mist,smoothstep(2.4,4.2,field)*.5);float grain=fract(sin(dot(gl_FragCoord.xy+floor(t*18.),vec2(12.9898,78.233)))*43758.5453)-.5;col+=grain*.018;gl_FragColor=vec4(col,1.);}`;

const SubpageAtmosphere = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;
    const compile = (type: number, source: string) => { const shader = gl.createShader(type); if (!shader) return null; gl.shaderSource(shader, source); gl.compileShader(shader); return shader; };
    const vs = compile(gl.VERTEX_SHADER, subpageVertex); const fs = compile(gl.FRAGMENT_SHADER, subpageFragment); if (!vs || !fs) return;
    const program = gl.createProgram(); if (!program) return; gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p"); const resolution = gl.getUniformLocation(program, "r"); const mouse = gl.getUniformLocation(program, "m"); const time = gl.getUniformLocation(program, "t"); const scroll = gl.getUniformLocation(program, "s");
    gl.useProgram(program); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, (experienceState.quality === "high" ? 1.35 : 1) * experienceState.renderScale); canvas.width = Math.max(1, Math.round(innerWidth*dpr)); canvas.height = Math.max(1, Math.round(innerHeight*dpr)); gl.viewport(0,0,canvas.width,canvas.height); };
    let frame = 0;
    let visible = true;
    let documentVisible = !document.hidden;
    const started = performance.now();
    const draw = (now: number) => {
      frame = 0;
      if (!visible || !documentVisible) return;
      gl.uniform2f(resolution,canvas.width,canvas.height);
      gl.uniform2f(mouse,experienceState.pointer.clientX/Math.max(1,innerWidth),1-experienceState.pointer.clientY/Math.max(1,innerHeight));
      gl.uniform1f(time,(now-started)/1000);
      gl.uniform1f(scroll,experienceState.scroll.progress);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      frame=requestAnimationFrame(draw);
    };
    const syncLoop = () => {
      if (!visible || !documentVisible) { if (frame) cancelAnimationFrame(frame); frame = 0; }
      else if (!frame) frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncLoop(); }, { threshold: 0.01 });
    const onVisibility = () => { documentVisible = !document.hidden; syncLoop(); };
    observer.observe(canvas);
    addEventListener("resize",resize,{passive:true});
    addEventListener("kingshill:render-scale",resize);
    document.addEventListener("visibilitychange",onVisibility);
    resize();
    frame=requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener("resize",resize); removeEventListener("kingshill:render-scale",resize); document.removeEventListener("visibilitychange",onVisibility); if(buffer)gl.deleteBuffer(buffer); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteProgram(program); };
  }, []);
  return <canvas ref={ref} className="kh-subpage-atmosphere" aria-hidden="true" />;
};

const ExperienceRuntime = () => {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const tracked = new Map<HTMLCanvasElement, { lost: EventListener; restored: EventListener }>();
    const scan = () => {
      document.querySelectorAll<HTMLCanvasElement>("canvas").forEach((canvas) => {
        if (tracked.has(canvas)) return;
        const lost: EventListener = (event) => {
          event.preventDefault();
          window.dispatchEvent(new CustomEvent("kingshill:webgl-context-lost", { detail: { canvas } }));
          if (import.meta.env.DEV) console.warn("[Kingshill] WebGL context lost", canvas);
        };
        const restored: EventListener = () => {
          window.dispatchEvent(new CustomEvent("kingshill:webgl-context-restored", { detail: { canvas } }));
          if (import.meta.env.DEV) console.info("[Kingshill] WebGL context restored", canvas);
        };
        canvas.addEventListener("webglcontextlost", lost, { passive: false });
        canvas.addEventListener("webglcontextrestored", restored);
        tracked.set(canvas, { lost, restored });
      });
    };
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      tracked.forEach((handlers, canvas) => {
        canvas.removeEventListener("webglcontextlost", handlers.lost);
        canvas.removeEventListener("webglcontextrestored", handlers.restored);
      });
      tracked.clear();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    let previous = performance.now();
    let activeType: HTMLElement | null = null;
    let activeAction: HTMLElement | null = null;
    let activeImage: HTMLElement | null = null;
    let touchLastX = 0;
    let touchLastY = 0;
    const supportsPointerEvents = "PointerEvent" in window;
    let documentVisible = !document.hidden;
    const reducedMotion = experienceState.reducedMotion;
    const lenis = reducedMotion
      ? null
      : new Lenis({
          smoothWheel: true,
          syncTouch: true,
          lerp: 0.075,
          wheelMultiplier: 0.82,
          touchMultiplier: 1.05,
          syncTouchLerp: 0.09,
        });
    lenisRef.current = lenis;

    const updateScrollState = (event?: { scroll: number; limit: number; velocity: number; direction: number }) => {
      const scroll = event?.scroll ?? window.scrollY;
      const limit = event?.limit ?? Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      experienceState.setScroll(scroll, scroll / Math.max(1, limit), event?.velocity ?? 0, event?.direction ?? 1);
      root.style.setProperty("--kh-scroll-progress", String(experienceState.scroll.progress));
      root.style.setProperty("--kh-scroll-velocity", String(Math.min(1, Math.abs(experienceState.scroll.velocity) / 120)));
    };

    const onNativeScroll = () => updateScrollState();
    lenis?.on("scroll", updateScrollState);
    if (!lenis) window.addEventListener("scroll", onNativeScroll, { passive: true });
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = anchor?.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.25 });
      else target.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", onAnchorClick);

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        experienceState.applyTouchDelta(event.clientX - touchLastX, event.clientY - touchLastY);
        touchLastX = event.clientX;
        touchLastY = event.clientY;
      }
      experienceState.updatePointer(event.clientX, event.clientY, event.pointerType || "mouse");
      const interactive = (event.target as Element | null)?.closest("a, button, [data-cursor]");
      root.dataset.khCursor = interactive?.getAttribute("data-cursor") || (interactive ? "interactive" : "default");
      const type = (event.target as Element | null)?.closest<HTMLElement>(".kh-reactive-type");
      if (type !== activeType) { activeType?.classList.remove("is-pointer-active"); activeType = type; activeType?.classList.add("is-pointer-active"); }
      if (activeType) {
        const rect = activeType.getBoundingClientRect();
        activeType.style.setProperty("--type-x", String((event.clientX - rect.left) / Math.max(1, rect.width) - .5));
        activeType.style.setProperty("--type-y", String((event.clientY - rect.top) / Math.max(1, rect.height) - .5));
      }
      const action = (event.target as Element | null)?.closest<HTMLElement>(".kh-magnetic");
      if (action !== activeAction) { activeAction?.style.removeProperty("--mag-x"); activeAction?.style.removeProperty("--mag-y"); activeAction = action; }
      if (activeAction) {
        const rect = activeAction.getBoundingClientRect();
        activeAction.style.setProperty("--mag-x", `${(event.clientX - rect.left - rect.width / 2) * .1}px`);
        activeAction.style.setProperty("--mag-y", `${(event.clientY - rect.top - rect.height / 2) * .12}px`);
      }
      const image = (event.target as Element | null)?.closest<HTMLElement>(".kh-route-image");
      if (image !== activeImage) { activeImage?.style.removeProperty("--route-image-x"); activeImage?.style.removeProperty("--route-image-y"); activeImage = image; }
      if (activeImage) {
        const rect = activeImage.getBoundingClientRect();
        activeImage.style.setProperty("--route-image-x", String((event.clientX - rect.left) / Math.max(1, rect.width) - .5));
        activeImage.style.setProperty("--route-image-y", String((event.clientY - rect.top) / Math.max(1, rect.height) - .5));
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        touchLastX = event.clientX;
        touchLastY = event.clientY;
      }
      experienceState.pointer.pressed = true;
      experienceState.updatePointer(event.clientX, event.clientY, event.pointerType || "mouse");
      root.dataset.khPointerDown = "true";
    };
    const onPointerUp = () => {
      experienceState.pointer.pressed = false;
      touchLastX = 0;
      touchLastY = 0;
      root.dataset.khPointerDown = "false";
    };
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchLastX = touch.clientX;
      touchLastY = touch.clientY;
      experienceState.pointer.pressed = true;
      experienceState.updatePointer(touch.clientX, touch.clientY, "touch");
      root.dataset.khPointerDown = "true";
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      const dx = touch.clientX - touchLastX;
      const dy = touch.clientY - touchLastY;
      touchLastX = touch.clientX;
      touchLastY = touch.clientY;
      experienceState.applyTouchDelta(dx, dy);
      experienceState.updatePointer(touch.clientX, touch.clientY, "touch");
    };
    const onTouchEnd = () => {
      experienceState.pointer.pressed = false;
      root.dataset.khPointerDown = "false";
    };
    const onPointerLeave = () => {
      experienceState.pointer.active = false;
      root.dataset.khCursor = "hidden";
      activeType?.classList.remove("is-pointer-active");
      activeAction?.style.removeProperty("--mag-x");
      activeAction?.style.removeProperty("--mag-y");
      activeImage?.style.removeProperty("--route-image-x");
      activeImage?.style.removeProperty("--route-image-y");
    };

    const frame = (now: number) => {
      raf = 0;
      if (!documentVisible) return;
      const delta = Math.min(0.05, Math.max(0.001, (now - previous) / 1000));
      previous = now;
      const frameStarted = performance.now();
      lenis?.raf(now);
      experienceState.tick(delta);
      const pointer = experienceState.pointer;
      root.style.setProperty("--kh-pointer-x", `${pointer.clientX}px`);
      root.style.setProperty("--kh-pointer-y", `${pointer.clientY}px`);
      root.style.setProperty("--kh-pointer-nx", String(pointer.smoothNdcX));
      root.style.setProperty("--kh-pointer-ny", String(pointer.smoothNdcY));
      root.style.setProperty("--kh-pointer-speed", String(pointer.smoothSpeed));
      root.style.setProperty("--home-pointer-x", String(pointer.smoothNdcX));
      root.style.setProperty("--home-pointer-y", String(pointer.smoothNdcY));
      root.style.setProperty("--home-pointer-speed", String(pointer.smoothSpeed));
      root.style.setProperty("--kh-render-scale", String(experienceState.renderScale));
      experienceState.recordFrameTime(performance.now() - frameStarted);
      raf = window.requestAnimationFrame(frame);
    };
    const onVisibility = () => {
      documentVisible = !document.hidden;
      if (documentVisible && !raf) raf = window.requestAnimationFrame(frame);
      if (!documentVisible && raf) { window.cancelAnimationFrame(raf); raf = 0; }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    if (!supportsPointerEvents) {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility);
    updateScrollState();
    raf = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(raf);
      lenis?.destroy();
      lenisRef.current = null;
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("pointerleave", onPointerLeave);
      if (!supportsPointerEvents) {
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchEnd);
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/") return;
    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    const decorate = () => {
      if (cancelled) return;
      const page = document.querySelector<HTMLElement>("#main-content");
      if (!page) { requestAnimationFrame(decorate); return; }
      page.classList.add("kh-subpage", "kh-subpage-motion");
      const sections = Array.from(page.querySelectorAll<HTMLElement>("section"));
      const reveal = Array.from(page.querySelectorAll<HTMLElement>("h1,h2,h3,p,.card,[class*='Card'],form"));
      const images = Array.from(page.querySelectorAll<HTMLElement>("img")).filter((image) => !image.closest(".kh-nav,.kh-footer"));
      const actions = Array.from(page.querySelectorAll<HTMLElement>("a,button"));
      sections.forEach((section, index) => { section.classList.add("kh-route-section"); section.style.setProperty("--section-index", String(index)); });
      reveal.forEach((element, index) => { element.classList.add("kh-route-reveal"); element.dataset.revealMode = ["rise","clip","drift","focus"][index % 4]; });
      images.forEach((image) => image.classList.add("kh-route-image"));
      actions.forEach((action) => action.classList.add("kh-magnetic"));
      page.querySelectorAll<HTMLElement>("h1,h2,blockquote").forEach((element) => element.classList.add("kh-reactive-type"));
      if (experienceState.reducedMotion) { reveal.forEach((element) => element.classList.add("is-inview")); return; }
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-inview"); }), { threshold: .08, rootMargin: "0px 0px -5%" });
      reveal.forEach((element) => observer?.observe(element));
    };
    requestAnimationFrame(decorate);
    return () => { cancelled = true; observer?.disconnect(); };
  }, [location.pathname]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <>
      <ExperiencePreloader />
      <FluidPointer />
      {location.pathname !== "/" && <SubpageAtmosphere />}
    </>
  );
};

export default ExperienceRuntime;
