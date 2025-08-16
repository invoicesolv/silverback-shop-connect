import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Database } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: December 2024
            </p>
          </div>

          {/* Overview */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Commitment to Privacy</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                At Silverback Treatment, we respect your privacy and are committed to protecting your personal 
                information. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you visit our website or make a purchase from us.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Information We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <p className="text-muted-foreground mb-2">When you make a purchase or create an account, we may collect:</p>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Name and contact information (email, phone, address)</li>
                    <li>• Payment information (processed securely by our payment providers)</li>
                    <li>• Order history and preferences</li>
                    <li>• Account credentials</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Automatically Collected Information</h3>
                  <p className="text-muted-foreground mb-2">When you visit our website, we automatically collect:</p>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• IP address and device information</li>
                    <li>• Browser type and version</li>
                    <li>• Pages visited and time spent on site</li>
                    <li>• Referring website information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Cookies and Tracking Technologies</h3>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to enhance your browsing experience, 
                    analyze site traffic, and personalize content. You can control cookie settings 
                    through your browser preferences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">How We Use Your Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Order Processing</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Process and fulfill your orders</li>
                    <li>• Send order confirmations and updates</li>
                    <li>• Handle returns and exchanges</li>
                    <li>• Provide customer support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Communication</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Send promotional emails (with consent)</li>
                    <li>• Notify about new products and sales</li>
                    <li>• Respond to inquiries</li>
                    <li>• Send important account updates</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Website Improvement</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Analyze website usage patterns</li>
                    <li>• Improve site functionality</li>
                    <li>• Personalize user experience</li>
                    <li>• Prevent fraud and abuse</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Legal Compliance</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Comply with applicable laws</li>
                    <li>• Protect our rights and property</li>
                    <li>• Enforce our terms of service</li>
                    <li>• Respond to legal requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Data Security</h2>
              </div>
              
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational security measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Technical Safeguards</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• SSL encryption for data transmission</li>
                    <li>• Secure payment processing</li>
                    <li>• Regular security audits</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Organizational Measures</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Employee training on data protection</li>
                    <li>• Limited access to personal information</li>
                    <li>• Regular privacy policy reviews</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Your Privacy Rights</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Under GDPR (EU residents)</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm ml-4">
                    <li>• Right to access your personal data</li>
                    <li>• Right to rectify inaccurate information</li>
                    <li>• Right to erase your data (right to be forgotten)</li>
                    <li>• Right to restrict processing</li>
                    <li>• Right to data portability</li>
                    <li>• Right to object to processing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">All Customers</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm ml-4">
                    <li>• Unsubscribe from marketing communications</li>
                    <li>• Request account deletion</li>
                    <li>• Update your personal information</li>
                    <li>• Contact us with privacy concerns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">privacy@silverbacktreatment.se</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Mail</h3>
                  <div className="text-muted-foreground text-sm">
                    <p>Silverback Treatment AB</p>
                    <p>Privacy Officer</p>
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