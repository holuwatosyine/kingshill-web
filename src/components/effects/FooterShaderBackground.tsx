import { Godrays, FilmGrain, Tritone, ZoomBlur } from "shaders/react";
import ShaderSurface from "@/components/effects/ShaderSurface";

const FooterShaderBackground = () => (
  <div className="kh-footer-shader" aria-hidden="true">
    <ShaderSurface className="kh-footer-shader__canvas">
      <Godrays
        backgroundColor="#05090d"
        center={{ x: 0.16, y: 0.72 }}
        intensity={0.2}
        rayColor="#6faea4"
        speed={0.16}
      />
      <FilmGrain strength={0.024} />
      <Tritone colorA="#03070b" colorB="#0a151b" colorC="#29514f" colorSpace="rgb" />
      <ZoomBlur center={{ x: 0.78, y: 0.28 }} intensity={7} />
    </ShaderSurface>
  </div>
);

export default FooterShaderBackground;
