import { useState, useEffect } from "react";
import { AlphaPrintHeader } from "@/components/AlphaPrintHeader";
import { AlphaPrintFooter } from "@/components/AlphaPrintFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Save, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AlphaPrintProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access your profile.",
          variant: "destructive",
        });
        navigate("/alphaprint/auth");
        return;
      }

      setUser(user);
      setFormData({
        email: user.email || "",
        fullName: user.user_metadata?.full_name || "",
      });
    };

    getUser();
  }, [navigate, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!formData.fullName) {
      toast({
        title: "Missing required field",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
        }
      });

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
      
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AlphaPrintHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </main>
        <AlphaPrintFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AlphaPrintHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences.
            </p>
          </div>

          <div className="space-y-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      className="pl-10"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed from this page. Contact support if you need to update your email.
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Your current account verification and status information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Account Active:</strong> Your account is active and verified.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Account Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                    <p><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and navigation shortcuts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => navigate("/alphaprint/products")}>
                    Browse Products
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/alphaprint/quote")}>
                    Get Custom Quote
                  </Button>
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

export default AlphaPrintProfile;
