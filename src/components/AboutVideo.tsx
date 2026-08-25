import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";
import { useRef, useState } from "react";

const AboutVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlayClick = () => {
    if (videoRef.current) {
      try {
        videoRef.current.controls = true;
      } catch (e) {
        // ignore
      }
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <section className="section-padding bg-gradient-to-br from-coaching-navy via-coaching-royal-blue to-coaching-purple relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-coaching-gold/10 rounded-full animate-float blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-coaching-green/10 rounded-full animate-float-delayed blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center space-y-6 mb-12">
          <Badge className="glass-card bg-coaching-gold/20 text-coaching-gold border-coaching-gold/30 font-bold px-6 py-3 text-lg">
            <Video className="w-5 h-5 mr-2" />
            About Us Video
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Watch Gbenga Ademujimi</h2>
        </div>

        <Card className="max-w-5xl mx-auto glass-card border-0 shadow-glow rounded-3xl overflow-hidden relative">
          <CardContent className="p-0">
            <div className="relative">
              <video
                ref={videoRef}
                preload="none"
                playsInline
                poster="/img-20250827-wa0023.jpg"
                className="w-full h-auto rounded-3xl"
              >
                <source src="/VID-20250827-WA0025.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {!playing && (
                <button
                  aria-label="Play video"
                  onClick={handlePlayClick}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white opacity-95 bg-white/10 border border-white/15 shadow-[0_0_30px_rgba(255,255,255,0.12)]"
                >
                  <svg width="14" height="16" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 1L10 7L2 13V1Z" fill="rgba(255,255,255,0.95)" />
                  </svg>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutVideo;
