# Code Updates for Real Snapback Images

Once you save the 4 snapback images to `/src/assets/`, run these updates:

## 1. Update ProductDetail.tsx

Replace the import line:
```javascript
// Temporary: Using hoodie image as placeholder since snapback files are MP4 videos with .jpg extension
import silverbackSnapbackWhiteBg from "@/assets/white-hoodie-front-new.jpg";
```

With:
```javascript
import silverbackSnapbackFront from "@/assets/silverback-snapback-front.jpg";
```

And update the product data:
```javascript
image: silverbackSnapbackFront,
hoverImage: silverbackSnapbackFront,
images: [silverbackSnapbackFront],
```

## 2. Update Products.tsx

Same import change as above, and update the product object.

## 3. Update ProductGrid.tsx

Same import change as above, and update the product object.

## 4. Update alphaprintProducts.ts

Replace the imports:
```javascript
// Temporary: Using hoodie images as placeholder since snapback files are MP4 videos with .jpg extension
import silverbackSnapbackWhiteBg from "@/assets/white-hoodie-front-new.jpg";
import silverbackSnapbackBackWhiteBg from "@/assets/white-hoodie-back-new.jpg"; // Placeholder
import silverbackSnapbackSideWhiteBg from "@/assets/black-hoodie-front-new.jpg"; // Placeholder
import silverbackSnapbackModelFemale from "@/assets/white-hoodie-front-new.jpg"; // Placeholder
import silverbackSnapbackModelMale from "@/assets/black-hoodie-front-new.jpg"; // Placeholder
```

With:
```javascript
import silverbackSnapbackFront from "@/assets/silverback-snapback-front.jpg";
import silverbackSnapbackBack from "@/assets/silverback-snapback-back.jpg";
import silverbackSnapbackFemaleModel from "@/assets/silverback-snapback-female-model.jpg";
import silverbackSnapbackMaleModel from "@/assets/silverback-snapback-male-model.jpg";
```

And update the images array in the snapback product:
```javascript
images: [
  {
    id: "silverback-snapback-main",
    url: silverbackSnapbackFront,
    alt: "Silverback Treatment Snapback Cap - Front View",
    isPrimary: true,
    color: "black",
    angle: "front"
  },
  {
    id: "silverback-snapback-back",
    url: silverbackSnapbackBack,
    alt: "Silverback Treatment Snapback Cap - Back View",
    isPrimary: false,
    color: "black",
    angle: "back"
  },
  {
    id: "silverback-snapback-model-female",
    url: silverbackSnapbackFemaleModel,
    alt: "Silverback Treatment Snapback Cap - Female Model",
    isPrimary: false,
    color: "black",
    angle: "model"
  },
  {
    id: "silverback-snapback-model-male",
    url: silverbackSnapbackMaleModel,
    alt: "Silverback Treatment Snapback Cap - Male Model",
    isPrimary: false,
    color: "black",
    angle: "model"
  }
]
```

After making these changes, run `npm run build` to verify everything works!
