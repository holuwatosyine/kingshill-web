import { Godrays, FilmGrain, Tritone, ZoomBlur } from "shaders/react";
import ShaderSurface from "@/components/effects/ShaderSurface";

const FooterShaderBackground = () => (
  <div className="kh-footer-shader" aria-hidden="true">
    <ShaderSurface className="kh-footer-shader__canvas">
      <Godrays
        backgroundColor="#f2f3f1"
        center={{ x: 0.16, y: 0.72 }}
        intensity={0.14}
        rayColor="#b6c6c4"
        speed={0.16}
      />
      <FilmGrain strength={0.018} />
      <Tritone colorA="#f3f4f2" colorB="#e7ecea" colorC="#cadad8" colorSpace="rgb" />
      <ZoomBlur center={{ x: 0.78, y: 0.28 }} intensity={0.65} />
    </ShaderSurface>
  </div>
);

export default FooterShaderBackground;
