import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Could not sign in with Google. Please try again.",
        className: "bg-black text-white border border-[#9b87f5]/20",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("waitlist")
        .select()
        .eq("email", email)
        .eq("first_name", firstName)
        .eq("last_name", lastName)
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Please join our waitlist first to gain access.",
          className: "bg-black text-white border border-[#9b87f5]/20",
        });
        navigate('/');
        return;
      }

      localStorage.setItem('waitlist_id', data.id);
      localStorage.setItem('waitlist_email', email);
      localStorage.setItem('first_name', firstName);
      localStorage.setItem('last_name', lastName);

      toast({
        title: `Welcome back, ${firstName}!`,
        description: "Successfully logged in.",
        className: "bg-black text-white border border-[#9b87f5]/20",
      });

      if (onSuccess) {
        onSuccess();
      }
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
        className: "bg-black text-white border border-[#9b87f5]/20",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
      <h2 className="text-3xl font-bold mb-6 text-brand">
        Welcome Back
      </h2>
      <div className="space-y-6">
        <Button 
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-gray-100 text-black flex items-center justify-center gap-2"
          type="button"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-4 h-4"
          />
          Continue with Google
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-white/50">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            required
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            required
          />
          <Button 
            type="submit"
            className="w-full bg-brand hover:bg-brand-hover text-white"
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Get Started"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};