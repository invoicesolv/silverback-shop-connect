import { AlphaPrintHeader } from "@/components/AlphaPrintHeader";
import { AlphaPrintFooter } from "@/components/AlphaPrintFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Upload, Palette, Zap, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { alphaprintProducts } from "@/data/alphaprintProducts";
import alphaprintImage from "@/assets/alphaprint-section.jpg";
import alphaprintHeroBg from "@/assets/alpha-print.mp4";

const AlphaPrint = () => {
  const featuredProducts = alphaprintProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AlphaPrintHeader />
      <main>
        {/* Hero Section */}
        <section className="py-4 relative overflow-hidden min-h-[65vh] flex items-center">
          {/* Video Background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src={alphaprintHeroBg} type="video/mp4" />
          </video>
          
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          
          <div className="container mx-auto px-4 relative z-20">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-sm border-white/30 text-white">
                Premium Custom Printing
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                Alpha<span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Print</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-md">
                Transform your ideas into premium custom merchandise. Upload your design, 
                choose your product, and we'll bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link to="/alphaprint/products">
                  <Button size="lg" className="h-14 px-8">
                    Start Designing
                    <Palette className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/alphaprint/quote">
                  <Button size="lg" variant="outline" className="h-14 px-8">
                    Get Custom Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground">Simple steps to get your custom merch</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">1. Upload Design</h3>
                <p className="text-muted-foreground">
                  Upload your design files (PDF, PNG, AI, PSD) or use our design tool to create from scratch.
                </p>
              </div>
              
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Palette className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">2. Customize Product</h3>
                <p className="text-muted-foreground">
                  Choose your product, colors, sizes, and placement. See instant previews of your design.
                </p>
              </div>
              
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">3. Fast Production</h3>
                <p className="text-muted-foreground">
                  We'll produce and ship your order with industry-leading turnaround times.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">Featured Products</h2>
              <p className="text-xl text-muted-foreground">Our most popular items for custom printing</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">4.8</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                    <CardDescription className="mb-4 line-clamp-2">
                      {product.description}
                    </CardDescription>
                    <div className="text-2xl font-bold text-primary">
                      ${product.basePrice}
                      <span className="text-sm font-normal text-muted-foreground ml-1">starting</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Link to={`/alphaprint/products/${product.id}`} className="w-full">
                      <Button className="w-full">
                        Customize Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/alphaprint/products">
                <Button size="lg" variant="outline">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-primary">
                  Why Choose AlphaPrint?
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Premium Quality Materials</h4>
                      <p className="text-muted-foreground">
                        We use only the highest quality fabrics and printing techniques to ensure your designs look amazing and last long.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Lightning Fast Turnaround</h4>
                      <p className="text-muted-foreground">
                        Most orders ship within 3-5 business days. Rush orders available for urgent deadlines.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Design Support</h4>
                      <p className="text-muted-foreground">
                        Our design team can help optimize your artwork for the best printing results, completely free.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">No Minimum Orders</h4>
                      <p className="text-muted-foreground">
                        Order just one item or thousands - we handle orders of any size with the same care and quality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image */}
              <div>
                <img
                  src={alphaprintImage}
                  alt="AlphaPrint Custom Merch"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Bring Your Ideas to Life?
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Join thousands of satisfied customers who trust AlphaPrint for their custom merchandise needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link to="/alphaprint/products">
                  <Button size="lg" variant="secondary" className="h-14 px-8">
                    Start Designing Now
                  </Button>
                </Link>
                <Link to="/alphaprint/quote">
                  <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-primary h-14 px-8">
                    Get Custom Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <AlphaPrintFooter />
    </div>
  );
};

export default AlphaPrint;