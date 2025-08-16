import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContactModal } from "./ContactModal";
import { CartSheet } from "./CartSheet";
import { Menu, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
const logoImage = "https://todosmash.es/wp-content/uploads/2025/08/silverback_symbol_black_white-removebg-preview.png";

export const Header = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartItems = getTotalItems();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logoImage}
              alt="Silverback Treatment"
              className="h-24 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Home
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Products
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                About
              </Button>
            </Link>
            <Link to="/alphaprint">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Alpha Print
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => setIsContactOpen(true)}
              className="border-primary/20 hover:border-primary"
            >
              Contact
            </Button>
          </nav>

          {/* Cart and Menu */}
          <div className="flex items-center gap-2">
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-accent"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <ContactModal open={isContactOpen} onOpenChange={setIsContactOpen} />
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};