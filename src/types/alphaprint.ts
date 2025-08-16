export interface Product {
  id: string;
  name: string;
  description: string;
  category: "hoodies" | "t-shirts" | "caps" | "accessories";
  basePrice: number;
  images: ProductImage[];
  variants: ProductVariant[];
  features: string[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  color?: string;
  angle: "front" | "back" | "side" | "detail";
}

export interface ProductVariant {
  id: string;
  type: "size" | "color" | "material";
  name: string;
  value: string;
  priceModifier: number;
  stock: number;
  image?: string;
}

export interface DesignFile {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "png" | "jpg" | "ai" | "psd";
  size: number;
  resolution?: {
    width: number;
    height: number;
    dpi: number;
  };
  isValid: boolean;
  warnings: string[];
}

export interface OrderItem {
  id: string;
  productId: string;
  variants: Record<string, string>;
  quantity: number;
  designFiles: DesignFile[];
  customizations: Record<string, any>;
  unitPrice: number;
  totalPrice: number;
}

export interface QuoteRequest {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
  };
  projectDescription: string;
  quantity: number;
  deadline?: Date;
  attachments: DesignFile[];
  requirements: string[];
  status: "pending" | "quoted" | "accepted" | "declined";
  createdAt: Date;
}