import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import alphaprintLogo from "@/assets/alphaprint-logo-new.png";

export const AlphaPrintFooter = () => {
  return (
    <footer className="bg-card text-card-foreground border-t border-border/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/alphaprint" className="flex items-center space-x-2">
              <img 
                src={alphaprintLogo} 
                alt="AlphaPrint" 
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm">
              Your creative hub for custom merchandise. Bringing your vision to life with quality and style.
            </p>
            <div className="flex space-x-4">
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/alphaprint/products/hoodies" className="text-muted-foreground hover:text-primary transition-colors">Hoodies</Link></li>
              <li><Link to="/alphaprint/products/t-shirts" className="text-muted-foreground hover:text-primary transition-colors">T-Shirts</Link></li>
              <li><Link to="/alphaprint/products/caps" className="text-muted-foreground hover:text-primary transition-colors">Caps</Link></li>
              <li><Link to="/alphaprint/products/accessories" className="text-muted-foreground hover:text-primary transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/alphaprint/design" className="text-muted-foreground hover:text-primary transition-colors">Design Tool</Link></li>
              <li><Link to="/alphaprint/quote" className="text-muted-foreground hover:text-primary transition-colors">Custom Quote</Link></li>
              <li><Link to="/alphaprint/bulk" className="text-muted-foreground hover:text-primary transition-colors">Bulk Orders</Link></li>
              <li><Link to="/alphaprint/templates" className="text-muted-foreground hover:text-primary transition-colors">Templates</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@silverbacktreatment.se</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@silverbacktreatment.se</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+46 (0) 123 456 789</span>
              </li>
              <li>
                <Link to="/customer-service" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 AlphaPrint by Silverback Treatment. All rights reserved. | 
            <Link to="/privacy-policy" className="hover:text-primary transition-colors ml-1">Privacy Policy</Link> | 
            <Link to="/terms-of-service" className="hover:text-primary transition-colors ml-1">Terms of Service</Link> | 
            <Link to="/" className="hover:text-primary transition-colors ml-1">← Back to Silverback Treatment</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};