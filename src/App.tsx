import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AlphaPrint from "./pages/AlphaPrint";
import AlphaPrintStart from "./pages/AlphaPrintStart";
import AlphaPrintProducts from "./pages/AlphaPrintProducts";
import AlphaPrintProductDetail from "./pages/AlphaPrintProductDetail";
import AlphaPrintDesign from "./pages/AlphaPrintDesign";
import AlphaPrintDesigner from "./pages/AlphaPrintDesigner";
import AlphaPrintReview from "./pages/AlphaPrintReview";
import AlphaPrintQuote from "./pages/AlphaPrintQuote";
import AlphaPrintAuth from "./pages/AlphaPrintAuth";
import NotFound from "./pages/NotFound";
import CustomerService from "./pages/CustomerService";
import ShippingInfo from "./pages/ShippingInfo";
import Returns from "./pages/Returns";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/alphaprint" element={<AlphaPrint />} />
              <Route path="/alphaprint/start" element={<AlphaPrintStart />} />
              <Route path="/alphaprint/products" element={<AlphaPrintProducts />} />
              <Route path="/alphaprint/product/:productId" element={<AlphaPrintProductDetail />} />
              <Route path="/alphaprint/design/:productId" element={<AlphaPrintDesign />} />
              <Route path="/alphaprint/designer/:productId" element={<AlphaPrintDesigner />} />
              <Route path="/alphaprint/review" element={<AlphaPrintReview />} />
              <Route path="/alphaprint/quote" element={<AlphaPrintQuote />} />
              <Route path="/alphaprint/auth" element={<AlphaPrintAuth />} />
              <Route path="/customer-service" element={<CustomerService />} />
              <Route path="/shipping-info" element={<ShippingInfo />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </Router>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;