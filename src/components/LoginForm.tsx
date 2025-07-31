import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user exists in waitlist using our API
      const waitlistUser = await apiClient.getWaitlistEntryByEmail(email);

      if (!waitlistUser) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Please join our waitlist first to gain access.",
          className: "bg-black text-white border border-[#9b87f5]/20",
        });
        navigate('/');
        return;
      }

      // Verify the name matches
      if (waitlistUser.first_name !== firstName || waitlistUser.last_name !== lastName) {
        toast({
          variant: "destructive",
          title: "Invalid Information",
          description: "The provided information doesn't match our records.",
          className: "bg-black text-white border border-[#9b87f5]/20",
        });
        return;
      }

      // Store waitlist info
      localStorage.setItem('waitlist_id', waitlistUser.id);
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            required
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
          className="w-full bg-brand hover:bg-brand-hover text-white"
          disabled={isLoading}
        >
          {isLoading ? "Checking..." : "Get Started"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};