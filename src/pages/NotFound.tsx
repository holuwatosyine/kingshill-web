import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="kh-subpage min-h-screen flex items-center justify-center bg-gradient-to-br from-coaching-navy via-coaching-green to-coaching-gold relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-coaching-gold/20 rounded-full animate-float blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-coaching-red/20 rounded-full animate-float-delayed blur-2xl"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-coaching-green/30 rounded-full animate-float blur-xl"></div>
      </div>

      <div id="main-content" className="text-center relative z-10 max-w-2xl mx-auto px-4">
        <Badge className="bg-coaching-gold text-coaching-navy font-bold px-6 py-3 text-lg mb-8">
          404 Error
        </Badge>
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page <span className="bg-gradient-to-r from-coaching-gold to-coaching-green bg-clip-text text-transparent">Not Found</span>
        </h2>
        <p className="text-xl text-white/90 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back to discovering your potential.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-coaching-gold text-coaching-navy hover:bg-coaching-gold-light font-bold px-8 py-4 rounded-xl text-lg"
          >
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-coaching-navy font-bold px-8 py-4 rounded-xl text-lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
