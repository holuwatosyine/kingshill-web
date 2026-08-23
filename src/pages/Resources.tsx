import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Download, FileText, Users, Clock, Star, ArrowRight } from "lucide-react";
import resourceImage1 from "@/assets/img-20250827-wa0023.jpg";
import resourceImage2 from "@/assets/img-20250827-wa0010.jpg";
import resourceImage3 from "@/assets/img-20250827-wa0012.jpg";
import { Link } from "react-router-dom";

const Resources = () => {
  const resourceCategories = [
    {
      title: "Free eBooks & Guides",
      icon: <BookOpen className="w-8 h-8" />,
      gradient: "bg-gradient-primary",
      resources: [
        {
          title: "The Complete Guide to Life Coaching",
          description: "A comprehensive introduction to life coaching principles and practices",
          type: "PDF Guide",
          pages: "45 pages",
          downloads: "2,500+"
        },
        {
          title: "NLP Fundamentals Workbook", 
          description: "Practical exercises and techniques for mastering NLP basics",
          type: "Interactive Workbook",
          pages: "62 pages", 
          downloads: "1,800+"
        },
        {
          title: "Youth Coaching Strategies",
          description: "Effective approaches for coaching young people and teenagers",
          type: "Strategy Guide",
          pages: "38 pages",
          downloads: "1,200+"
        }
      ]
    },
    {
      title: "Video Tutorials & Webinars",
      icon: <Video className="w-8 h-8" />,
      gradient: "bg-gradient-secondary", 
      resources: [
        {
          title: "Introduction to Coaching Skills",
          description: "Learn the foundational skills every coach needs to succeed",
          type: "Video Series",
          duration: "2.5 hours",
          views: "5,000+"
        },
        {
          title: "Building Your Coaching Practice",
          description: "Step-by-step guide to starting and growing your coaching business",
          type: "Masterclass",
          duration: "90 minutes",
          views: "3,200+"
        },
        {
          title: "Advanced NLP Techniques",
          description: "Deep dive into advanced NLP methods for experienced practitioners",
          type: "Workshop Recording",
          duration: "3 hours",
          views: "2,800+"
        }
      ]
    },
    {
      title: "Templates & Tools",
      icon: <FileText className="w-8 h-8" />,
      gradient: "bg-gradient-accent",
      resources: [
        {
          title: "Coaching Session Planner",
          description: "Structured templates for planning effective coaching sessions",
          type: "Template Pack",
          files: "12 templates",
          downloads: "4,200+"
        },
        {
          title: "Client Assessment Forms",
          description: "Professional forms for initial client consultations and ongoing assessments",
          type: "Form Collection",
          files: "8 forms",
          downloads: "3,500+"
        },
        {
          title: "Goal Setting Worksheets",
          description: "Interactive worksheets to help clients set and achieve their goals",
          type: "Worksheet Set",
          files: "15 worksheets",
          downloads: "5,100+"
        }
      ]
    }
  ];

  const featuredResources = [
    {
      title: "Coaching Excellence Handbook",
      description: "Our most comprehensive resource covering all aspects of professional coaching",
      type: "Premium Guide",
      size: "120 pages",
      rating: 4.9,
      reviews: 450,
      gradient: "bg-gradient-primary"
    },
    {
      title: "Master Coach Certification Path",
      description: "Complete roadmap to achieving ICF Master Certified Coach status",
      type: "Learning Path",
      modules: "12 modules",
      rating: 4.8,
      reviews: 280,
      gradient: "bg-gradient-secondary"
    }
  ];

  return (
    <div className="min-h-screen" id="main-content">
      <Navigation />
      {/* Hero Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-coaching-navy via-coaching-navy-light to-coaching-royal-blue relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-coaching-gold/20 rounded-full animate-float blur-3xl"></div>
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-coaching-red/25 rounded-full animate-float-delayed blur-2xl"></div>
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-coaching-green/20 rounded-full animate-float blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-8 mb-20">
            <Badge className="glass-card bg-coaching-gold/20 text-coaching-gold border-coaching-gold/30 font-bold px-6 py-3 text-lg">
              <Download className="w-5 h-5 mr-2" />
              Free Resources
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)'}}>
              Coaching <span className="bg-gradient-to-r from-coaching-gold to-coaching-green bg-clip-text text-transparent">Resources & Tools</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-4xl mx-auto leading-relaxed" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
              Access our library of free guides, templates, and training materials to enhance your coaching journey
            </p>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-royal-blue via-coaching-green to-coaching-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>Featured Resources</h2>
            <p className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>Our most popular and comprehensive coaching resources</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20 px-2 sm:px-0">
            {featuredResources.map((resource, index) => (
              <Card key={index} className="glass-card border-0 shadow-glow rounded-2xl md:rounded-3xl hover:scale-[1.02] transition-all duration-500 bg-white/20 border-white/40">
                <CardContent className="p-6 md:p-8 lg:p-12">
                  <div className="space-y-6">
                    <div className={`w-16 h-16 ${resource.gradient} rounded-2xl flex items-center justify-center text-white mx-auto shadow-glow`}>
                      <BookOpen className="w-8 h-8" />
                    </div>
                    
                    <div className="text-center space-y-3 md:space-y-4">
                      <h3 className="text-xl md:text-2xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>{resource.title}</h3>
                      <p className="text-white text-base md:text-lg leading-relaxed" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>{resource.description}</p>
                      
                      <div className="flex items-center justify-center gap-4 md:gap-6 text-white text-sm md:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>
                        <span className="text-coaching-gold font-semibold">{resource.type}</span>
                        <span>•</span>
                        <span>{resource.size || resource.modules}</span>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-coaching-gold fill-current" />
                          ))}
                        </div>
                        <span className="text-white font-semibold" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>{resource.rating}</span>
                        <span className="text-white text-sm" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>({resource.reviews} reviews)</span>
                      </div>
                    </div>

                    <Button asChild className="w-full bg-coaching-gold hover:bg-coaching-gold-light text-coaching-navy font-bold py-4 rounded-xl text-lg">
                      <a href={`mailto:PG@kingshillcoachingacademy.org?subject=${encodeURIComponent(`Resource request: ${resource.title}`)}`}><Download className="w-5 h-5 mr-2" />Download Free</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-navy via-coaching-royal-blue to-coaching-green">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {resourceCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-8">
                <div className="text-center space-y-3 md:space-y-4">
                  <div className={`w-16 md:w-20 h-16 md:h-20 ${category.gradient} rounded-2xl md:rounded-3xl flex items-center justify-center text-white mx-auto shadow-glow`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>{category.title}</h3>
                </div>

                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 sm:px-0">
                  {category.resources.map((resource, index) => (
                    <Card key={index} className="glass-card border-0 shadow-glow rounded-2xl md:rounded-3xl hover:scale-105 transition-all duration-500 bg-white/20 border-white/40">
                      <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6">
                        <div className="space-y-3 md:space-y-4">
                          <h4 className="text-lg md:text-xl font-bold text-white" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>{resource.title}</h4>
                          <p className="text-white leading-relaxed text-sm md:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>{resource.description}</p>
                          
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <Badge className="bg-coaching-gold/20 text-coaching-gold border-coaching-gold/30 font-semibold">
                              {resource.type}
                            </Badge>
                            <span className="text-coaching-gold font-semibold text-xs md:text-sm" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>
                              {resource.pages || resource.duration || resource.files}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-white text-xs md:text-sm" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>
                            <Users className="w-4 h-4" />
                            <span>{resource.downloads || resource.views}</span>
                          </div>
                        </div>

                        <Button asChild className="w-full bg-coaching-gold/20 hover:bg-coaching-gold hover:text-coaching-navy text-coaching-gold border-coaching-gold/30 font-bold py-3 rounded-xl">
                          <a href={`mailto:PG@kingshillcoachingacademy.org?subject=${encodeURIComponent(`Resource request: ${resource.title}`)}`}><Download className="w-4 h-4 mr-2" />Get Resource</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-coaching-gold via-coaching-gold-light to-coaching-green">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-coaching-navy">
              Need More Personalized Support?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-coaching-navy">
              While these resources are great for self-learning, nothing beats personalized training and mentorship
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Button asChild size="lg" className="bg-coaching-navy hover:bg-coaching-green text-white font-bold px-8 md:px-12 py-4 md:py-6 rounded-xl text-base md:text-lg">
                <Link to="/training"><ArrowRight className="w-5 h-5 mr-2" />Explore Our Programs</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-coaching-navy text-coaching-navy hover:bg-coaching-navy hover:text-white font-bold px-8 md:px-12 py-4 md:py-6 rounded-xl text-base md:text-lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
