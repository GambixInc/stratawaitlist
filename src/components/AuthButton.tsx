import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { LoginForm } from "./LoginForm";
import { supabase } from "@/lib/supabase";

export const AuthButton = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_OUT') {
        navigate('/');
      } else if (event === 'SIGNED_IN') {
        navigate('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // If we're on the dashboard, we know we're authenticated
  useEffect(() => {
    if (window.location.pathname === '/dashboard') {
      setIsAuthenticated(true);
    }
  }, []);

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
              navigate('/dashboard');
            }} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};