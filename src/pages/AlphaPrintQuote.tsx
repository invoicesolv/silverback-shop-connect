import { useState } from "react";
import { AlphaPrintHeader } from "@/components/AlphaPrintHeader";
import { AlphaPrintFooter } from "@/components/AlphaPrintFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Upload, Calendar as CalendarIcon, Send, FileText, Package, Truck, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendQuoteNotificationEmail, sendCustomerConfirmationEmail } from "@/services/emailService";

const AlphaPrintQuote = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectDescription: "",
    quantity: "",
    deadline: undefined as Date | undefined,
    requirements: [] as string[],
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const requirementOptions = [
    "Rush order (24-48 hour turnaround)",
    "Premium materials",
    "Custom packaging",
    "Bulk discount",
    "Design assistance",
    "Proofing required",
    "International shipping",
    "Corporate billing",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (requirement: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requirements: checked
        ? [...prev.requirements, requirement]
        : prev.requirements.filter(req => req !== requirement)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const submitQuoteRequest = async () => {
    if (!formData.name || !formData.email || !formData.projectDescription || !formData.quantity) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Upload attachments to storage if any
      const attachmentData = [];
      for (const file of attachments) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `quotes/${fileName}`;

        const { data, error } = await supabase.storage
          .from('design-files')
          .upload(filePath, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('design-files')
          .getPublicUrl(filePath);

        attachmentData.push({
          name: file.name,
          url: urlData.publicUrl,
          size: file.size,
          type: file.type,
        });
      }

      // Create quote request
      const { data: savedQuote, error } = await supabase
        .from('quote_requests')
        .insert({
          customer_info: {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
          },
          project_description: formData.projectDescription,
          quantity: parseInt(formData.quantity),
          deadline: formData.deadline?.toISOString(),
          requirements: formData.requirements,
          attachments: attachmentData,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Quote request saved to database:', savedQuote);

      // Send email notifications with complete saved data
      try {
        // Prepare email data using the saved database record
        const emailData = {
          // Customer info from saved record
          name: savedQuote.customer_info.name,
          email: savedQuote.customer_info.email,
          company: savedQuote.customer_info.company || '',
          phone: savedQuote.customer_info.phone || '',
          
          // Project details from saved record
          projectDescription: savedQuote.project_description,
          quantity: savedQuote.quantity,
          deadline: savedQuote.deadline,
          requirements: savedQuote.requirements || [],
          attachments: savedQuote.attachments || [],
          
          // Database metadata
          quoteId: savedQuote.id,
          submittedAt: savedQuote.created_at,
          status: savedQuote.status || 'pending'
        };

        console.log('📧 Sending emails with saved data:', emailData);

        // Send notification to business owner with complete data
        const businessNotification = await sendQuoteNotificationEmail(emailData);
        
        // Send confirmation to customer
        const customerConfirmation = await sendCustomerConfirmationEmail(
          savedQuote.customer_info.email, 
          savedQuote.customer_info.name
        );
        
        if (businessNotification.success && customerConfirmation.success) {
          console.log('✅ Both email notifications sent successfully');
        } else if (businessNotification.success) {
          console.log('✅ Business notification sent, customer email may have failed');
        } else if (customerConfirmation.success) {
          console.log('✅ Customer confirmation sent, business notification may have failed');
        } else {
          console.log('⚠️ Both emails may have failed, but quote is saved');
        }
      } catch (emailError) {
        console.error('❌ Email notification failed (but quote saved successfully):', emailError);
        
        // Still show success to user since quote was saved
        toast({
          title: "Quote saved with email issues",
          description: "Your quote was saved but email notifications may have failed. We'll still process your request.",
          variant: "default",
        });
      }

      toast({
        title: "Quote request submitted!",
        description: "We'll review your request and get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        projectDescription: "",
        quantity: "",
        deadline: undefined,
        requirements: [],
      });
      setAttachments([]);

    } catch (error) {
      console.error('Quote submission error:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your quote request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AlphaPrintHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Request Custom Quote</h1>
          <p className="text-xl text-muted-foreground">
            Get a personalized quote for bulk orders, special materials, or complex projects
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Tell us about yourself and your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="ABC Corp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Describe your custom printing needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                    placeholder="Describe your project, products needed, design requirements, etc."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Estimated Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                      placeholder="100"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Deadline (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.deadline && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.deadline}
                          onSelect={(date) => handleInputChange("deadline", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Special Requirements</CardTitle>
                <CardDescription>
                  Select any additional services or requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requirementOptions.map((requirement) => (
                    <div key={requirement} className="flex items-center space-x-2">
                      <Checkbox
                        id={requirement}
                        checked={formData.requirements.includes(requirement)}
                        onCheckedChange={(checked) => 
                          handleRequirementChange(requirement, checked as boolean)
                        }
                      />
                      <Label htmlFor={requirement} className="text-sm">
                        {requirement}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Attachments</CardTitle>
                <CardDescription>
                  Upload design files, reference images, or project specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.png,.jpg,.jpeg,.ai,.psd,.svg"
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" className="w-full" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </span>
                    </Button>
                  </Label>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeAttachment(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button 
              onClick={submitQuoteRequest} 
              disabled={submitting}
              className="w-full h-12"
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Quote Request
                </>
              )}
            </Button>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quote Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">1. Submit Request</h4>
                    <p className="text-sm text-muted-foreground">
                      Fill out the form with your project details
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">2. Review & Quote</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll review and send you a detailed quote within 24 hours
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">3. Production</h4>
                    <p className="text-sm text-muted-foreground">
                      Once approved, we start production immediately
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Truck className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">4. Delivery</h4>
                    <p className="text-sm text-muted-foreground">
                      Fast, reliable shipping to your location
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Choose AlphaPrint?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">✓</Badge>
                  <span className="text-sm">Competitive pricing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">✓</Badge>
                  <span className="text-sm">Fast turnaround</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">✓</Badge>
                  <span className="text-sm">Premium quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">✓</Badge>
                  <span className="text-sm">Design assistance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">✓</Badge>
                  <span className="text-sm">Bulk discounts</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Have questions about your project? Our team is here to help.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> info@silverbacktreatment.se</p>
                  <p><strong>Phone:</strong> +34 600 013 960</p>
                  <p><strong>Hours:</strong> Mon-Fri 9AM-6PM CET</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <AlphaPrintFooter />
    </div>
  );
};

export default AlphaPrintQuote;