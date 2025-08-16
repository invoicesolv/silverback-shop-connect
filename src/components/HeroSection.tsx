import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-hoodie-back.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] hero-gradient overflow-hidden">
      {/* Mobile Video Background */}
      <div className="lg:hidden absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="https://todosmash.es/wp-content/uploads/2025/08/2025-04-12-224243029_1.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Desktop Background Image */}
      <div 
        className="hidden lg:block absolute inset-0 bg-cover bg-right bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      
      <div className="relative container mx-auto px-4 py-24 flex items-center min-h-[600px]">
        <div className="max-w-2xl animate-slide-up mr-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Premium Treatment Solutions</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">SILVERBACK</span>
            <br />
            <span className="text-foreground">TREATMENT</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            We're not just a motivational clothing brand — we're a movement.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Inspiring</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="block">
              <Button 
                size="lg" 
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about" className="block">
              <Button 
                variant="outline" 
                size="lg"
                className="h-14 px-8 border-primary/20 hover:border-primary w-full"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-20 animate-float">
        <div className="w-16 h-16 bg-primary/20 rounded-full blur-xl" />
      </div>
      <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-24 h-24 bg-accent/20 rounded-full blur-xl" />
      </div>
    </section>
  );
};