import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { LoginForm } from "./LoginForm";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const AuthButton = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      console.log("Checking initial session");
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      // If we're on the dashboard and not authenticated, redirect to home
      if (!session && window.location.pathname === '/dashboard') {
        console.log("No session found on dashboard, redirecting to home");
        navigate('/');
        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
          className: "bg-black text-white border border-brand/20",
        });
      }
    };
    
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, !!session);
      setIsAuthenticated(!!session);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, navigating to home");
        navigate('/');
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
          className: "bg-black text-white border border-brand/20",
        });
      } else if (event === 'SIGNED_IN') {
        console.log("User signed in, navigating to dashboard");
        navigate('/dashboard');
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
          className: "bg-black text-white border border-brand/20",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      console.log("Initiating logout");
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      window.location.reload(); // Refresh the page after logout
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
        className: "bg-black text-white border border-brand/20",
      });
    }
  };

  return (
    <>
      <Button
        onClick={isAuthenticated ? handleLogout : () => setShowLoginForm(true)}
        className="bg-brand hover:bg-brand-hover text-white"
      >
        {isAuthenticated ? 'Logout' : 'Login'}
      </Button>

      <Dialog open={showLoginForm} onOpenChange={setShowLoginForm}>
        <DialogContent className="bg-black border-brand text-white">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <LoginForm onSuccess={() => {
              setShowLoginForm(false);
              setIsAuthenticated(true);
              window.location.reload(); // Refresh the page after successful login
            }} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};