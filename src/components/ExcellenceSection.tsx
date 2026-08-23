import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, ArrowRight, Star, Trophy, Target, Globe } from "lucide-react";
import nigerianCorporate1 from "@/assets/nigerian-corporate-1.jpg";

export const ExcellenceSection: React.FC = () => {
  const achievements = [
    {
      icon: Award,
      title: "CCC Accredited",
      description: "Commonwealth Coaching Council recognized programs",
    },
    {
      icon: Trophy,
      title: "First in Nigeria",
      description: "Pioneer coaching academy since 1999",
    },
    {
      icon: Target,
      title: "1000+ Graduates",
      description: "Successfully trained professional coaches",
    },
    {
      icon: Globe,
      title: "International Standards",
      description: "World-class coaching education methodology",
    },
  ];

  return (
    <section className="py-24 bg-[#070a12] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <Badge className="bg-amber-400/10 text-[#ecc131] border border-amber-400/30 font-bold px-5 py-2 text-xs sm:text-sm rounded-full inline-flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Excellence in Coaching Education
            </Badge>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-outfit leading-tight">
              Setting the <span className="gradient-text-gold">standard for coaching</span> excellence in Nigeria
            </h2>

            <p className="text-slate-300 text-base sm:text-lg font-dmsans leading-relaxed">
              As Nigeria's first registered coaching academy, we've maintained our commitment to
              delivering world-class coaching education that transforms both coaches and their clients.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <Card
                    key={index}
                    className="glass-card border-white/10 p-5 rounded-2xl hover:border-amber-400/30 transition-all duration-300"
                  >
                    <CardContent className="p-0 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base font-outfit">
                          {achievement.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-1 font-dmsans leading-normal">
                          {achievement.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="pt-2">
              <Button
                size="lg"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-6 rounded-xl text-base shadow-[0_0_20px_rgba(236,193,49,0.3)] transition-all duration-300 hover:scale-105"
                onClick={() => (window.location.href = "/contact")}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Join Our Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="relative">
            <div className="liquid-border">
              <div className="liquid-border-inner overflow-hidden relative">
                <img
                  src={nigerianCorporate1}
                  alt="Excellence in Coaching Education at Kingshill Academy"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                        <Award className="w-5 h-5 text-slate-950" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm font-outfit">Quality Assurance</div>
                        <div className="text-slate-400 text-xs font-dmsans">ICF Standards</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs italic font-dmsans">
                    "Maintaining international standards while addressing local coaching needs"
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <Card className="absolute -top-6 -right-6 glass-panel p-4 text-center rounded-2xl border-amber-400/40 shadow-[0_0_20px_rgba(236,193,49,0.2)]">
              <div className="text-2xl font-extrabold text-amber-400 font-outfit">25+</div>
              <div className="text-xs text-white font-bold font-outfit">Years of</div>
              <div className="text-xs text-slate-300 font-dmsans">Excellence</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExcellenceSection;
