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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");

  useEffect(() => {
    const checkExistingUser = async () => {
      // Check if we have stored waitlist info
      const storedEmail = localStorage.getItem('waitlist_email');
      const storedId = localStorage.getItem('waitlist_id');
      
      if (storedEmail && storedId) {
        // Verify the user exists in the waitlist
        const { data: existingUser } = await supabase
          .from("waitlist")
          .select("id")
          .eq("id", storedId)
          .eq("email", storedEmail)
          .maybeSingle();

        if (existingUser) {
          setSubmittedUserId(existingUser.id);
        }
      }
      setIsLoading(false);
    };

    checkExistingUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First, check if the referral code is valid and get referrer's info
      let referredBy = null;
      if (referralCode) {
        const { data: referrer } = await supabase
          .from("waitlist")
          .select("id, referral_count, points")
          .eq("referral_link", referralCode)
          .maybeSingle();

        if (referrer) {
          referredBy = referralCode;
          
          // Update referrer's stats
          const { error: updateError } = await supabase
            .from("waitlist")
            .update({ 
              referral_count: (referrer.referral_count || 0) + 1,
              points: (referrer.points || 0) + 10,
              last_referral_at: new Date().toISOString()
            })
            .eq("id", referrer.id);

          if (updateError) {
            console.error("Error updating referrer:", updateError);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to update referrer stats.",
            });
          }
        }
      }

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from("waitlist")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Already registered",
          description: "This email is already on the waitlist.",
        });
        setSubmittedUserId(existingUser.id);
        return;
      }

      // Insert new waitlist entry
      const { data, error } = await supabase
        .from("waitlist")
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email: email,
            referral_count: 0,
            points: 0,
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

      // Store waitlist info
      localStorage.setItem('waitlist_email', email);
      localStorage.setItem('waitlist_id', data.id);
      localStorage.setItem('first_name', firstName);
      localStorage.setItem('last_name', lastName);

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

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {!submittedUserId ? (
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
      ) : (
        <WaitlistSuccess userId={submittedUserId} />
      )}
    </div>
  );
};