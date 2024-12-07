import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { Leaderboard } from "./Leaderboard";

export const WaitlistForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUserId, setSubmittedUserId] = useState<string>();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("waitlist")
        .insert([
          {
            full_name: fullName,
            email: email,
            referral_count: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSubmittedUserId(data.id);
      
      toast({
        title: "Welcome to the waitlist!",
        description: "Thank you for joining. Share with friends to climb the leaderboard!",
      });

      // Reset form
      setFullName("");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            disabled={isSubmitting}
          />
          <Separator className="bg-white/10" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            disabled={isSubmitting}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-[#e57c73] hover:bg-[#e57c73]/90 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Joining..." : "Join Now"}
        </Button>
      </form>

      {submittedUserId && (
        <div className="animate-fade-in">
          <Leaderboard currentUserId={submittedUserId} />
        </div>
      )}
    </div>
  );
};