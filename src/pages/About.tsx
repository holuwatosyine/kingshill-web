import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Target, Heart, Star, Trophy } from "lucide-react";
import nigerianProfessionals from "@/assets/img-20250827-wa0020-1.jpg";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen" id="main-content">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-coaching-navy via-coaching-navy-light to-coaching-royal-blue py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background animations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-coaching-gold/20 rounded-full animate-float blur-2xl"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-coaching-green/20 rounded-full animate-float-delayed blur-3xl"></div>
          <div className="absolute bottom-10 right-1/3 w-48 h-48 bg-coaching-green/20 rounded-full animate-float blur-xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-coaching-gold text-coaching-navy font-bold px-6 py-3 text-sm mb-6 animate-fade-in-scale">
              <Heart className="w-4 h-4 mr-2" />
              ABOUT KINGSHILL
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 animate-fade-in-up">
              Discover Purpose.{" "}
              <span className="bg-gradient-to-r from-coaching-gold to-coaching-gold-light bg-clip-text text-transparent">
                Discover Life.
              </span>
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              Kingshill Coaching Academy is a Human Capital Development and Intelligence Consulting organization 
              providing training services with relevant insights to help people and organizations move forward.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-royal-blue via-coaching-green to-coaching-navy">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 px-3 sm:px-4 md:px-0">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  School of{" "}
                  <span className="bg-gradient-to-r from-coaching-gold to-coaching-gold-light bg-clip-text text-transparent">
                    Discovery
                  </span>
                </h2>
                
                <p className="text-lg text-white/90 leading-relaxed">
                  We are Nigeria's FIRST registered coaching academy, providing Human Capital Development 
                  services with the most recent tools and skills to support both private and public 
                  institutions for personal and organizational Leadership/Management growth.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <Card className="glass-card p-4 md:p-6 text-center bg-white/20 border-white/40">
                    <Users className="w-8 h-8 text-coaching-gold mx-auto mb-3" />
                    <h3 className="font-bold text-white mb-2 text-sm md:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Peak Performance</h3>
                    <p className="text-white text-xs md:text-sm" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Unlock human potential</p>
                  </Card>
                  
                  <Card className="glass-card p-4 md:p-6 text-center bg-white/20 border-white/40">
                    <Target className="w-8 h-8 text-coaching-green mx-auto mb-3" />
                    <h3 className="font-bold text-white mb-2 text-sm md:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Productivity</h3>
                    <p className="text-white text-xs md:text-sm" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Achieve organizational goals</p>
                  </Card>
                  
                  <Card className="glass-card p-4 md:p-6 text-center bg-white/20 border-white/40">
                    <Trophy className="w-8 h-8 text-coaching-red mx-auto mb-3" />
                    <h3 className="font-bold text-white mb-2 text-sm md:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Profitability</h3>
                    <p className="text-white text-xs md:text-sm" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Drive business success</p>
                  </Card>
                  
                  <Card className="glass-card p-4 md:p-6 text-center bg-white/20 border-white/40">
                    <Award className="w-8 h-8 text-coaching-gold mx-auto mb-3" />
                    <h3 className="font-bold text-white mb-2 text-sm md:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Excellence</h3>
                    <p className="text-white text-xs md:text-sm" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Maintain highest standards</p>
                  </Card>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-elegant">
                <img
                  src={nigerianProfessionals}
                  alt="Nigerian Professionals"
                  className="w-full h-[500px] object-cover"
                  loading="lazy" decoding="async" sizes="(min-width:1024px) 600px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-overlay opacity-20"></div>
              </div>
              
              {/* Floating achievement */}
              <Card className="absolute -bottom-6 -left-6 p-6 bg-coaching-gold text-coaching-navy shadow-glow">
                <div className="text-center">
                  <div className="text-2xl font-bold">25+</div>
                  <div className="text-sm opacity-90">Years of Excellence</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-navy via-coaching-royal-blue to-coaching-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our Core{" "}
              <span className="bg-gradient-to-r from-coaching-gold to-coaching-gold-light bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              These values guide everything we do and shape the transformative experiences we create.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Excellence",
                description: "We maintain the highest standards in everything we do, ensuring our graduates receive world-class training.",
                color: "coaching-gold"
              },
              {
                icon: Heart,
                title: "Integrity",
                description: "We operate with honesty, transparency, and ethical practices in all our interactions.",
                color: "coaching-red"
              },
              {
                icon: Users,
                title: "Empowerment",
                description: "We believe in unlocking human potential and empowering individuals to achieve their dreams.",
                color: "coaching-green"
              },
              {
                icon: Target,
                title: "Innovation",
                description: "We continuously evolve our methods and approaches to stay at the forefront of coaching education.",
                color: "coaching-royal-blue"
              },
              {
                icon: Star,
                title: "Impact",
                description: "We measure our success by the positive transformation we create in the lives of our students.",
                color: "coaching-purple"
              },
              {
                icon: Trophy,
                title: "Recognition",
                description: "We celebrate achievements and recognize the hard work and dedication of our community.",
                color: "coaching-gold"
              }
            ].map((value, index) => (
              <Card key={index} className="glass-card p-6 hover:shadow-glow transition-all duration-500 hover:scale-105 bg-white/10 border-white/20">
                <value.icon className={`w-10 h-10 text-${value.color} mb-4`} />
                <h3 className="font-bold text-white text-xl mb-3">{value.title}</h3>
                <p className="text-white/80 leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-royal-blue via-coaching-green to-coaching-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-coaching-gold to-coaching-gold-light bg-clip-text text-transparent">
              Future?
            </span>
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have discovered their purpose and transformed their lives through our programs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild
              size="lg" 
              className="bg-coaching-gold hover:bg-coaching-gold-light text-coaching-navy font-bold px-10 py-6 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-500 hover:scale-105"
            >
              <Link to="/training"><Award className="w-5 h-5 mr-2" />Explore Our Programs</Link>
            </Button>
            <Button asChild
              size="lg" 
              variant="outline" 
              className="glass-card border-2 border-white/60 text-white hover:bg-white hover:text-coaching-navy font-bold px-10 py-6 rounded-xl bg-white/10"
            >
              <Link to="/contact"><Users className="w-5 h-5 mr-2" />Join Free Webinar</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
