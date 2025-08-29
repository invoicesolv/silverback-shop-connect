import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Loader2 } from 'lucide-react';
import { useNewsletter } from '@/hooks/useNewsletter';

interface NewsletterSignupProps {
  placeholder?: string;
  description?: string;
}

export const NewsletterSignup = ({ 
  placeholder = "Enter your email",
  description = "Get the latest updates on new products and exclusive offers."
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const { subscribe, isLoading } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    const success = await subscribe(email);
    if (success) {
      setEmail(''); // Clear the input on success
    }
  };

  return (
    <div className="space-y-3">
      {description && (
        <p className="text-muted-foreground text-sm mb-6">
          {description}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="bg-background border-border"
          disabled={isLoading}
          required
        />
        <Button 
          type="submit"
          size="icon" 
          className="bg-primary hover:bg-primary/90"
          disabled={isLoading || !email.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};
