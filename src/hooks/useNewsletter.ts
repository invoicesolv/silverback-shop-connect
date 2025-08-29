import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sendNewsletterWelcomeEmail, sendNewsletterSignupNotification } from '@/services/emailService';

export const useNewsletter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const subscribe = async (email: string) => {
    setIsLoading(true);
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const cleanEmail = email.toLowerCase().trim();
      
      // Store newsletter subscription in Supabase
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .upsert({ 
          email: cleanEmail,
          subscribed_at: new Date().toISOString(),
          is_active: true,
          source: 'website',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'email',
          ignoreDuplicates: true 
        });

      if (error && error.code !== '23505') {
        throw error;
      }

      const isNewSubscriber = !error;
      
      // Send emails (welcome to subscriber and notification to admin)
      try {
        if (isNewSubscriber) {
          // Send welcome email to subscriber
          const welcomeResult = await sendNewsletterWelcomeEmail(cleanEmail);
          
          // Send notification to admin
          const notificationResult = await sendNewsletterSignupNotification(cleanEmail);
          
          if (welcomeResult.success) {
            console.log('Welcome email sent successfully');
          }
          
          if (notificationResult.success) {
            console.log('Admin notification sent successfully');
          }
        }
      } catch (emailError) {
        console.error('Email sending failed (but subscription saved):', emailError);
        // Don't fail the whole process if emails fail
      }

      if (error && error.code === '23505') {
        toast({
          title: "Already Subscribed",
          description: "This email is already subscribed to our newsletter. Thanks for your continued interest!",
        });
      } else {
        toast({
          title: "Successfully Subscribed!",
          description: "Welcome to the Silverback family! Check your email for a special welcome offer.",
        });
      }

      return true;
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: error.message || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscribe,
    isLoading,
  };
};
