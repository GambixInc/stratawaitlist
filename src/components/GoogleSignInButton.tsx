import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const GoogleSignInButton = () => {
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    console.log('Initiating Google sign-in');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        className: "bg-black text-white border border-brand/20",
      });
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full bg-white hover:bg-gray-100 text-black flex items-center justify-center gap-2"
      type="button"
    >
      <img 
        src="https://www.google.com/favicon.ico" 
        alt="Google" 
        className="w-4 h-4"
      />
      Join with Google
    </Button>
  );
};