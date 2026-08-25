import { Godrays, FilmGrain, Tritone, ZoomBlur } from "shaders/react";
import ShaderSurface from "@/components/effects/ShaderSurface";

const FooterShaderBackground = () => (
  <div className="kh-footer-shader" aria-hidden="true">
    <ShaderSurface className="kh-footer-shader__canvas">
      <Godrays
        backgroundColor="#ffffff"
        center={{ x: 0.16, y: 0.72 }}
        intensity={0.045}
        rayColor="#f8f8f6"
        speed={0.16}
      />
      <FilmGrain strength={0.006} />
      <Tritone colorA="#ffffff" colorB="#fcfcfa" colorC="#f8faf9" colorSpace="linear" />
      <ZoomBlur center={{ x: 0.78, y: 0.28 }} intensity={0.06} />
    </ShaderSurface>
  </div>
);

export default FooterShaderBackground;
