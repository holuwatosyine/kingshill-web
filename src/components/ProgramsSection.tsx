import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Brain, TrendingUp, GraduationCap, ArrowRight, Award, Clock } from "lucide-react";
import TiltCard from "@/components/animations/TiltCard";

export const ProgramsSection: React.FC = () => {
  const programs = [
    {
      icon: <GraduationCap className="w-8 h-8 text-[#ecc131]" />,
      title: "Life Coaching Certification",
      description:
        "The foundation of all our training - our professionally accredited life coaching certification program with international recognition. Includes multiple specialized designations.",
      badge: "Most Popular",
      badgeColor: "bg-red-600/30 text-red-300 border-red-500/40",
      image: "/IMG-20250827-WA0021.webp",
      features: [
        "Personal Coaching",
        "Business & Strategy Coaching",
        "Relationship & Marital Coaching",
        "Mental Health Coaching",
      ],
      duration: "6-12 months",
      price: "Premium Course",
    },
    {
      icon: <Brain className="w-8 h-8 text-[#ecc131]" />,
      title: "NLP Training Program",
      description:
        "Neuro-Linguistic Programming certification designed to teach advanced communication and influence techniques",
      badge: "Professional",
      badgeColor: "bg-purple-600/30 text-purple-300 border-purple-500/40",
      image: "/IMG-20250827-WA0022.webp",
      features: [
        "NLP-MP Certified",
        "International Recognition",
        "Practical Applications",
        "Advanced Techniques",
      ],
      duration: "3-6 months",
      price: "Specialized Course",
    },
    {
      icon: <Users className="w-8 h-8 text-[#ecc131]" />,
      title: "Corporate Coaching Program",
      description:
        "Specialized training for coaching larger corporates, their teams, and organizational development",
      badge: "Enterprise",
      badgeColor: "bg-blue-600/30 text-blue-300 border-blue-500/40",
      image: "/IMG-20250827-WA0018.webp",
      features: [
        "Corporate Focus",
        "Team Dynamics",
        "Leadership Development",
        "Organizational Change",
      ],
      duration: "4-8 months",
      price: "Enterprise Level",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-[#ecc131]" />,
      title: "Youth Coaching Program",
      description:
        "Transitional Youth Coaching Program designed to support young professionals in their career development",
      badge: "Specialized",
      badgeColor: "bg-emerald-600/30 text-emerald-300 border-emerald-500/40",
      image: "/IMG-20250827-WA0019.webp",
      features: [
        "Youth Focus",
        "Career Development",
        "Entrepreneurship",
        "Mentorship",
      ],
      duration: "2-4 months",
      price: "Student Friendly",
    },
  ];

  return (
    <section className="py-24 bg-[#070a12] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-amber-400/10 text-[#ecc131] border border-amber-400/30 font-bold px-6 py-2.5 text-xs sm:text-sm rounded-full inline-flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Study with us
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-outfit">
            Our diplomas and <span className="gradient-text-gold">programmes</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-dmsans">
            In addition to our life coaching core diploma, we offer a range of specialist programs you can study alongside or on their own.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {programs.map((program, index) => (
            <TiltCard key={index} className="w-full">
              <div className="liquid-border h-full">
                <Card className="liquid-border-inner h-full flex flex-col justify-between border-none glass-card p-0 overflow-hidden group">
                  <div>
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-transparent opacity-80" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${program.badgeColor} border font-bold px-3 py-1.5 rounded-lg text-xs`}>
                          {program.badge}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 glass-panel p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>

                    <CardHeader className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                          {program.icon}
                        </div>
                        <CardTitle className="text-xl sm:text-2xl font-bold text-white font-outfit group-hover:text-amber-400 transition-colors">
                          {program.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-slate-300 text-sm leading-relaxed font-dmsans">
                        {program.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-6 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {program.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="bg-white/[0.03] p-2.5 rounded-lg border border-white/[0.06] text-center"
                          >
                            <span className="text-xs font-medium text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-6 pt-0">
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 text-white font-bold py-5 rounded-xl text-sm transition-all duration-300 hover:opacity-90 shadow-lg group/btn"
                      onClick={() => (window.location.href = "/training")}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-10 py-6 rounded-xl text-base shadow-[0_0_25px_rgba(236,193,49,0.3)] transition-all duration-300 hover:scale-105"
            onClick={() => (window.location.href = "/training")}
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            View All Programs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
