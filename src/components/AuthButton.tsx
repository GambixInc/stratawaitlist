import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { LoginForm } from "./LoginForm";
import { useToast } from "@/hooks/use-toast";

export const AuthButton = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated via localStorage
    const checkAuth = () => {
      const waitlistId = localStorage.getItem('waitlist_id');
      const email = localStorage.getItem('waitlist_email');
      const isAuth = !!(waitlistId && email);
      setIsAuthenticated(isAuth);
      
      // If we're on the dashboard and not authenticated, redirect to home
      if (!isAuth && window.location.pathname === '/dashboard') {
        console.log("No authentication found on dashboard, redirecting to home");
        navigate('/');
        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
          className: "bg-yellow-900/90 text-yellow-50 border-yellow-500/50 backdrop-blur-sm shadow-lg",
        });
      }
    };
    
    checkAuth();

    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      console.log("Initiating logout");
      localStorage.removeItem('waitlist_id');
      localStorage.removeItem('waitlist_email');
      localStorage.removeItem('first_name');
      localStorage.removeItem('last_name');
      setIsAuthenticated(false);
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        className: "bg-green-900/90 text-green-50 border-green-500/50 backdrop-blur-sm shadow-lg",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
        className: "bg-red-900/90 text-red-50 border-red-500/50 backdrop-blur-sm shadow-lg",
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
            }} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};