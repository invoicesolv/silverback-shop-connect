import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import whiteHoodieFront from "@/assets/white-hoodie-front-new.jpg";
import whiteHoodieBack from "@/assets/white-hoodie-back-new.jpg";
import blackHoodieFront from "@/assets/black-hoodie-front-new.jpg";
import blackHoodieBack from "@/assets/black-hoodie-back-new.jpg";
import whiteTeeFront from "@/assets/white-tee-front.jpg";
import whiteTeeBack from "@/assets/white-tee-back.jpg";
import blackShorts from "@/assets/black-shorts.jpg";
import militaryGreenShorts from "@/assets/military-green-shorts.jpg";
import silverbackSnapbackFront from "@/assets/silverback-snapback-front.jpg";
import silverbackSnapbackFemaleModel from "@/assets/silverback-snapback-female-model.jpg";

// Extended products data
const allProducts = [
  {
    id: 101,
    name: "Silverback Premium Hoodie",
    description: "Premium hoodie with iconic Silverback Treatment logo - Available in Black and White",
    price: 63,
    originalPrice: null,
    image: whiteHoodieFront,
    hoverImage: blackHoodieFront,
    rating: 4.9,
    reviews: 277, // Combined reviews from both colors
    badge: "Best Seller",
    category: "Hoodies"
  },
  {
    id: 102,
    name: "Classic White Tee",
    description: "Essential cotton t-shirt with signature logo placement",
    price: 42,
    originalPrice: null,
    image: whiteTeeFront,
    hoverImage: whiteTeeBack,
    rating: 4.9,
    reviews: 89,
    badge: null,
    category: "T-Shirts"
  },
  {
    id: 103,
    name: "Silverback Shorts",
    description: "Premium shorts with signature Silverback branding",
    price: 30,
    originalPrice: null,
    image: militaryGreenShorts,
    hoverImage: blackShorts,
    rating: 4.6,
    reviews: 156,
    badge: null,
    category: "Shorts"
  },
  {
    id: 104,
    name: "Silverback Treatment Snapback",
    description: "Official Silverback Treatment snapback cap with embroidered logo",
    price: 15,
    originalPrice: null,
    image: silverbackSnapbackFemaleModel,
    hoverImage: silverbackSnapbackFront,
    rating: 4.8,
    reviews: 94,
    badge: "New",
    category: "Accessories"
  }
];

const categories = ["All", "Hoodies", "T-Shirts", "Shorts", "Accessories"];

const Products = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gradient">
              Our Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of premium streetwear designed for modern style and comfort
            </p>
          </div>

          {/* Filters and View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary" : "border-primary/20 hover:border-primary"}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-6"
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;