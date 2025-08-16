import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import blueHoodieFront from "@/assets/blue-hoodie-front.jpg";
import pinkHoodieFront from "@/assets/pink-hoodie-front.jpg";
import blackTeeFront from "@/assets/black-tee-front.jpg";
import wineRedTeeFront from "@/assets/wine-red-tee-front.jpg";
import peachTeeFront from "@/assets/peach-tee-front.jpg";
import whiteTeeNewFront from "@/assets/white-tee-new-front.jpg";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    hoverImage?: string;
    rating: number;
    reviews: number;
    badge?: string | null;
    category: string;
  };
  favorites: number[];
  onToggleFavorite: (productId: number) => void;
  viewMode?: "grid" | "list";
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const hoodieColors = ["White", "Black", "Blue", "Pink"];
const shortsColors = ["Black", "Military Green"];
const tshirtColors = ["White", "Black", "Wine Red", "Peach"];

export const ProductCard = ({ product, favorites, onToggleFavorite, viewMode = "grid" }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const { toast } = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.category === "T-Shirts" && (!selectedSize || !selectedColor)) {
      toast({
        title: "Please select size and color",
        description: "Choose both size and color before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    if ((product.category === "Hoodies") && (!selectedSize || !selectedColor)) {
      toast({
        title: "Please select size and color",
        description: "Choose both size and color before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    if (product.category === "Shorts" && (!selectedSize || !selectedColor)) {
      toast({
        title: "Please select size and color",
        description: "Choose both size and color before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getProductImage(),
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });

    const cartMessage = (product.category === "Shorts" || product.category === "Hoodies" || product.category === "T-Shirts")
      ? `${product.name} (Size ${selectedSize}, ${selectedColor}) has been added to your cart.`
      : `${product.name} (Size ${selectedSize}) has been added to your cart.`;

    toast({
      title: "Added to Cart",
      description: cartMessage,
    });
  };

  const getProductImage = () => {
    if (product.category === "Shorts" && selectedColor === "Military Green" && product.hoverImage) {
      return product.hoverImage;
    }
    
    if (product.category === "Hoodies" && selectedColor) {
      const colorImages: { [key: string]: string } = {
        "White": product.id === 1 ? product.image : "",
        "Black": product.id === 2 ? product.image : "",
        "Blue": blueHoodieFront,
        "Pink": pinkHoodieFront
      };
      return colorImages[selectedColor] || product.image;
    }

    if (product.category === "T-Shirts" && selectedColor) {
      const colorImages: { [key: string]: string } = {
        "White": whiteTeeNewFront,
        "Black": blackTeeFront,
        "Wine Red": wineRedTeeFront,
        "Peach": peachTeeFront
      };
      return colorImages[selectedColor] || product.image;
    }
    
    return product.image;
  };

  return (
    <Card className={`group bg-card border-border hover:shadow-medium transition-all duration-300 ${
      viewMode === "list" ? "flex flex-row" : ""
    }`}>
      <CardContent className={`p-0 ${viewMode === "list" ? "flex-shrink-0 w-64" : ""}`}>
        {/* Product image with link to detail page */}
        <Link to={`/products/${product.id}`}>
          <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
            <img
              src={getProductImage()}
              alt={product.name}
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                viewMode === "list" ? "w-64 h-48" : "w-full h-64"
              }`}
            />
            {product.hoverImage && (product.id === 1 || product.id === 2 || product.id === 3) && (
              <img
                src={product.hoverImage}
                alt={`${product.name} back view`}
                className={`absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  viewMode === "list" ? "w-64 h-48" : "w-full h-64"
                }`}
              />
            )}
            
            {/* Badge */}
            {product.badge && (
              <Badge 
                className={`absolute top-3 left-3 ${
                  product.badge === 'Best Seller' ? 'bg-success' :
                  product.badge === 'New' ? 'bg-primary' : 
                  product.badge === 'Sale' ? 'bg-destructive' : 'bg-warning'
                }`}
              >
                {product.badge}
              </Badge>
            )}
          </div>
        </Link>
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background"
          onClick={() => onToggleFavorite(product.id)}
        >
          <Heart 
            className={`h-4 w-4 ${
              favorites.includes(product.id) 
                ? 'fill-red-500 text-red-500' 
                : 'text-muted-foreground'
            }`} 
          />
        </Button>
      </CardContent>

      {/* Product info */}
      <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-warning fill-current'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>
        
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-price">
            €{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              €{product.originalPrice}
            </span>
          )}
        </div>

        {/* Size Selection */}
        {(product.category === "Hoodies" || product.category === "T-Shirts" || product.category === "Shorts") && (
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Size</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg z-50">
                {sizes.map((size) => (
                  <SelectItem key={size} value={size} className="hover:bg-accent">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Color Selection for Hoodies and Shorts */}
        {(product.category === "Shorts" || product.category === "Hoodies" || product.category === "T-Shirts") && (
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Color</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg z-50">
                {(product.category === "Shorts" ? shortsColors : 
                  product.category === "Hoodies" ? hoodieColors : 
                  tshirtColors).map((color) => (
                  <SelectItem key={color} value={color} className="hover:bg-accent">
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};