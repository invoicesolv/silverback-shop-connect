import { useParams } from "react-router-dom";
import { AlphaPrintHeader } from "@/components/AlphaPrintHeader";
import { AlphaPrintFooter } from "@/components/AlphaPrintFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { alphaprintProducts } from "@/data/alphaprintProducts";

const AlphaPrintProductDetail = () => {
  const { productId } = useParams();
  const product = alphaprintProducts.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AlphaPrintHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Product Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Sorry, we couldn't find the product you're looking for.
            </p>
            <Link to="/alphaprint/products">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </main>
        <AlphaPrintFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AlphaPrintHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/alphaprint/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.images[0].url}
                alt={product.images[0].alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image) => (
                <div key={image.id} className="aspect-square overflow-hidden rounded border">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2 capitalize">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold text-primary mb-4">{product.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">
                {product.description}
              </p>
              <div className="text-3xl font-bold text-primary mb-6">
                ${product.basePrice}
                <span className="text-lg font-normal text-muted-foreground ml-2">starting</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-6">
              <Link 
                to={`/alphaprint/design/${product.id}`}
                state={{ product, variants: {}, quantity: 1 }}
              >
                <Button size="lg" className="w-full h-14">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Your Design
                </Button>
              </Link>
              <Link 
                to={`/alphaprint/designer/${product.id}`}
                state={{ product, variants: {}, quantity: 1 }}
              >
                <Button size="lg" variant="outline" className="w-full h-14">
                  <Palette className="mr-2 h-5 w-5" />
                  Use Design Tool
                </Button>
              </Link>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Available Options</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Sizes</p>
                  <p className="text-sm">
                    {[...new Set(product.variants.filter(v => v.type === 'size').map(v => v.value))].join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Colors</p>
                  <p className="text-sm">
                    {[...new Set(product.variants.filter(v => v.type === 'color').map(v => v.value))].join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Materials</p>
                  <p className="text-sm">
                    {[...new Set(product.variants.filter(v => v.type === 'material').map(v => v.value))].join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <AlphaPrintFooter />
    </div>
  );
};

export default AlphaPrintProductDetail;