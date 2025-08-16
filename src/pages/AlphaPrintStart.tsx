import { AlphaPrintHeader } from "@/components/AlphaPrintHeader";
import { AlphaPrintFooter } from "@/components/AlphaPrintFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Palette, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const AlphaPrintStart = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AlphaPrintHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-6">
            Choose Your Path
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            How would you like to create your custom merchandise?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Browse Products */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Browse & Upload</CardTitle>
              <CardDescription className="text-base">
                Choose from our product catalog and upload your design
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Select from hoodies, t-shirts, caps</li>
                <li>• Upload PDF, PNG, AI, PSD files</li>
                <li>• Instant price calculation</li>
                <li>• Live product preview</li>
              </ul>
              <Link to="/alphaprint/products">
                <Button className="w-full h-12">
                  Start Here
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Design Tool */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Design Tool</CardTitle>
              <CardDescription className="text-base">
                Create your design from scratch with our online editor
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Add text, shapes, and images</li>
                <li>• Choose fonts and colors</li>
                <li>• Drag & drop interface</li>
                <li>• Export your creation</li>
              </ul>
              <Link to="/alphaprint/products">
                <Button variant="outline" className="w-full h-12">
                  Create Design
                  <Palette className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Custom Quote */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Custom Quote</CardTitle>
              <CardDescription className="text-base">
                Need something special? Get a personalized quote
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Bulk orders & discounts</li>
                <li>• Special materials</li>
                <li>• Complex projects</li>
                <li>• Corporate solutions</li>
              </ul>
              <Link to="/alphaprint/quote">
                <Button variant="outline" className="w-full h-12">
                  Get Quote
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Process Flow */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-8">
            Simple 4-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-primary-foreground font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Choose Product</h3>
              <p className="text-sm text-muted-foreground">Select your item and options</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-primary-foreground font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Design</h3>
              <p className="text-sm text-muted-foreground">Upload or create your design</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-primary-foreground font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Review</h3>
              <p className="text-sm text-muted-foreground">Preview and approve</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-primary-foreground font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Order</h3>
              <p className="text-sm text-muted-foreground">Place order and ship</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Questions? Need help deciding?
          </p>
          <Link to="/alphaprint/quote">
            <Button variant="outline">
              Contact Our Team
              <MessageSquare className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
      
      <AlphaPrintFooter />
    </div>
  );
};

export default AlphaPrintStart;