import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
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

// Sample products - these would come from your database
const sampleProducts = [
  {
    id: 101,
    name: "Silverback Premium Hoodie",
    description: "Premium hoodie with iconic Silverback Treatment logo - Available in Black and White",
    price: 63,
    originalPrice: null,
    image: whiteHoodieFront,
    hoverImage: blackHoodieFront,
    rating: 4.9,
    reviews: 277, // Combined reviews
    badge: "Best Seller",
    category: "Hoodies"
  },
  {
    id: 102,
    name: "Silverback T-Shirt",
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
    description: "Comfortable streetwear shorts with premium fabric",
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

export const ProductGrid = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-light-grey">
            SILVERBACK ESSENTIALS
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium streetwear engineered for the modern athlete. Built tough, styled sharp.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-primary/20 hover:border-primary">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};