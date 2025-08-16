import { Product } from "@/types/alphaprint";
// New Alpha Print products
import customDropShoulderHoodie from "@/assets/custom-drop-shoulder-hoodie.avif";
import cleanBlackTshirt from "@/assets/clean-black-tshirt.jpg";
import premiumCustomCap from "@/assets/premium-custom-cap.jpg";
// Existing images
import blackHoodieFront from "@/assets/black-hoodie-front-new.jpg";
import blackHoodieBack from "@/assets/black-hoodie-back-new.jpg";
import whiteHoodieFront from "@/assets/white-hoodie-front-new.jpg";
import whiteHoodieBack from "@/assets/white-hoodie-back-new.jpg";
import blueHoodieFront from "@/assets/blue-hoodie-front.jpg";
import pinkHoodieFront from "@/assets/pink-hoodie-front.jpg";
import blackTeeFront from "@/assets/black-tee-front.jpg";
import whiteTeeFront from "@/assets/white-tee-new-front.jpg";
import whiteTeeBack from "@/assets/white-tee-back.jpg";
import peachTeeFront from "@/assets/peach-tee-front.jpg";
import wineRedTeeFront from "@/assets/wine-red-tee-front.jpg";
// Premium blank hoodie for customization
import premiumBlankHoodie from "@/assets/premium-blank-hoodie.avif";
// Blank product mockups for customization
import blankWhiteHoodie from "@/assets/blank-white-hoodie-front.jpg";
import blankBlackHoodie from "@/assets/blank-black-hoodie-front.jpg";
import blankWhiteTee from "@/assets/blank-white-tee-front.jpg";
import blankBlackTeeBack from "@/assets/blank-black-tee-back.jpg";

