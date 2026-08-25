import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, Award } from "lucide-react";

const VideoSection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-coaching-navy via-coaching-royal-blue to-coaching-purple relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-coaching-gold/10 rounded-full animate-float blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-coaching-red/10 rounded-full animate-float-delayed blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-coaching-green/5 rounded-full animate-pulse blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center space-y-8 mb-16 animate-fade-in-up">
          <Badge className="glass-card bg-coaching-gold/20 text-coaching-gold border-coaching-gold/30 font-bold px-6 py-3 text-lg">
            <Video className="w-5 h-5 mr-2" />
            Featured Video
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience Our{" "}
            <span className="bg-gradient-to-r from-coaching-gold to-coaching-orange bg-clip-text text-transparent">
              Community
            </span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Watch highlights from our recent coaching events and see the transformation in action.
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto glass-card border-0 shadow-glow rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 animate-fade-in-scale" style={{animationDelay: '0.2s'}}>
          <CardContent className="p-0 relative">
            <div className="relative">
              <video
                controls
                preload="none"
                className="w-full h-auto rounded-3xl [&::-webkit-media-controls-panel]:bg-black/60 [&::-webkit-media-controls-panel]:backdrop-blur-sm [&::-webkit-media-controls-play-button]:scale-50 [&::-webkit-media-controls-play-button]:opacity-90 hover:[&::-webkit-media-controls-play-button]:opacity-100 [&::-webkit-media-controls-timeline]:h-2 [&::-webkit-media-controls-volume-slider]:h-2 [&::-webkit-media-controls-play-button]:rounded-full [&::-webkit-media-controls-play-button]:bg-coaching-gold [&::-webkit-media-controls-play-button]:border-2 [&::-webkit-media-controls-play-button]:border-coaching-navy"
                style={{
                  '--webkit-media-controls-panel-color': 'rgba(0,0,0,0.6)',
                  '--webkit-media-controls-play-button-color': '#D4AF37',
                  '--webkit-media-controls-timeline-color': '#D4AF37'
                }}
                poster="/IMG-20250827-WA0021.webp"
              >
                <source src="/VID-20250827-WA0025.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-overlay opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Kingshill Community Highlights</h3>
              <p className="text-white/80 leading-relaxed mb-6">
                Join us on a journey through our recent events, training sessions, and success celebrations. 
                See firsthand the vibrant community and transformational experiences at Kingshill School of Discovery.
              </p>
              <div className="flex items-center justify-center gap-6 text-white/70">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  5:30
                </span>
                <span>•</span>
                <span>Community Highlights</span>
                <span>•</span>
                <span>August 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VideoSection;
