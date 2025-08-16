import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import alphaprintImage from "@/assets/alphaprint-section.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProductGrid />
        
        {/* AlphaPrint Section */}
        <section className="py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-12 items-center">
              {/* Image */}
              <div className="order-2 lg:order-1">
                <img
                  src={alphaprintImage}
                  alt="AlphaPrint Custom Merch"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              
              {/* Content */}
              <div className="order-1 lg:order-2 space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-primary">AlphaPrint</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We've also launched Alphaprint — your go-to creative hub for custom merch. Whether it's gear for your business, unforgettable birthday designs, or turning old clothes into bold statements — we've got you covered.
                </p>
                <div className="pt-4">
                  <Link to="/alphaprint">
                    <Button size="lg" className="h-14 px-8">
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
