import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Zap, Users, Palette, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">ABOUT</span>
              <br />
              <span className="text-foreground">SILVERBACK</span>
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Our mission is to ignite ambition, push boundaries, and inspire people to break free from the 9-to-5 grind and chase their dreams unapologetically.
              </p>
            </div>
          </div>

          {/* Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-card border-border hover:shadow-medium transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Ignite Ambition</h3>
                <p className="text-muted-foreground">
                  We fuel the fire within you to pursue your passions and reach for greatness.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-medium transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Push Boundaries</h3>
                <p className="text-muted-foreground">
                  Breaking limits isn't just what we do — it's who we are. Challenge everything.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-medium transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Inspire Freedom</h3>
                <p className="text-muted-foreground">
                  Break free from the ordinary. Your dreams deserve more than a cubicle.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alphaprint Section */}
          <div className="bg-muted/30 rounded-2xl p-8 md:p-12 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Palette className="h-10 w-10 text-primary" />
              </div>
              
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-gradient">ALPHAPRINT</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                We've also launched Alphaprint — your go-to creative hub for custom merch. Whether it's gear for your business, unforgettable birthday designs, or turning old clothes into bold statements — we've got you covered.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Business Merch</h4>
                  <p className="text-sm text-muted-foreground">Professional gear that represents your brand</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Custom Designs</h4>
                  <p className="text-sm text-muted-foreground">Unforgettable designs for special occasions</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Upcycling</h4>
                  <p className="text-sm text-muted-foreground">Transform old clothes into bold statements</p>
                </div>
              </div>

              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Alphaprint
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join the <span className="text-gradient">Movement</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't just wear the brand — become part of the revolution. It's time to unleash your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:border-primary">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;