import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AlphaPrintHeader } from "@/components/AlphaPrintHeader";
import { AlphaPrintFooter } from "@/components/AlphaPrintFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Canvas as FabricCanvas, Textbox, Circle, Rect, FabricImage } from "fabric";
import { 
  Type, 
  Circle as CircleIcon, 
  Square, 
  Upload, 
  Download, 
  RotateCcw, 
  ArrowRight, 
  Palette,
  Move,
  Trash2,
  Box
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AlphaPrintDesigner = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { product, variants, quantity } = location.state || {};
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"select" | "text" | "circle" | "rectangle" | "upload" | "boundary">("select");
  const [activeColor, setActiveColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [previewMode, setPreviewMode] = useState<'front' | 'back'>('front');
  const [boundarySquare, setBoundarySquare] = useState<Rect | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [designScale, setDesignScale] = useState(0.3); // Scale factor for preview
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartScale, setDragStartScale] = useState(0);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Clear any existing canvas
    if (fabricCanvas) {
      fabricCanvas.dispose();
    }

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 500,
    });

    // Make canvas completely transparent
    canvas.backgroundColor = '';
    canvas.renderOnAddRemove = true;
    
    // Ensure HTML canvas element is transparent
    if (canvasRef.current) {
      canvasRef.current.style.backgroundColor = 'transparent';
      canvasRef.current.style.background = 'none';
    }

    // Simple event setup - NO movement constraints initially
    canvas.on('selection:created', () => {
      console.log('Object selected');
      setActiveTool("select");
    });
    
    canvas.on('object:moving', (e) => {
      console.log('Object moving:', e.target?.type);
      updatePreview();
    });
    
    canvas.on('object:modified', updatePreview);
    canvas.on('object:added', updatePreview);
    canvas.on('object:removed', updatePreview);

    setFabricCanvas(canvas);
    
    // Add test draggable text
    const testText = new Textbox("DRAG ME - Test if dragging works", {
      left: 50,
      top: 50,
      fontFamily: "Arial",
      fontSize: 16,
      fill: "#ff0000",
      width: 300,
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
    });
    canvas.add(testText);
    canvas.renderAll();

    console.log('Canvas initialized, test text added');
    
    toast({
      title: "Canvas ready!",
      description: "Try dragging the red test text first.",
    });

    return () => {
      canvas.dispose();
    };
  }, [toast]);

  // Drag handlers for preview resize
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Starting resize in direction: ${direction}`);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startScale = designScale;
    
    setIsDragging(true);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let scaleDelta = 0;
      
      // Calculate scale change based on direction - clear logic
      switch (direction) {
        case 'se': // bottom-right corner - drag right/down to grow
          scaleDelta = (deltaX + deltaY) * 0.002;
          break;
        case 'nw': // top-left corner - drag left/up to grow
          scaleDelta = (-deltaX - deltaY) * 0.002;
          break;
        case 'ne': // top-right corner - drag right/up to grow
          scaleDelta = (deltaX - deltaY) * 0.002;
          break;
        case 'sw': // bottom-left corner - drag left/down to grow
          scaleDelta = (-deltaX + deltaY) * 0.002;
          break;
        case 'e': // right edge - drag right to grow
          scaleDelta = deltaX * 0.003;
          break;
        case 'w': // left edge - drag left to grow
          scaleDelta = -deltaX * 0.003;
          break;
        case 's': // bottom edge - drag down to grow
          scaleDelta = deltaY * 0.003;
          break;
        case 'n': // top edge - drag up to grow
          scaleDelta = -deltaY * 0.003;
          break;
      }
      
      const newScale = Math.max(0.1, Math.min(1.5, startScale + scaleDelta));
      
      console.log(`Direction: ${direction}, Delta: ${deltaX}, ${deltaY}, Scale: ${newScale.toFixed(2)}`);
      
      setDesignScale(newScale);
    };
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      upEvent.preventDefault();
      console.log('Resize ended');
      
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Update preview function
  const updatePreview = () => {
    if (!fabricCanvas) return;
    
    try {
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 1,
        withoutTransform: false,
      });
      setPreviewDataUrl(dataURL);
    } catch (error) {
      console.error('Error updating preview:', error);
    }
  };

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    // Clear selection when switching tools
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();

    switch (tool) {
      case "text":
        const text = new Textbox("Your Text Here", {
          left: 50,
          top: 50,
          fontFamily: fontFamily,
          fontSize: fontSize,
          fill: activeColor,
          width: 200,
          editable: true,
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        break;

      case "rectangle":
        const rect = new Rect({
          left: 50,
          top: 50,
          fill: activeColor,
          width: 100,
          height: 100,
        });
        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
        break;

      case "circle":
        const circle = new Circle({
          left: 50,
          top: 50,
          fill: activeColor,
          radius: 50,
        });
        fabricCanvas.add(circle);
        fabricCanvas.setActiveObject(circle);
        break;

      case "boundary":
        // Remove existing boundary if any
        if (boundarySquare) {
          fabricCanvas.remove(boundarySquare);
        }
        
        // Create new boundary square in the center
        const boundary = new Rect({
          left: 150,
          top: 200,
          fill: "transparent",
          stroke: "#ff0000",
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          width: 100,
          height: 100,
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });
        
        fabricCanvas.add(boundary);
        fabricCanvas.setActiveObject(boundary);
        setBoundarySquare(boundary);
        
        toast({
          title: "Print area added",
          description: "Upload your logo - it will be constrained to this area.",
        });
        break;
    }

    fabricCanvas.renderAll();
  };

  const handleColorChange = (color: string) => {
    setActiveColor(color);
    
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      if (activeObject instanceof Textbox) {
        activeObject.set('fill', color);
      } else {
        activeObject.set('fill', color);
      }
      fabricCanvas.renderAll();
    }
  };

  const handleFontSizeChange = (size: number[]) => {
    const newSize = size[0];
    setFontSize(newSize);
    
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject instanceof Textbox) {
      activeObject.set('fontSize', newSize);
      fabricCanvas.renderAll();
    }
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject instanceof Textbox) {
      activeObject.set('fontFamily', family);
      fabricCanvas.renderAll();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) {
      console.log('No file or canvas:', { file: !!file, canvas: !!fabricCanvas });
      return;
    }

    console.log('Starting image upload...');
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        console.log('Image loaded, creating Fabric image...');
        const fabricImg = new FabricImage(imgElement, {
          left: 100,
          top: 100,
          scaleX: 0.4,
          scaleY: 0.4,
          selectable: true,
          evented: true,
          hasControls: true,
          hasBorders: true,
          hoverCursor: 'move',
          moveCursor: 'move',
        });
        
        console.log('Adding image to canvas...');
        fabricCanvas.add(fabricImg);
        fabricCanvas.setActiveObject(fabricImg);
        fabricCanvas.renderAll();
        
        console.log('Image added successfully');
        
        toast({
          title: "Logo uploaded successfully",
          description: "Click and drag to move your logo around.",
        });
      };
      imgElement.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    event.target.value = '';
  };

  const deleteActiveObject = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = ''; // Empty string for transparent
    setBoundarySquare(null);
    fabricCanvas.renderAll();
    toast({
      title: "Canvas cleared",
      description: "All design elements have been removed.",
    });
  };

  const exportDesign = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${product?.name || 'design'}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast({
      title: "Design exported",
      description: "Your design has been downloaded as PNG.",
    });
  };

  const proceedToReview = () => {
    if (!fabricCanvas) return;
    
    const designData = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    
    // Convert canvas to file for consistency with upload flow
    const designFile = {
      name: `custom-design-${Date.now()}.png`,
      url: designData,
      type: 'png',
      size: designData.length,
      isValid: true,
      warnings: [],
    };
    
    navigate('/alphaprint/review', {
      state: {
        product,
        variants,
        quantity,
        designFiles: [designFile],
        isCustomDesign: true,
      }
    });
  };

  const colors = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#800080",
    "#008000", "#ffc0cb", "#a52a2a", "#808080", "#000080"
  ];

  const fonts = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Trebuchet MS", "Comic Sans MS", "Impact", "Lucida Console"
  ];

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AlphaPrintHeader />
        <div className="container mx-auto px-4 py-8">
          <p>No product selected. Please go back and select a product first.</p>
        </div>
        <AlphaPrintFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AlphaPrintHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Design Tool</h1>
          <p className="text-xl text-muted-foreground">
            Create your custom design for {product.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTool === "select" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleToolClick("select")}
                >
                  <Move className="mr-2 h-4 w-4" />
                  Select
                </Button>
                <Button
                  variant={activeTool === "text" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleToolClick("text")}
                >
                  <Type className="mr-2 h-4 w-4" />
                  Text
                </Button>
                <Button
                  variant={activeTool === "rectangle" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleToolClick("rectangle")}
                >
                  <Square className="mr-2 h-4 w-4" />
                  Rectangle
                </Button>
                <Button
                  variant={activeTool === "circle" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleToolClick("circle")}
                >
                  <CircleIcon className="mr-2 h-4 w-4" />
                  Circle
                </Button>
                <Button
                  variant={activeTool === "boundary" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleToolClick("boundary")}
                >
                  <Box className="mr-2 h-4 w-4" />
                  Boundary Square
                </Button>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </span>
                    </Button>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Color</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded border-2 ${
                          activeColor === color ? 'border-primary' : 'border-muted'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={activeColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Font Family</Label>
                  <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Font Size: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={handleFontSizeChange}
                    min={12}
                    max={72}
                    step={2}
                    className="mt-2"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={deleteActiveObject}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={clearCanvas}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={exportDesign}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export PNG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Design Canvas</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Design area: 400x500px (recommended print area)
                </p>
              </CardHeader>
              <CardContent>
                <div className="border border-muted rounded-lg overflow-hidden flex justify-center p-4" style={{background: 'transparent'}}>
                  <canvas
                    ref={canvasRef}
                    className="border border-muted-foreground/20 shadow-lg"
                    style={{background: 'transparent', backgroundColor: 'transparent'}}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Preview</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={previewMode === 'front' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('front')}
                  >
                    Front
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'back' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('back')}
                  >
                    Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center relative overflow-hidden"
                  onWheel={(e) => {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -0.05 : 0.05;
                    const newScale = Math.max(0.1, Math.min(1.5, designScale + delta));
                    setDesignScale(newScale);
                  }}
                >
                  {/* Product mockup */}
                  <img
                    src={product.images.find((img: any) => img.angle === previewMode)?.url || product.images[0].url}
                    alt={`${product.name} ${previewMode}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Dynamic design overlay with resize handles */}
                  {previewDataUrl && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div 
                        className="relative group hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50 rounded"
                        style={{
                          transform: `scale(${designScale})`,
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        <img
                          src={previewDataUrl}
                          alt="Design preview"
                          className="max-w-full max-h-full object-contain"
                          style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                          }}
                        />
                        
                        {/* Resize handles - only show on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                          {/* Corner handles */}
                          <div 
                            className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-nw-resize shadow-md hover:bg-blue-600 transition-colors" 
                            onMouseDown={(e) => handleResizeStart(e, 'nw')}
                          />
                          <div 
                            className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-ne-resize shadow-md hover:bg-blue-600 transition-colors" 
                            onMouseDown={(e) => handleResizeStart(e, 'ne')}
                          />
                          <div 
                            className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-sw-resize shadow-md hover:bg-blue-600 transition-colors" 
                            onMouseDown={(e) => handleResizeStart(e, 'sw')}
                          />
                          <div 
                            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-se-resize shadow-md hover:bg-blue-600 transition-colors" 
                            onMouseDown={(e) => handleResizeStart(e, 'se')}
                          />
                          
                          {/* Edge handles */}
                          <div 
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-n-resize shadow-md hover:bg-blue-600 transition-colors" 
                            onMouseDown={(e) => handleResizeStart(e, 'n')}
                          />
                          <div 
                            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-s-resize shadow-md hover:bg-blue-600 transition-colors" 
                            onMouseDown={(e) => handleResizeStart(e, 's')}
                          />
                          <div 
                            className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-w-resize shadow-md hover:bg-blue-600 transition-colors" 
                            onMouseDown={(e) => handleResizeStart(e, 'w')}
                          />
                          <div 
                            className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-e-resize shadow-md hover:bg-blue-600 transition-colors" 
                            onMouseDown={(e) => handleResizeStart(e, 'e')}
                          />
                          
                          {/* Center drag handle for moving */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 border-2 border-white rounded-full cursor-move shadow-md hover:bg-green-600 transition-colors flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        </div>
                        
                        {/* Size indicator */}
                        <div className="absolute -top-8 left-0 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {Math.round(designScale * 100)}%
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Placeholder when no design */}
                  {!previewDataUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/70">
                        <Palette className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Your design will appear here</p>
                        <p className="text-xs opacity-70">Scroll to resize preview</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Preview Controls */}
                {previewDataUrl && (
                  <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Preview Size</Label>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(designScale * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDesignScale(Math.max(0.1, designScale - 0.1))}
                        disabled={designScale <= 0.1}
                        className="px-2"
                      >
                        -
                      </Button>
                      <Slider
                        value={[designScale]}
                        onValueChange={(value) => setDesignScale(value[0])}
                        min={0.1}
                        max={1.5}
                        step={0.05}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDesignScale(Math.min(1.5, designScale + 0.1))}
                        disabled={designScale >= 1.5}
                        className="px-2"
                      >
                        +
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDesignScale(0.3)}
                        className="px-2 ml-2"
                      >
                        Reset
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Use mouse wheel over preview or controls above to resize
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={() => navigate('/alphaprint/products')}>
                Back to Products
              </Button>
              <Button className="w-full" onClick={proceedToReview}>
                Continue to Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <AlphaPrintFooter />
    </div>
  );
};

export default AlphaPrintDesigner;