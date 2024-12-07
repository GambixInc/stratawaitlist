import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("waitlist")
        .select()
        .eq("email", email)
        .eq("full_name", fullName)
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Please join our waitlist first to gain access.",
        });
        navigate('/');
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
      <h2 className="text-3xl font-bold mb-6 text-[#e57c73]">
        Welcome Back
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            required
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            required
          />
        </div>
        <Button 
          type="submit"
          className="w-full bg-[#e57c73] hover:bg-[#e57c73]/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Checking..." : "Get Started"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};