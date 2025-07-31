import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AuthenticationHandlerProps {
  hasShared: boolean;
}

export const AuthenticationHandler = ({ hasShared }: AuthenticationHandlerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDashboardAccess = async () => {
    try {
      console.log("Starting dashboard access process");
      const email = localStorage.getItem('waitlist_email');
      const firstName = localStorage.getItem('first_name');
      const lastName = localStorage.getItem('last_name');
      const waitlistId = localStorage.getItem('waitlist_id');
      
      if (!email || !firstName || !lastName || !waitlistId) {
        console.error("Missing user information:", { email, firstName, lastName, waitlistId });
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not find your information. Please try joining the waitlist again.",
          className: "bg-black text-white border border-brand/20",
        });
        return;
      }

      console.log("Authentication successful, navigating to dashboard");
      toast({
        title: "Success!",
        description: "Welcome to your dashboard.",
        className: "bg-black text-white border border-brand/20",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Dashboard access error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to access dashboard. Please try again.",
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