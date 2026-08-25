export type ExperienceQuality = "low" | "medium" | "high";
export type ExperienceChapter = "ENTRY" | "HERO" | "DISCOVERY" | "PATHWAYS" | "PROOF" | "EPILOGUE";
export type ExperienceReadyKey = "assets" | "cloud" | "water" | "fluid" | "home";

type ReadyListener = () => void;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const inferQuality = (): ExperienceQuality => {
  if (typeof window === "undefined") return "medium";
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (memory <= 4 || cores <= 4) return "low";
  if (memory <= 8 || cores <= 8) return "medium";
  return "high";
};

class ExperienceState {
  pointer = {
    clientX: typeof window === "undefined" ? 0 : window.innerWidth * 0.5,
    clientY: typeof window === "undefined" ? 0 : window.innerHeight * 0.5,
    ndcX: 0,
    ndcY: 0,
    smoothNdcX: 0,
    smoothNdcY: 0,
    deltaX: 0,
    deltaY: 0,
    smoothDeltaX: 0,
    smoothDeltaY: 0,
    speed: 0,
    smoothSpeed: 0,
    pressed: false,
    active: false,
    coarse: false,
    type: "mouse" as string,
  };

  scroll = {
    current: 0,
    progress: 0,
    velocity: 0,
    direction: 1,
    cloudProgress: 0,
  };

  chapter = {
    name: "ENTRY" as ExperienceChapter,
    progress: 0,
    blend: 0,
    energy: 0,
  };

  entered = false;

  quality: ExperienceQuality = inferQuality();
  /** Starts at full resolution for every device; only sustained measured frame cost may adjust it. */
  renderScale = 1;
  reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private frameSampleCount = 0;
  private frameSampleTotal = 0;
  private previousPointerTime = typeof performance === "undefined" ? 0 : performance.now();
  private ready = new Set<ExperienceReadyKey>();
  private readyListeners = new Set<ReadyListener>();

  updatePointer(clientX: number, clientY: number, type = "mouse") {
    const now = performance.now();
    const dt = Math.max(8, Math.min(80, now - this.previousPointerTime));
    this.previousPointerTime = now;
    const dx = clientX - this.pointer.clientX;
    const dy = clientY - this.pointer.clientY;
    this.pointer.clientX = clientX;
    this.pointer.clientY = clientY;
    this.pointer.ndcX = clamp((clientX / Math.max(1, window.innerWidth)) * 2 - 1, -1, 1);
    this.pointer.ndcY = clamp(-((clientY / Math.max(1, window.innerHeight)) * 2 - 1), -1, 1);
    this.pointer.deltaX = dx / Math.max(1, window.innerWidth);
    this.pointer.deltaY = dy / Math.max(1, window.innerHeight);
    this.pointer.speed = clamp(Math.hypot(dx, dy) / dt / 1.35);
    this.pointer.active = true;
    this.pointer.type = type;
    this.pointer.coarse = type !== "mouse";
  }

  applyTouchDelta(deltaX: number, deltaY: number) {
    const now = performance.now();
    const dt = Math.max(8, Math.min(80, now - this.previousPointerTime));
    this.previousPointerTime = now;
    const normalizedX = deltaX / Math.max(1, typeof window === "undefined" ? 1 : window.innerWidth);
    const normalizedY = deltaY / Math.max(1, typeof window === "undefined" ? 1 : window.innerHeight);
    this.pointer.deltaX = normalizedX;
    this.pointer.deltaY = normalizedY;
    this.pointer.speed = clamp(Math.hypot(deltaX, deltaY) / dt / 1.1);
    this.pointer.active = true;
    this.pointer.type = "touch";
    this.pointer.coarse = true;
  }

  tick(deltaSeconds: number) {
    const pointerResponse = 1 - Math.exp(-Math.min(deltaSeconds, 0.05) * 9.2);
    const velocityResponse = 1 - Math.exp(-Math.min(deltaSeconds, 0.05) * 12);
    this.pointer.smoothNdcX += (this.pointer.ndcX - this.pointer.smoothNdcX) * pointerResponse;
    this.pointer.smoothNdcY += (this.pointer.ndcY - this.pointer.smoothNdcY) * pointerResponse;
    this.pointer.smoothDeltaX += (this.pointer.deltaX - this.pointer.smoothDeltaX) * velocityResponse;
    this.pointer.smoothDeltaY += (this.pointer.deltaY - this.pointer.smoothDeltaY) * velocityResponse;
    this.pointer.smoothSpeed += (this.pointer.speed - this.pointer.smoothSpeed) * velocityResponse;
    this.pointer.deltaX *= 0.78;
    this.pointer.deltaY *= 0.78;
    this.pointer.speed *= 0.88;
  }

  recordFrameTime(milliseconds: number) {
    if (!this.entered || !Number.isFinite(milliseconds)) return;
    this.frameSampleCount += 1;
    this.frameSampleTotal += Math.min(100, Math.max(0, milliseconds));
    if (this.frameSampleCount < 45) return;
    const average = this.frameSampleTotal / this.frameSampleCount;
    this.frameSampleCount = 0;
    this.frameSampleTotal = 0;
    const previous = this.renderScale;
    if (average > 28) this.renderScale = Math.max(0.78, this.renderScale - 0.06);
    else if (average < 17) this.renderScale = Math.min(1, this.renderScale + 0.04);
    if (this.renderScale !== previous) window.dispatchEvent(new CustomEvent("kingshill:render-scale", { detail: { scale: this.renderScale, averageFrameMs: average } }));
  }

  setScroll(current: number, progress: number, velocity: number, direction: number) {
    this.scroll.current = current;
    this.scroll.progress = clamp(progress);
    this.scroll.velocity = velocity;
    this.scroll.direction = direction || 1;
  }

  setCloudProgress(progress: number) {
    this.scroll.cloudProgress = clamp(progress);
  }

  setChapter(name: ExperienceChapter, progress: number, blend = 0, energy = 0) {
    this.chapter.name = name;
    this.chapter.progress = clamp(progress);
    this.chapter.blend = clamp(blend);
    this.chapter.energy = clamp(energy);
  }

  setEntered(value: boolean) {
    this.entered = value;
    window.dispatchEvent(new CustomEvent("kingshill:entered"));
  }

  markReady(key: ExperienceReadyKey) {
    if (this.ready.has(key)) return;
    this.ready.add(key);
    this.readyListeners.forEach((listener) => listener());
    window.dispatchEvent(new CustomEvent(`kingshill:${key}-ready`));
  }

  isReady(key: ExperienceReadyKey) {
    return this.ready.has(key);
  }

  subscribeReady(listener: ReadyListener) {
    this.readyListeners.add(listener);
    return () => this.readyListeners.delete(listener);
  }
}

export const experienceState = new ExperienceState();

