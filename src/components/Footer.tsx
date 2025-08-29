import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import alphaprintLogo from "@/assets/alphaprint-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <img
                  src="https://todosmash.es/wp-content/uploads/2025/08/silverback_symbol_black_white-removebg-preview.png"
                  alt="Silverback Treatment"
                  className="w-20 h-20"
                />
              </Link>
              <Link to="/alphaprint" className="hover:opacity-80 transition-opacity">
                <img
                  src={alphaprintLogo}
                  alt="Alpha Print"
                  className="w-20 h-20"
                />
              </Link>
            </div>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Premium streetwear clothing designed for modern lifestyle and authentic style.
            </p>
            
            {/* Social links */}
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-4 text-sm">
              <div>
                <Link to="/">
                  <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary justify-start">
                    Home
                  </Button>
                </Link>
              </div>
              <div>
                <Link to="/products">
                  <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary justify-start">
                    Products
                  </Button>
                </Link>
              </div>
              <div>
                <Link to="/alphaprint">
                  <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary justify-start">
                    Alpha Print
                  </Button>
                </Link>
              </div>
              <div>
                <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary justify-start">
                  About Us
                </Button>
              </div>
              <div>
                <Link to="/customer-service">
                  <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary justify-start">
                    Contact
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <div className="space-y-4 text-sm">
              <div>
                <Link to="/shipping-info">
                  <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary justify-start">
                    Shipping Info
                  </Button>
                </Link>
              </div>
              <div>
                <Link to="/returns">
                  <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary justify-start">
                    Returns
                  </Button>
                </Link>
              </div>
              <div>
                <Link to="/privacy-policy">
                  <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary justify-start">
                    Privacy Policy
                  </Button>
                </Link>
              </div>
              <div>
                <Link to="/terms-of-service">
                  <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary justify-start">
                    Terms of Service
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <NewsletterSignup 
              placeholder="Enter your email"
              description="Get the latest updates on new products and exclusive offers."
            />
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <div>
            © 2024 Silverback Treatment. All rights reserved.
          </div>
          
          {/* Contact info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              <span>info@silverbacktreatment.se</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};