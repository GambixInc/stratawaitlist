import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { WaitlistFormInputs } from "./WaitlistFormInputs";
import { WaitlistSuccess } from "./WaitlistSuccess";
import { useSearchParams } from "react-router-dom";

export const WaitlistForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUserId, setSubmittedUserId] = useState<string>();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First, check if the referral code is valid
      let referredBy = null;
      if (referralCode) {
        const { data: referrer } = await supabase
          .from("waitlist")
          .select("id, referral_count")
          .eq("referral_link", referralCode)
          .single();

        if (referrer) {
          referredBy = referralCode;
          // Increment referrer's count
          await supabase
            .from("waitlist")
            .update({ referral_count: (referrer.referral_count || 0) + 1 })
            .eq("id", referrer.id);
        }
      }

      const { data, error } = await supabase
        .from("waitlist")
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email: email,
            referral_count: 0,
            referred_by: referredBy
          },
        ])
        .select()
        .single();

      if (error) throw error;

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

      setFirstName("");
      setLastName("");
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
        <WaitlistFormInputs
          firstName={firstName}
          lastName={lastName}
          email={email}
          isSubmitting={isSubmitting}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmail}
        />
      </form>

      {submittedUserId && <WaitlistSuccess userId={submittedUserId} />}
    </div>
  );
};