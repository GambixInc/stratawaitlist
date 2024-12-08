import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { LoginForm } from "./LoginForm";
import { supabase } from "@/lib/supabase";

export const AuthButton = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <>
      <Button
        onClick={isAuthenticated ? handleLogout : () => setShowLoginForm(true)}
        className="bg-[#e57c73] hover:bg-[#e57c73]/90 text-white"
      >
        {isAuthenticated ? 'Logout' : 'Login'}
      </Button>

      <Dialog open={showLoginForm} onOpenChange={setShowLoginForm}>
        <DialogContent className="bg-black border-[#e57c73] text-white">
          <div className="p-6">
            <LoginForm onSuccess={() => setShowLoginForm(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};