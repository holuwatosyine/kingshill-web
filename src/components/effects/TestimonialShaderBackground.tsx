import { FilmGrain, Godrays, Tritone, ZoomBlur } from "shaders/react";
import ShaderSurface from "@/components/effects/ShaderSurface";

const TestimonialShaderBackground = () => (
  <div className="kh-testimonial-shader" aria-hidden="true">
    <ShaderSurface className="kh-testimonial-shader__canvas">
      <Godrays
        backgroundColor="#f0f0f0"
        center={{ x: 0.72, y: 0.34 }}
        intensity={0.22}
        rayColor="#ffffff"
        speed={0.24}
      />
      <FilmGrain strength={0.035} />
      <Tritone colorA="#ffffff" colorB="#fbfbfb" colorC="#f4f4f4" colorSpace="linear" />
      <ZoomBlur center={{ x: 0.37, y: 0.35 }} intensity={18} />
    </ShaderSurface>
  </div>
);

export default TestimonialShaderBackground;
