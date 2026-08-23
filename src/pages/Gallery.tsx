import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Calendar, Users, Award, MapPin, Play } from "lucide-react";
import galleryImage1 from "@/assets/img-20250827-wa0020-1.jpg";
import galleryImage2 from "@/assets/img-20250827-wa0012.jpg";
import galleryImage3 from "@/assets/img-20250827-wa0009.jpg";
import galleryImage4 from "@/assets/img-20250827-wa0024.jpg";
import galleryImage5 from "@/assets/img-20250827-wa0023.jpg";
import galleryImage6 from "@/assets/img-20250827-wa0010.jpg";
import galleryImage7 from "@/assets/img-20250827-wa0020-1.jpg";
import galleryImage8 from "@/assets/img-20250827-wa0012.jpg";

const communityGalleryImages = [
  galleryImage1,
  galleryImage2,
  galleryImage3,
  galleryImage4,
  galleryImage5,
  galleryImage6,
  galleryImage7,
  galleryImage8,
  galleryImage1,
  galleryImage2,
  galleryImage3,
  galleryImage4,
  galleryImage5,
  galleryImage6,
  galleryImage7,
  galleryImage8,
];

const Gallery = () => {
  const galleryItems = [
    {
      title: "Graduation Ceremony 2024",
      description: "Celebrating our latest cohort of certified life coaches",
      image: galleryImage1,
      date: "December 2024",
      location: "Lagos, Nigeria",
      attendees: "150+ graduates",
      type: "Event",
      category: "Graduation"
    },
    {
      title: "Corporate Training Workshop",
      description: "Executive coaching training for business leaders",
      image: galleryImage2,
      date: "November 2024", 
      location: "Abuja, Nigeria",
      attendees: "80+ executives",
      type: "Workshop",
      category: "Corporate"
    },
    {
      title: "Youth Empowerment Program",
      description: "Empowering young Nigerians through coaching skills",
      image: galleryImage3,
      date: "October 2024",
      location: "Kano, Nigeria", 
      attendees: "200+ youth",
      type: "Program",
      category: "Youth"
    },
    {
      title: "Business Leaders Forum",
      description: "Networking and knowledge sharing among business leaders",
      image: nigerianBusinessTeam,
      date: "September 2024",
      location: "Port Harcourt, Nigeria",
      attendees: "120+ leaders",
      type: "Forum",
      category: "Business"
    },
    {
      title: "NLP Master Class",
      description: "Advanced NLP techniques for experienced practitioners",
      image: nigerianBusinessMeeting,
      date: "August 2024",
      location: "Ibadan, Nigeria",
      attendees: "60+ practitioners",
      type: "Master Class", 
      category: "Training"
    },
    {
      title: "Women in Coaching Summit",
      description: "Empowering women coaches across Nigeria",
      image: nigerianBusinessWoman,
      date: "July 2024",
      location: "Lagos, Nigeria",
      attendees: "180+ women",
      type: "Summit",
      category: "Women"
    }
  ];

  const videoHighlights = [
    {
      title: "Kingshill School of Discovery Overview",
      description: "Discover our journey and impact across Nigeria",
      embedUrl: "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fthecoachingnations%2Fvideos%2F&show_text=false&width=560&t=0",
      thumbnail: nigerianProfessionals1,
      duration: "5:30",
      type: "facebook"
    },
    {
      title: "Student Success Stories",
      description: "Hear from our graduates about their transformation",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: nigerianProfessionals2,
      duration: "8:45",
      type: "youtube"
    },
    {
      title: "Training Programs Highlights",
      description: "A look inside our comprehensive coaching training",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: nigerianBusinessTeam,
      duration: "6:20", 
      type: "youtube"
    }
  ];

  return (
    <div className="min-h-screen" id="main-content">
      <Navigation />
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-coaching-navy via-coaching-navy-light to-coaching-royal-blue relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-coaching-gold/30 rounded-full animate-float blur-3xl shadow-glow"></div>
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-coaching-red/35 rounded-full animate-float-delayed blur-2xl shadow-glow-red"></div>
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-coaching-green/30 rounded-full animate-float blur-xl shadow-glow-green"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-6 md:space-y-8 mb-12 md:mb-20">
            <Badge className="bg-coaching-gold text-coaching-navy border-4 border-coaching-navy font-bold px-8 py-4 text-lg shadow-glow rounded-2xl">
              <Camera className="w-5 h-5 mr-2" />
              Photo Gallery
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)'}}>
              Capturing <span className="bg-gradient-to-r from-coaching-gold to-coaching-green bg-clip-text text-transparent">Moments of Growth</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-4xl mx-auto leading-relaxed font-medium" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
              Explore the vibrant community and transformative experiences at Kingshill School of Discovery
            </p>
          </div>
        </div>
      </section>

      {/* Video Highlights */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-navy-light via-coaching-royal-blue to-coaching-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>Video Highlights</h2>
            <p className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>Experience our community through video stories</p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 px-2 sm:px-0">
            {videoHighlights.map((video, index) => (
              <Card key={index} className="group glass-card border-0 shadow-glow rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy" decoding="async" sizes="(min-width:768px) 33vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-overlay opacity-40 group-hover:opacity-20 transition-opacity"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-coaching-gold rounded-full flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-coaching-navy ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/50 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 space-y-3 md:space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>{video.title}</h3>
                    <p className="text-sm sm:text-base text-white" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>{video.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-navy via-coaching-royal-blue to-coaching-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>Photo Gallery</h2>
            <p className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>Moments that capture the spirit of transformation and growth</p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 sm:px-0">
            {galleryItems.map((item, index) => (
              <Card key={index} className="group glass-card border-0 shadow-glow rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy" decoding="async" sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-overlay opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-coaching-gold text-coaching-navy font-semibold">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 space-y-3 md:space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>{item.title}</h3>
                      <p className="text-sm sm:text-base text-white" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>{item.description}</p>
                    </div>

                    <div className="space-y-2 md:space-y-3 text-xs sm:text-sm text-white" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-coaching-gold" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-coaching-gold" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-coaching-gold" />
                        <span>{item.attendees}</span>
                      </div>
                    </div>

                    <Badge className="bg-coaching-gold/20 text-coaching-gold border-coaching-gold/30 font-semibold">
                      {item.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Gallery */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-navy via-coaching-royal-blue to-coaching-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6" style={{textShadow:'0 2px 4px rgba(0,0,0,0.8)'}}>Community Gallery</h2>
            <p className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto" style={{textShadow:'0 1px 3px rgba(0,0,0,0.8)'}}>Recent photos from our programs and events</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {communityGalleryImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Kingshill gallery image ${idx + 1}`}
                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl shadow-card hover:scale-105 transition-transform"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-gold via-coaching-gold-light to-coaching-green">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-coaching-navy rounded-2xl flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-coaching-navy">500+</div>
              <div className="text-sm sm:text-base text-coaching-navy font-semibold">Photos Captured</div>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-coaching-navy rounded-2xl flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-coaching-navy">50+</div>
              <div className="text-sm sm:text-base text-coaching-navy font-semibold">Video Stories</div>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-coaching-navy rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-coaching-navy">100+</div>
              <div className="text-sm sm:text-base text-coaching-navy font-semibold">Events Documented</div>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-coaching-navy rounded-2xl flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-coaching-navy">25+</div>
              <div className="text-sm sm:text-base text-coaching-navy font-semibold">Years of Memories</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-navy via-coaching-royal-blue to-coaching-green">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
              Be Part of Our Story
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>
              Join our community and create your own transformation story with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-coaching-gold hover:bg-coaching-gold-light text-coaching-navy font-bold px-12 py-6 rounded-xl text-lg shadow-glow hover:scale-105 transition-all duration-500"
                onClick={() => window.location.href = '/training'}
              >
                Join Our Programs
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-coaching-gold text-coaching-gold hover:bg-coaching-gold hover:text-coaching-navy font-bold px-12 py-6 rounded-xl text-lg hover:scale-105 transition-all duration-500"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
