import { FilmGrain, Godrays, Shader, Tritone, ZoomBlur } from "shaders/react";

const TestimonialShaderBackground = () => (
  <div className="kh-testimonial-shader" aria-hidden="true">
    <Shader className="kh-testimonial-shader__canvas" disableTelemetry>
      <Godrays
        backgroundColor="#1829b5"
        center={{ x: 0.67, y: 0.41 }}
        intensity={0.58}
        rayColor="#ccdaed"
        speed={0.7}
      />
      <FilmGrain strength={0.09} />
      <Tritone colorA="#051713" colorB="#00ff33" colorC="#ff3df2" colorSpace="hsl" />
      <ZoomBlur center={{ x: 0.37, y: 0.35 }} intensity={100} />
    </Shader>
  </div>
);

export default TestimonialShaderBackground;
