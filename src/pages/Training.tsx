import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Clock, Star, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Training = () => {
  return (
    <div className="min-h-screen" id="main-content">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-coaching-navy via-coaching-navy-light to-coaching-royal-blue py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-coaching-gold/20 rounded-full animate-float blur-2xl"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-coaching-green/20 rounded-full animate-float-delayed blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-8">
            <Badge className="bg-coaching-gold text-coaching-navy font-bold px-6 py-3 text-sm mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              TRAINING PROGRAMS
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8" style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)'}}>
              Our Certifications and{" "}
              <span className="bg-gradient-to-r from-coaching-gold to-coaching-gold-light bg-clip-text text-transparent">
                Programmes
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
              In addition to our life coaching core certification, we offer a range of specialist programs
              with 20+ coaching designations you can study alongside or on their own.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-royal-blue via-coaching-green to-coaching-navy">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 px-2 sm:px-0">
            {[
              {
                title: "Life Coaching Certification",
                description: "Our flagship CCC-accredited program with 20+ coaching designations that transforms lives and careers.",
                features: ["CCC Accredited", "20+ Designations", "Certificate Included", "Practical Training"],
                popular: true,
                price: "Contact for Pricing",
                designations: [
                  "Personal Coaching", "Relationship & Marital Coaching", "Business & Strategy Coaching",
                  "Investment & Finance Coaching", "Spiritual Intelligence Coaching", "Ministry Coaching",
                  "Teenage Coaching", "Youth Development Coaching", "Sex and Sexuality Coaching",
                  "Mindshift Coaching", "Transformational Coaching", "Corporate & Executive Coaching",
                  "Mental Health Coaching", "Lifestyle Health Coaching", "Communication Coaching",
                  "Sales Coaching", "Peak Performance Coaching", "Leadership Coaching",
                  "Management Coaching", "Human Design Systems Coaching"
                ]
              },
              {
                title: "Transitional Youth Coaching Program",
                description: "Specialized program designed for coaching young professionals and students.",
                features: ["Youth Focused", "3 Months", "Mentorship Included", "Career Guidance"],
                popular: false,
                price: "Contact for Pricing"
              },
              {
                title: "Youth Entrepreneurship Program (YEP)",
                description: "Empowering young entrepreneurs with business coaching and mentorship.",
                features: ["Business Coaching", "4 Months", "Startup Support", "Network Access"],
                popular: false,
                price: "Contact for Pricing"
              },
              {
                title: "Ministry Coaching Program (MCP)",
                description: "Specialized coaching program for religious and ministry leaders.",
                features: ["Ministry Focus", "5 Months", "Leadership Training", "Spiritual Guidance"],
                popular: false,
                price: "Contact for Pricing"
              }
            ].map((program, index) => (
              <Card key={index} className="glass-card p-6 md:p-8 bg-white/20 border-white/40 hover:shadow-glow transition-all duration-500">
                {program.popular && (
                  <Badge className="bg-coaching-red text-white font-bold mb-4">
                    Most Popular
                  </Badge>
                )}
                
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>{program.title}</h3>
                <p className="text-white mb-4 md:mb-6 leading-relaxed text-sm md:text-base" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>{program.description}</p>
                
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-coaching-gold" />
                      <span className="text-white text-sm md:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-white/20">
                  <div className="text-base md:text-lg font-bold text-coaching-gold mb-3 md:mb-4" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>{program.price}</div>
                  <Button asChild className="w-full bg-coaching-gold hover:bg-coaching-gold-light text-coaching-navy font-bold">
                    <Link to={`/contact?programme=${encodeURIComponent(program.title)}`}>Learn More</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Life Coach Designations Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-navy via-coaching-royal-blue to-coaching-green">
        <div className="container mx-auto px-4 w-full overflow-hidden">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="bg-coaching-gold text-coaching-navy font-bold px-4 md:px-6 py-2 md:py-3 text-base md:text-lg mb-4 md:mb-6">
              <Target className="w-5 h-5 mr-2" />
              LIFE COACH DESIGNATIONS
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
              Choose Your{" "}
              <span className="bg-gradient-to-r from-coaching-gold to-coaching-gold-light bg-clip-text text-transparent">
                Specialization
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>
              Our Life Coaching Certification program offers 20+ specialized designations,
              allowing you to focus on your passion and serve specific client needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-2 sm:px-0">
            {[
              "Personal Coaching",
              "Relationship & Marital Coaching",
              "Business & Strategy Coaching",
              "Investment & Finance Coaching",
              "Spiritual Intelligence Coaching",
              "Ministry Coaching",
              "Teenage Coaching",
              "Youth Development Coaching",
              "Sex and Sexuality Coaching",
              "Mindshift Coaching",
              "Transformational Coaching",
              "Corporate & Executive Coaching",
              "Mental Health Coaching",
              "Lifestyle Health Coaching",
              "Communication Coaching",
              "Sales Coaching",
              "Peak Performance Coaching",
              "Leadership Coaching",
              "Management Coaching",
              "Human Design Systems Coaching"
            ].map((designation, index) => (
              <Card key={index} className="glass-card p-4 md:p-6 bg-white/20 border-white/40 hover:shadow-glow transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-coaching-gold to-coaching-orange rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-glow">
                    <Award className="w-6 h-6 text-coaching-navy" />
                  </div>
                  <h3 className="text-white font-bold text-sm md:text-base lg:text-lg group-hover:text-coaching-gold transition-colors text-center" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>
                    {designation}
                  </h3>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Button asChild className="bg-coaching-gold hover:bg-coaching-gold-light text-coaching-navy font-bold px-8 md:px-12 py-4 md:py-6 rounded-2xl text-lg md:text-xl shadow-glow hover:scale-105 transition-all duration-300">
              <Link to="/contact?programme=Life%20Coaching%20Certification"><BookOpen className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />Enroll in Life Coaching Certification</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Training;