export const alphaprintProducts: Product[] = [
  {
    id: "premium-hoodie",
    name: "Premium Cotton Hoodie",
    description: "Ultra-soft premium cotton hoodie with spacious front pocket and adjustable drawstring hood. Perfect for custom designs and logos.",
    category: "hoodies",
    basePrice: 45.99,
    features: [
      "100% Premium Cotton",
      "Pre-shrunk for perfect fit",
      "Kangaroo pocket",
      "Adjustable drawstring hood",
      "Ribbed cuffs and hem",
      "Double-needle stitching"
    ],
    images: [
      {
        id: "hoodie-premium-blank",
        url: premiumBlankHoodie,
        alt: "Premium Blank Cotton Hoodie",
        isPrimary: true,
        color: "neutral",
        angle: "front"
      },
      {
        id: "hoodie-black-front",
        url: blackHoodieFront,
        alt: "Black Premium Hoodie Front",
        isPrimary: false,
        color: "black",
        angle: "front"
      },
      {
        id: "hoodie-black-back",
        url: blackHoodieBack,
        alt: "Black Premium Hoodie Back",
        isPrimary: false,
        color: "black",
        angle: "back"
      },
      {
        id: "hoodie-white-front",
        url: whiteHoodieFront,
        alt: "White Premium Hoodie Front",
        isPrimary: false,
        color: "white",
        angle: "front"
      },
      {
        id: "hoodie-white-back",
        url: whiteHoodieBack,
        alt: "White Premium Hoodie Back",
        isPrimary: false,
        color: "white",
        angle: "back"
      },
      {
        id: "hoodie-blue-front",
        url: blueHoodieFront,
        alt: "Blue Premium Hoodie Front",
        isPrimary: false,
        color: "blue",
        angle: "front"
      },
      {
        id: "hoodie-pink-front",
        url: pinkHoodieFront,
        alt: "Pink Premium Hoodie Front",
        isPrimary: false,
        color: "pink",
        angle: "front"
      },
      {
        id: "hoodie-blank-white",
        url: blankWhiteHoodie,
        alt: "Blank White Hoodie for Customization",
        isPrimary: false,
        color: "white",
        angle: "front"
      },
      {
        id: "hoodie-blank-black",
        url: blankBlackHoodie,
        alt: "Blank Black Hoodie for Customization",
        isPrimary: false,
        color: "black",
        angle: "front"
      }
    ],
    variants: [
      // Sizes
      { id: "size-xs", type: "size", name: "Size", value: "XS", priceModifier: 0, stock: 50 },
      { id: "size-s", type: "size", name: "Size", value: "S", priceModifier: 0, stock: 100 },
      { id: "size-m", type: "size", name: "Size", value: "M", priceModifier: 0, stock: 150 },
      { id: "size-l", type: "size", name: "Size", value: "L", priceModifier: 0, stock: 120 },
      { id: "size-xl", type: "size", name: "Size", value: "XL", priceModifier: 2, stock: 80 },
      { id: "size-2xl", type: "size", name: "Size", value: "2XL", priceModifier: 4, stock: 40 },
      { id: "size-3xl", type: "size", name: "Size", value: "3XL", priceModifier: 6, stock: 20 },
      
      // Colors
      { id: "color-black", type: "color", name: "Color", value: "Black", priceModifier: 0, stock: 200 },
      { id: "color-white", type: "color", name: "Color", value: "White", priceModifier: 0, stock: 180 },
      { id: "color-blue", type: "color", name: "Color", value: "Navy Blue", priceModifier: 2, stock: 120 },
      { id: "color-pink", type: "color", name: "Color", value: "Pink", priceModifier: 2, stock: 80 },
      { id: "color-gray", type: "color", name: "Color", value: "Heather Gray", priceModifier: 1, stock: 150 }
    ]
  },
  {
    id: "classic-tee",
    name: "Classic Cotton T-Shirt",
    description: "Soft, comfortable classic fit t-shirt made from high-quality cotton. Ideal for everyday wear and custom printing.",
    category: "t-shirts",
    basePrice: 18.99,
    features: [
      "100% Ring-spun Cotton",
      "Classic fit",
      "Pre-shrunk fabric",
      "Tear-away label",
      "Shoulder-to-shoulder taping",
      "Quarter-turned to eliminate center crease"
    ],
    images: [
      {
        id: "tee-clean-black-front",
        url: cleanBlackTshirt,
        alt: "Clean Black Classic T-Shirt Front",
        isPrimary: true,
        color: "black",
        angle: "front"
      },
      {
        id: "tee-white-front",
        url: whiteTeeFront,
        alt: "White Classic T-Shirt Front",
        isPrimary: false,
        color: "white",
        angle: "front"
      },
      {
        id: "tee-white-back",
        url: whiteTeeBack,
        alt: "White Classic T-Shirt Back",
        isPrimary: false,
        color: "white",
        angle: "back"
      },
      {
        id: "tee-black-front",
        url: blackTeeFront,
        alt: "Black Classic T-Shirt Front",
        isPrimary: false,
        color: "black",
        angle: "front"
      },
      {
        id: "tee-peach-front",
        url: peachTeeFront,
        alt: "Peach Classic T-Shirt Front",
        isPrimary: false,
        color: "peach",
        angle: "front"
      },
      {
        id: "tee-wine-front",
        url: wineRedTeeFront,
        alt: "Wine Red Classic T-Shirt Front",
        isPrimary: false,
        color: "wine-red",
        angle: "front"
      },
      {
        id: "tee-blank-white",
        url: blankWhiteTee,
        alt: "Blank White T-Shirt for Customization",
        isPrimary: false,
        color: "white",
        angle: "front"
      },
      {
        id: "tee-blank-black-back",
        url: blankBlackTeeBack,
        alt: "Blank Black T-Shirt Back for Customization",
        isPrimary: false,
        color: "black",
        angle: "back"
      }
    ],
    variants: [
      // Sizes
      { id: "tee-size-xs", type: "size", name: "Size", value: "XS", priceModifier: 0, stock: 80 },
      { id: "tee-size-s", type: "size", name: "Size", value: "S", priceModifier: 0, stock: 150 },
      { id: "tee-size-m", type: "size", name: "Size", value: "M", priceModifier: 0, stock: 200 },
      { id: "tee-size-l", type: "size", name: "Size", value: "L", priceModifier: 0, stock: 180 },
      { id: "tee-size-xl", type: "size", name: "Size", value: "XL", priceModifier: 1, stock: 120 },
      { id: "tee-size-2xl", type: "size", name: "Size", value: "2XL", priceModifier: 2, stock: 60 },
      { id: "tee-size-3xl", type: "size", name: "Size", value: "3XL", priceModifier: 3, stock: 30 },
      
      // Colors
      { id: "tee-color-black", type: "color", name: "Color", value: "Black", priceModifier: 0, stock: 300 },
      { id: "tee-color-white", type: "color", name: "Color", value: "White", priceModifier: 0, stock: 280 },
      { id: "tee-color-peach", type: "color", name: "Color", value: "Peach", priceModifier: 1, stock: 100 },
      { id: "tee-color-wine", type: "color", name: "Color", value: "Wine Red", priceModifier: 1, stock: 120 },
      { id: "tee-color-navy", type: "color", name: "Color", value: "Navy", priceModifier: 1, stock: 150 }
    ]
  },
  {
    id: "snapback-cap",
    name: "Premium Snapback Cap",
    description: "Structured snapback cap with flat brim and adjustable snap closure. Perfect for embroidery and custom designs.",
    category: "caps",
    basePrice: 24.99,
    features: [
      "Structured 6-panel design",
      "Flat brim",
      "Snapback closure",
      "Cotton twill construction",
      "Moisture-wicking sweatband",
      "One size fits most"
    ],
    images: [
      {
        id: "cap-premium-custom",
        url: premiumCustomCap,
        alt: "Premium Custom Snapback Cap",
        isPrimary: true,
        color: "multicolor",
        angle: "front"
      }
    ],
    variants: [
      // Colors
      { id: "cap-color-black", type: "color", name: "Color", value: "Black", priceModifier: 0, stock: 100 },
      { id: "cap-color-white", type: "color", name: "Color", value: "White", priceModifier: 0, stock: 80 },
      { id: "cap-color-navy", type: "color", name: "Color", value: "Navy", priceModifier: 1, stock: 60 },
      { id: "cap-color-red", type: "color", name: "Color", value: "Red", priceModifier: 1, stock: 40 }
    ]
  }
];