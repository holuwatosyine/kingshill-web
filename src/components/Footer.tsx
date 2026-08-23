import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  Award,
  Heart,
  Star,
  ArrowRight
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    "Life Coaching Diploma",
    "NLP Training",
    "Corporate Programs",
    "Youth Coaching",
    "Free Webinars",
    "Success Stories"
  ];

  const socialLinks = [
    { icon: <Facebook className="w-6 h-6" />, label: "Facebook", color: "hover:text-coaching-blue" },
    { icon: <Instagram className="w-6 h-6" />, label: "Instagram", color: "hover:text-coaching-red" },
    { icon: <Linkedin className="w-6 h-6" />, label: "LinkedIn", color: "hover:text-coaching-blue" }
  ];

  return (
    <footer className="bg-gradient-to-br from-coaching-navy via-coaching-navy-light to-coaching-purple relative overflow-hidden animate-pulse-glow">
      {/* Enhanced animated background with pulsing glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-coaching-red/15 rounded-full animate-float blur-3xl shadow-glow-red"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-coaching-gold/15 rounded-full animate-float-delayed blur-2xl shadow-glow"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-coaching-blue/15 rounded-full animate-float blur-xl shadow-glow-purple" style={{animationDelay: '3s'}}></div>
        
        {/* Floating shapes with enhanced glow */}
        <div className="absolute top-20 left-1/4 w-6 h-6 bg-coaching-gold/30 rotate-45 animate-subtle-float shadow-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-coaching-red/40 rounded-full animate-subtle-float shadow-glow-red" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/5 w-8 h-8 bg-coaching-green/25 rounded-full animate-subtle-float shadow-glow-green" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="section-padding">
          <div className="container mx-auto px-4 w-full overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
              
              {/* Company Info */}
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-4">
                  <Badge className="glass-card bg-coaching-red/20 text-coaching-red border-coaching-red/30 font-bold px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    Since 1999
                  </Badge>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    Kingshill{" "}
                    <span className="gradient-text bg-gradient-to-r from-coaching-gold to-coaching-orange bg-clip-text">
                      School of Discovery
                    </span>
                  </h3>
                  <p className="text-coaching-royal-blue text-base sm:text-lg font-semibold mb-2">
                    Royal Academy Coaching
                  </p>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                    Unlocking potential, raising builders & reformers through
                    internationally accredited coaching education and professional development programs.
                  </p>
                </div>

                {/* Enhanced social links */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-base sm:text-lg">Follow Our Journey</h4>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={index === 0 ? "https://facebook.com/kingshillcoaching" : index === 1 ? "https://instagram.com/kingshillcoaching" : "https://linkedin.com/company/kingshillcoaching"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`glass-card hover:shadow-glow transition-all duration-500 hover:scale-110 text-white/80 ${social.color} p-3 rounded-lg flex items-center justify-center`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-coaching-gold rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-coaching-navy" />
                  </div>
                  Our Programs
                </h3>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={index === 0 ? "/training" : index === 1 ? "/training" : index === 2 ? "/training" : index === 3 ? "/training" : index === 4 ? "/contact" : "/gallery"}
                        className="group text-white/80 hover:text-coaching-gold justify-start p-0 h-auto font-normal text-sm sm:text-base md:text-lg transition-all duration-300 hover:translate-x-2 flex items-center"
                      >
                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-coaching-blue rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  Contact Us
                </h3>
                <div className="space-y-4">
                  <Card className="glass-card p-4 rounded-2xl hover:shadow-soft transition-all duration-300">
                    <div className="flex items-start gap-3 text-white/90">
                      <MapPin className="w-5 h-5 text-coaching-gold mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Address</p>
                        <p className="text-xs sm:text-sm font-bold text-white">No #14 Adedotun Dina Street, Mende - Maryland, Lagos</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="glass-card p-4 rounded-2xl hover:shadow-soft transition-all duration-300">
                    <div className="flex items-center gap-3 text-white/90">
                      <Phone className="w-5 h-5 text-coaching-gold flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p className="text-xs sm:text-sm font-bold text-white">09090550072, 09090550073</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="glass-card p-4 rounded-2xl hover:shadow-soft transition-all duration-300">
                    <div className="flex items-center gap-3 text-white/90">
                      <Mail className="w-5 h-5 text-coaching-gold flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-xs sm:text-sm font-bold text-white">pg@thecoachingnations.com</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-coaching-purple rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  Stay Updated
                </h3>
                <div className="space-y-4">
                  <p className="text-white font-semibold text-sm sm:text-base md:text-lg">
                    Get the latest updates on our programs, success stories, and coaching insights.
                  </p>
                  
                  <Card className="glass-card p-6 rounded-2xl space-y-4">
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-coaching-gold"
                      />
                      <Button asChild className="w-full bg-coaching-gold hover:bg-coaching-orange text-coaching-navy font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg hover:shadow-glow transition-all duration-300">
                        <a href="mailto:pg@thecoachingnations.com?subject=Kingshill%20updates"><span>Subscribe Now</span><Mail className="w-5 h-5 ml-2" /></a>
                      </Button>
                    </div>
                    <p className="text-xs text-white/60 text-center">
                      Join 5000+ subscribers. Unsubscribe anytime.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="border-t border-white/20 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-white/80">
                <p className="text-sm md:text-base font-semibold text-white" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
                  © 2025 Kingshill School of Discovery - Royal Academy Coaching. All rights reserved.
                </p>
                <p className="text-xs md:text-sm mt-1 text-white" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
                  Unlocking potential, raising builders & reformers since 1999.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <Badge className="glass-card bg-coaching-red/30 text-white border-coaching-red/50 font-semibold px-3 py-2 text-xs shadow-glow-red" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>
                  <Award className="w-3 h-3 mr-2" />
                  CCC Accredited
                </Badge>
                <Badge className="glass-card bg-coaching-gold/30 text-white border-coaching-gold/50 font-semibold px-3 py-2 text-xs shadow-glow" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>
                  <Heart className="w-3 h-3 mr-2" />
                  1000+ Graduates
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
