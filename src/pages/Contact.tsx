import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Globe } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Our Location", 
      details: "No #14 Adedotun Dina Street, Mende - Maryland, Lagos",
      gradient: "bg-gradient-primary"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Numbers",
      details: "09090550072, 09090550073",
      gradient: "bg-gradient-secondary"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Address",
      details: "pg@thecoachingnations.com",
      gradient: "bg-gradient-accent"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Office Hours",
      details: "Mon - Fri: 9:00 AM - 6:00 PM",
      gradient: "bg-coaching-green"
    }
  ];

  const officeLocations = [
    {
      city: "Lagos",
      address: "No #14 Adedotun Dina Street, Mende - Maryland",
      phone: "09090550072",
      type: "Head Office"
    },
    {
      city: "Abuja", 
      address: "Suite 45, Central Business District",
      phone: "09090550073",
      type: "Regional Office"
    },
    {
      city: "Port Harcourt",
      address: "15 Trans Amadi Industrial Layout",
      phone: "09090550074", 
      type: "Regional Office"
    }
  ];

  return (
    <div className="min-h-screen" id="main-content">
      <Navigation />
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-coaching-navy via-coaching-navy-light to-coaching-navy">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-coaching-gold/20 rounded-full animate-float blur-3xl"></div>
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-coaching-red/25 rounded-full animate-float-delayed blur-2xl"></div>
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-coaching-green/20 rounded-full animate-float blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-8 mb-20">
            <Badge className="glass-card bg-coaching-gold/20 text-coaching-gold border-coaching-gold/30 font-bold px-6 py-3 text-lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Get In Touch
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)'}}>
              Contact <span className="bg-gradient-to-r from-coaching-gold to-coaching-green bg-clip-text text-transparent">Kingshill</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-4xl mx-auto leading-relaxed" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
              Ready to start your coaching journey? We're here to help you every step of the way
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding bg-gradient-to-br from-coaching-navy-light via-coaching-green to-coaching-gold">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 px-2 sm:px-0">
            {contactInfo.map((info, index) => (
              <Card key={index} className="glass-card border-0 shadow-glow rounded-3xl hover:scale-105 transition-all duration-500">
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-16 h-16 ${info.gradient} rounded-2xl flex items-center justify-center text-white mx-auto shadow-glow`}>
                    {info.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>{info.title}</h3>
                    <p className="text-white text-sm sm:text-base leading-relaxed" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>{info.details}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="section-padding bg-gradient-to-br from-coaching-navy via-coaching-navy-light to-coaching-purple">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <Card className="glass-card border-0 shadow-glow rounded-3xl">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="space-y-8">
                  <div className="text-center space-y-3 md:space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>Send us a Message</h2>
                    <p className="text-white text-base sm:text-lg" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>Fill out the form below and we'll get back to you within 24 hours</p>
                  </div>

                  <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); window.location.href = "mailto:pg@thecoachingnations.com?subject=Kingshill%20website%20enquiry"; }}>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-white font-semibold text-sm sm:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>First Name</label>
                        <Input 
                          placeholder="Enter your first name"
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-coaching-gold h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white font-semibold text-sm sm:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Last Name</label>
                        <Input 
                          placeholder="Enter your last name"
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-coaching-gold h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-white font-semibold text-sm sm:text-base" style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'}}>Email Address</label>
                      <Input 
                        type="email"
                        placeholder="Enter your email address"
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-coaching-gold h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-white font-semibold">Phone Number</label>
                      <Input 
                        type="tel"
                        placeholder="Enter your phone number"
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-coaching-gold h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-white font-semibold">Subject</label>
                      <Input 
                        placeholder="What's this about?"
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-coaching-gold h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-white font-semibold">Message</label>
                      <Textarea 
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-coaching-gold resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-white text-coaching-red hover:bg-coaching-gold hover:text-coaching-navy font-bold py-4 rounded-xl text-lg">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <div className="space-y-6 md:space-y-8">
              <div className="text-center space-y-3 md:space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>Our Locations</h2>
                <p className="text-white/80 text-lg">Visit us at any of our office locations across Nigeria</p>
              </div>

              <div className="space-y-6">
                {officeLocations.map((location, index) => (
                  <Card key={index} className="glass-card border-0 shadow-glow rounded-3xl hover:scale-[1.02] transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="w-12 h-12 bg-coaching-gold rounded-2xl flex items-center justify-center text-coaching-navy flex-shrink-0">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white">{location.city}</h3>
                            <Badge className="bg-coaching-gold/20 text-coaching-gold border-coaching-gold/30">
                              {location.type}
                            </Badge>
                          </div>
                          <p className="text-white/80">{location.address}</p>
                          <div className="flex items-center gap-2 text-white/70">
                            <Phone className="w-4 h-4 text-coaching-gold" />
                            <span>{location.phone}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map Placeholder */}
              <Card className="glass-card border-0 shadow-glow rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-64 bg-gradient-accent flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-coaching-navy rounded-full flex items-center justify-center mx-auto">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-coaching-navy">
                        <h4 className="font-bold text-lg">Interactive Map</h4>
                        <p>Find directions to our locations</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding bg-gradient-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-coaching-navy">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-coaching-navy/80">
              Have questions? Check our FAQ section or contact us directly for personalized answers
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-coaching-navy hover:bg-coaching-green text-white font-bold px-12 py-6 rounded-xl text-lg" onClick={() => { window.location.href = "/resources"; }}>
                <Users className="w-5 h-5 mr-2" />
                View FAQ
              </Button>
              <Button asChild size="lg" variant="outline" className="border-coaching-navy text-coaching-navy hover:bg-coaching-navy hover:text-white font-bold px-12 py-6 rounded-xl text-lg">
                <a href="tel:+2349090550072">Schedule Call</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
