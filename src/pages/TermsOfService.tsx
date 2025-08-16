import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Scale, ShoppingCart, AlertTriangle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: December 2024
            </p>
          </div>

          {/* Introduction */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Agreement to Terms</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service ("Terms") govern your use of the Silverback Treatment website 
                and services. By accessing or using our website, you agree to be bound by these Terms. 
                If you do not agree to these Terms, please do not use our services.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance of Orders */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Orders and Pricing</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Acceptance</h3>
                  <p className="text-muted-foreground text-sm">
                    All orders are subject to acceptance by Silverback Treatment. We reserve the right 
                    to refuse or cancel any order for any reason, including but not limited to product 
                    availability, errors in product information, or suspected fraudulent activity.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Pricing and Payment</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm ml-4">
                    <li>• All prices are in Swedish Kronor (SEK) unless otherwise stated</li>
                    <li>• Prices include applicable VAT for EU customers</li>
                    <li>• Payment is required at the time of order</li>
                    <li>• We accept major credit cards and approved payment methods</li>
                    <li>• Prices are subject to change without notice</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Product Information</h3>
                  <p className="text-muted-foreground text-sm">
                    We strive to provide accurate product descriptions and images. However, we do not 
                    warrant that product descriptions or other content is accurate, complete, reliable, 
                    current, or error-free. Colors may vary due to monitor settings and photography conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">User Accounts and Responsibilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Account Security</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• You are responsible for maintaining account confidentiality</li>
                    <li>• Use strong, unique passwords</li>
                    <li>• Notify us immediately of unauthorized access</li>
                    <li>• You are liable for all activities under your account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Prohibited Activities</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Impersonate others or provide false information</li>
                    <li>• Engage in fraudulent or illegal activities</li>
                    <li>• Violate intellectual property rights</li>
                    <li>• Attempt to disrupt or harm our systems</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Intellectual Property Rights</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Our Content</h3>
                  <p className="text-muted-foreground text-sm">
                    All content on this website, including text, graphics, logos, images, and software, 
                    is the property of Silverback Treatment or its licensors and is protected by copyright, 
                    trademark, and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Limited License</h3>
                  <p className="text-muted-foreground text-sm">
                    You are granted a limited, non-exclusive, non-transferable license to access and use 
                    our website for personal, non-commercial purposes. You may not reproduce, distribute, 
                    modify, or create derivative works without our written permission.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Trademarks</h3>
                  <p className="text-muted-foreground text-sm">
                    "Silverback Treatment" and related marks are trademarks of Silverback Treatment AB. 
                    You may not use our trademarks without our prior written consent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers and Limitations */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <h2 className="text-2xl font-bold">Disclaimers and Limitation of Liability</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Website Availability</h3>
                  <p className="text-muted-foreground text-sm">
                    We strive to maintain website availability but do not guarantee uninterrupted access. 
                    We reserve the right to modify, suspend, or discontinue services at any time without notice.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                  <p className="text-muted-foreground text-sm">
                    To the maximum extent permitted by law, Silverback Treatment shall not be liable for 
                    any indirect, incidental, special, or consequential damages arising from your use of 
                    our website or products, even if we have been advised of the possibility of such damages.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Warranty Disclaimer</h3>
                  <p className="text-muted-foreground text-sm">
                    Our website and products are provided "as is" without warranties of any kind, either 
                    express or implied, including but not limited to merchantability and fitness for a 
                    particular purpose.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Governing Law and Disputes</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Applicable Law</h3>
                  <p className="text-muted-foreground text-sm">
                    These Terms are governed by and construed in accordance with the laws of Sweden, 
                    without regard to conflict of law principles.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Dispute Resolution</h3>
                  <p className="text-muted-foreground text-sm">
                    Any disputes arising from these Terms or your use of our services shall be resolved 
                    through binding arbitration or in the courts of Stockholm, Sweden.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">EU Consumer Rights</h3>
                  <p className="text-muted-foreground text-sm">
                    If you are a consumer residing in the European Union, you may have additional rights 
                    under local consumer protection laws that these Terms do not override.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">legal@silverbacktreatment.se</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Mail</h3>
                  <div className="text-muted-foreground text-sm">
                    <p>Silverback Treatment AB</p>
                    <p>Legal Department</p>
                    <p>Kungsgatan 123</p>
                    <p>111 22 Stockholm, Sweden</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}