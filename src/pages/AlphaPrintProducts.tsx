import { useState, useEffect } from "react";
import { AlphaPrintHeader } from "@/components/AlphaPrintHeader";
import { AlphaPrintFooter } from "@/components/AlphaPrintFooter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Upload, Palette, Eye } from "lucide-react";
import { alphaprintProducts } from "@/data/alphaprintProducts";
import { Link } from "react-router-dom";

const AlphaPrintProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredProducts, setFilteredProducts] = useState(alphaprintProducts);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(alphaprintProducts);
    } else {
      setFilteredProducts(alphaprintProducts.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedProduct) {
      calculatePrice();
    }
  }, [selectedProduct, selectedVariants, quantity]);

  const calculatePrice = () => {
    if (!selectedProduct) return;
    
    let price = selectedProduct.basePrice;
    
    // Add variant price modifiers
    selectedProduct.variants.forEach((variant: any) => {
      if (selectedVariants[variant.type] === variant.value) {
        price += variant.priceModifier;
      }
    });
    
    setTotalPrice(price * quantity);
  };

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [type]: value }));
  };

  const categories = [
    { value: "all", label: "All Products" },
    { value: "hoodies", label: "Hoodies" },
    { value: "t-shirts", label: "T-Shirts" },
    { value: "caps", label: "Caps" },
    { value: "accessories", label: "Accessories" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AlphaPrintHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Custom Products</h1>
          <p className="text-xl text-muted-foreground">
            Choose your product and customize it with your design
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {selectedProduct && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Live Price Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Product: {selectedProduct.name}</Label>
                    <p className="text-sm text-muted-foreground">Base: €{selectedProduct.basePrice}</p>
                  </div>
                  
                  {/* Group variants by type to avoid duplicates */}
                  {Object.entries(
                    selectedProduct.variants.reduce((groups: any, variant: any) => {
                      if (!groups[variant.type]) {
                        groups[variant.type] = [];
                      }
                      if (!groups[variant.type].some((v: any) => v.value === variant.value)) {
                        groups[variant.type].push(variant);
                      }
                      return groups;
                    }, {})
                  ).map(([type, variants]: [string, any]) => (
                    <div key={type}>
                      <Label className="capitalize">{type}</Label>
                      <Select onValueChange={(value) => handleVariantChange(type, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${type}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {(variants as any[]).map((variant: any) => (
                            <SelectItem key={variant.value} value={variant.value}>
                              {variant.value} {variant.priceModifier > 0 && `(+€${variant.priceModifier})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  
                  <div>
                    <Label>Quantity</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link 
                      to={`/alphaprint/design/${selectedProduct.id}`}
                      state={{ product: selectedProduct, variants: selectedVariants, quantity }}
                    >
                      <Button className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Design
                      </Button>
                    </Link>
                    <Link 
                      to={`/alphaprint/designer/${selectedProduct.id}`}
                      state={{ product: selectedProduct, variants: selectedVariants, quantity }}
                    >
                      <Button variant="outline" className="w-full">
                        <Palette className="mr-2 h-4 w-4" />
                        Design Tool
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    selectedProduct?.id === product.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardHeader className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {selectedProduct?.id === product.id ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                    <CardDescription className="mb-3 line-clamp-2">
                      {product.description}
                    </CardDescription>
                    <div className="text-xl font-bold text-primary">
                      €{product.basePrice}
                      <span className="text-sm font-normal text-muted-foreground ml-1">starting</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="w-full">
                      <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                      <Link to={`/alphaprint/product/${product.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <AlphaPrintFooter />
    </div>
  );
};

export default AlphaPrintProducts;