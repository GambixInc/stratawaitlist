import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AuthenticationHandlerProps {
  hasShared: boolean;
}

export const AuthenticationHandler = ({ hasShared }: AuthenticationHandlerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleDashboardAccess = async () => {
    try {
      const email = localStorage.getItem('waitlist_email');
      const firstName = localStorage.getItem('first_name');
      const lastName = localStorage.getItem('last_name');
      const waitlistId = localStorage.getItem('waitlist_id');
      
      if (!email || !firstName || !lastName || !waitlistId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not find your information. Please try logging in manually.",
          className: "bg-black text-white border border-brand/20",
        });
        return;
      }

      if (!validateEmail(email)) {
        toast({
          variant: "destructive",
          title: "Invalid Email",
          description: "Please use a valid email address.",
          className: "bg-black text-white border border-brand/20",
        });
        return;
      }

      // Check if user already exists
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Generate a secure random password (32 characters)
        const randomBytes = new Uint8Array(24);
        window.crypto.getRandomValues(randomBytes);
        const password = Array.from(randomBytes)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        // Try to sign up the user
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              waitlist_id: waitlistId,
              first_name: firstName,
              last_name: lastName
            }
          }
        });

        if (signUpError) {
          // If user exists, try signing in
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "Please try logging in manually.",
              className: "bg-black text-white border border-brand/20",
            });
            return;
          }
        }
      }

      // Verify authentication was successful
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        toast({
          title: "Success!",
          description: "You've been automatically signed in.",
          className: "bg-black text-white border border-brand/20",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Please try logging in manually.",
          className: "bg-black text-white border border-brand/20",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to access dashboard. Please try logging in manually.",
        className: "bg-black text-white border border-brand/20",
      });
    }
  };

  return (
    <Button
      onClick={handleDashboardAccess}
      disabled={!hasShared}
      className="bg-[#e57c73] hover:bg-[#e57c73]/80 text-white px-6 py-2 text-sm"
    >
      {hasShared ? "Go to Dashboard" : "Share First to Unlock Dashboard"}
    </Button>
  );
};