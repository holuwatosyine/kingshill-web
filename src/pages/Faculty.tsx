import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, Users, Mail, Star } from "lucide-react";
import { Link } from "react-router-dom";
import facultyImage1 from "@/assets/img-20250827-wa0012.jpg";
import facultyImage2 from "@/assets/img-20250827-wa0009.jpg";
import facultyImage3 from "@/assets/img-20250827-wa0024.jpg";

const Faculty = () => {
  const facultyMembers = [
    {
      name: "Prof. Adebayo Olumide",
      title: "Director & Lead Coach",
      credentials: "CCC-MCC, PhD Psychology",
      specialization: "Leadership & Executive Coaching",
      experience: "20+ years",
      image: facultyImage1,
      bio: "A pioneer in coaching education in Nigeria with extensive experience in leadership development and organizational psychology.",
      achievements: ["CCC Master Certified Coach", "Published Author", "International Speaker"],
      courses: ["Executive Coaching", "Leadership Development", "NLP Master Practitioner"]
    },
    {
      name: "Dr. Kemi Adebisi", 
      title: "Senior Faculty Member",
      credentials: "CCC-PCC, MSc Counselling Psychology",
      specialization: "Life Coaching & Personal Development",
      experience: "15+ years",
      image: facultyImage2,
      bio: "Expert in transformational coaching with a passion for empowering individuals to discover their purpose and achieve their goals.",
      achievements: ["CCC Professional Certified Coach", "Certified NLP Trainer", "Youth Development Expert"],
      courses: ["Life Coaching Fundamentals", "Personal Development", "Youth Coaching"]
    },
    {
      name: "Mr. Emeka Okonkwo",
      title: "Business Coaching Specialist", 
      credentials: "CCC-ACC, MBA Business Administration",
      specialization: "Business & Career Coaching",
      experience: "12+ years",
      image: facultyImage3,
      bio: "Former corporate executive turned coach, specializing in business development and career transition coaching.",
      achievements: ["CCC Associate Certified Coach", "Business Consultant", "Career Development Specialist"],
      courses: ["Business Coaching", "Career Transition", "Entrepreneurship Development"]
    }
  ];

  return (
    <div className="min-h-screen" id="main-content">
      <Navigation />
      {/* Hero Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-coaching-navy via-coaching-navy-light to-coaching-royal-blue relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-coaching-gold/20 rounded-full animate-float blur-3xl"></div>
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-coaching-royal-blue/25 rounded-full animate-float-delayed blur-2xl"></div>
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-coaching-green/20 rounded-full animate-float blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-8 mb-20">
            <Badge className="glass-card bg-coaching-gold/20 text-coaching-gold border-coaching-gold/30 font-bold px-6 py-3 text-lg">
              <Award className="w-5 h-5 mr-2" />
              Meet Our Faculty
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              World-Class <span className="bg-gradient-to-r from-coaching-gold to-coaching-green bg-clip-text text-transparent">Coaching Experts</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Learn from Nigeria's most experienced and internationally certified coaching professionals
            </p>
          </div>
        </div>
      </section>

      {/* Faculty Members */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-navy via-coaching-royal-blue to-coaching-green">
        <div className="container mx-auto px-4">
          <div className="space-y-8 md:space-y-12">
            {facultyMembers.map((member, index) => (
              <Card key={index} className="glass-card border-0 shadow-glow rounded-2xl md:rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-700 bg-white/20 border-white/40">
                <CardContent className="p-0">
                  <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Image */}
                    <div className={`relative h-64 md:h-80 lg:h-auto ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <img 
                        src={member.image} 
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-overlay opacity-30"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 md:p-8 lg:p-12 space-y-6 md:space-y-8">
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-coaching-gold rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-coaching-navy" />
                          </div>
                          <Badge className="bg-coaching-green/20 text-coaching-green border-coaching-green/30">
                            {member.experience}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>{member.name}</h3>
                        <p className="text-lg md:text-xl text-coaching-gold font-semibold" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>{member.title}</p>
                        <p className="text-base md:text-lg text-white" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>{member.credentials}</p>
                        <p className="text-coaching-gold font-semibold text-sm md:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Specialization: {member.specialization}</p>
                      </div>

                      <p className="text-white text-base md:text-lg leading-relaxed" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>{member.bio}</p>

                      {/* Achievements */}
                      <div className="space-y-3 md:space-y-4">
                        <h4 className="text-lg md:text-xl font-bold text-white flex items-center gap-3" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>
                          <Award className="w-5 h-5 text-coaching-gold" />
                          Key Achievements
                        </h4>
                        <div className="grid gap-2">
                          {member.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-center gap-3 text-white text-sm md:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>
                              <Star className="w-4 h-4 text-coaching-gold fill-current" />
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Courses */}
                      <div className="space-y-3 md:space-y-4">
                        <h4 className="text-lg md:text-xl font-bold text-white flex items-center gap-3" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>
                          <BookOpen className="w-5 h-5 text-coaching-gold" />
                          Courses Taught
                        </h4>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                          {member.courses.map((course, i) => (
                            <Badge key={i} className="bg-coaching-green/20 text-coaching-green border-coaching-green/30 text-xs md:text-sm">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <Button asChild className="bg-coaching-gold hover:bg-coaching-gold-light text-coaching-navy font-bold">
                          <Link to={`/contact?faculty=${encodeURIComponent(member.name)}`}><Mail className="w-4 h-4 mr-2" />Contact</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-royal-blue via-coaching-green to-coaching-gold">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-coaching-navy">
              Ready to Learn from the Best?
            </h2>
            <p className="text-xl text-coaching-navy/80">
              Join our internationally accredited programs and learn from Nigeria's top coaching professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-coaching-navy hover:bg-coaching-green text-white font-bold px-12 py-6 rounded-xl text-lg">
                <Link to="/training">View Programs</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-coaching-navy text-coaching-navy hover:bg-coaching-navy hover:text-white font-bold px-12 py-6 rounded-xl text-lg">
                <Link to="/contact">Book Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Faculty;
