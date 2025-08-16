import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star, Heart, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import whiteHoodieFront from "@/assets/white-hoodie-front-new.jpg";
import whiteHoodieBack from "@/assets/white-hoodie-back-new.jpg";
import blackHoodieFront from "@/assets/black-hoodie-front-new.jpg";
import blackHoodieBack from "@/assets/black-hoodie-back-new.jpg";
import blueHoodieFront from "@/assets/blue-hoodie-front.jpg";
import pinkHoodieFront from "@/assets/pink-hoodie-front.jpg";
import blackTeeFront from "@/assets/black-tee-front.jpg";
import wineRedTeeFront from "@/assets/wine-red-tee-front.jpg";
import peachTeeFront from "@/assets/peach-tee-front.jpg";
import whiteTeeNewFront from "@/assets/white-tee-new-front.jpg";
import blackShorts from "@/assets/black-shorts.jpg";
import militaryGreenShorts from "@/assets/military-green-shorts.jpg";
import whiteTeeFront from "@/assets/white-tee-front.jpg";
import whiteTeeBack from "@/assets/white-tee-back.jpg";

// Extended products data (same as in Products.tsx)
const allProducts = [
  {
    id: 1,
    name: "Silverback White Hoodie",
    description: "Premium white hoodie with iconic Silverback Treatment logo",
    price: 52,
    originalPrice: null,
    image: whiteHoodieFront,
    hoverImage: whiteHoodieBack,
    images: [whiteHoodieFront, whiteHoodieBack],
    rating: 4.9,
    reviews: 145,
    badge: "Best Seller",
    category: "Hoodies",
    material: "80% Cotton, 20% Polyester",
    care: "Machine wash cold, tumble dry low",
    features: ["Soft fleece lining", "Adjustable drawstring hood", "Kangaroo pocket", "Ribbed cuffs and hem"]
  },
  {
    id: 2,
    name: "Silverback Black Hoodie",
    description: "Sleek black hoodie with embroidered Silverback logo",
    price: 52,
    originalPrice: null,
    image: blackHoodieFront,
    hoverImage: blackHoodieBack,
    images: [blackHoodieFront, blackHoodieBack],
    rating: 4.8,
    reviews: 132,
    badge: "New",
    category: "Hoodies",
    material: "80% Cotton, 20% Polyester",
    care: "Machine wash cold, tumble dry low",
    features: ["Soft fleece lining", "Adjustable drawstring hood", "Kangaroo pocket", "Ribbed cuffs and hem"]
  },
  {
    id: 3,
    name: "Silverback T-Shirt",
    description: "Essential cotton t-shirt with signature logo placement",
    price: 35,
    originalPrice: null,
    image: whiteTeeFront,
    images: [whiteTeeFront, whiteTeeBack, whiteTeeNewFront],
    rating: 4.9,
    reviews: 89,
    badge: null,
    category: "T-Shirts",
    material: "100% Premium Cotton",
    care: "Machine wash cold, tumble dry low",
    features: ["Pre-shrunk fabric", "Tagless label", "Classic fit", "Reinforced seams"]
  },
  {
    id: 4,
    name: "Silverback Shorts",
    description: "Comfortable streetwear shorts with premium fabric",
    price: 42,
    originalPrice: null,
    image: blackShorts,
    hoverImage: militaryGreenShorts,
    images: [blackShorts, militaryGreenShorts],
    rating: 4.6,
    reviews: 156,
    badge: null,
    category: "Shorts",
    material: "65% Cotton, 35% Polyester",
    care: "Machine wash cold, hang dry",
    features: ["Premium fabric", "Elastic waistband", "Perfect fit", "Durable construction"]
  }
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const hoodieColors = ["White", "Black", "Blue", "Pink"];
const shortsColors = ["Black", "Military Green"];
const tshirtColors = ["White", "Black", "Wine Red", "Peach"];

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();

  const product = allProducts.find(p => p.id === parseInt(id || ""));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Back Button */}
          <Link to="/products">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={getProductImage()}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <Badge 
                    className={`absolute top-4 left-4 ${
                      product.badge === 'Best Seller' ? 'bg-success' :
                      product.badge === 'New' ? 'bg-primary' : 
                      product.badge === 'Sale' ? 'bg-destructive' : 'bg-warning'
                    }`}
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square w-20 overflow-hidden rounded border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground text-lg">{product.description}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-warning fill-current'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-price">€{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    €{product.originalPrice}
                  </span>
                )}
              </div>

              <Separator />

              {/* Size Selection */}
              {(product.category === "Hoodies" || product.category === "T-Shirts" || product.category === "Shorts") && (
                <div>
                  <label className="text-base font-medium mb-3 block">Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Color Selection */}
              {(product.category === "Shorts" || product.category === "Hoodies" || product.category === "T-Shirts") && (
                <div>
                  <label className="text-base font-medium mb-3 block">Color</label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {(product.category === "Shorts" ? shortsColors : 
                        product.category === "Hoodies" ? hoodieColors : 
                        tshirtColors).map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="text-base font-medium mb-3 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
              </div>

              {/* Shipping Info */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <p className="text-sm text-muted-foreground">On orders over €50</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Easy Returns</p>
                      <p className="text-sm text-muted-foreground">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-sm text-muted-foreground">100% secure checkout</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Material & Care</h3>
                    <p className="text-muted-foreground mb-2"><strong>Material:</strong> {product.material}</p>
                    <p className="text-muted-foreground"><strong>Care Instructions:</strong> {product.care}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Features</h3>
                    <ul className="space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="text-muted-foreground">• {feature}</li>
                      ))}
                    </ul>
                  </div>

                  {(product.category === "Hoodies" || product.category === "T-Shirts") && (
                    <div>
                      <h3 className="font-semibold mb-3">Size Guide</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-border">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border border-border p-2 text-left">Size</th>
                              <th className="border border-border p-2 text-left">Chest (cm)</th>
                              <th className="border border-border p-2 text-left">Length (cm)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td className="border border-border p-2">XS</td><td className="border border-border p-2">86-91</td><td className="border border-border p-2">66</td></tr>
                            <tr><td className="border border-border p-2">S</td><td className="border border-border p-2">91-96</td><td className="border border-border p-2">69</td></tr>
                            <tr><td className="border border-border p-2">M</td><td className="border border-border p-2">96-101</td><td className="border border-border p-2">72</td></tr>
                            <tr><td className="border border-border p-2">L</td><td className="border border-border p-2">101-106</td><td className="border border-border p-2">75</td></tr>
                            <tr><td className="border border-border p-2">XL</td><td className="border border-border p-2">106-111</td><td className="border border-border p-2">78</td></tr>
                            <tr><td className="border border-border p-2">XXL</td><td className="border border-border p-2">111-116</td><td className="border border-border p-2">81</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Shipping Information</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p>• <strong>Standard Shipping:</strong> 3-5 business days (Free on orders over €50)</p>
                    <p>• <strong>Express Shipping:</strong> 1-2 business days (€9.99)</p>
                    <p>• <strong>Custom orders:</strong> 5-7 business days</p>
                    <p>• Orders placed before 2 PM are processed the same day</p>
                    <p>• We ship worldwide with tracking included</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <h3 className="font-semibold">Customer Reviews</h3>
                  <div className="text-center text-muted-foreground">
                    <p>Reviews feature coming soon!</p>
                    <p>Be the first to review this product.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;