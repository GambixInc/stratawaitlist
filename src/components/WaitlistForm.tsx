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
      const storedEmail = localStorage.getItem('waitlist_email');
      const storedId = localStorage.getItem('waitlist_id');
      
      if (storedEmail && storedId) {
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
      // First, check if email already exists
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

      // Check if the referral code is valid and get referrer's info
      let referredBy = null;
      if (referralCode) {
        console.log("Checking referral code:", referralCode);
        const { data: referrer } = await supabase
          .from("waitlist")
          .select("id, referral_count, points, referral_link")
          .eq("referral_link", referralCode)
          .maybeSingle();

        if (referrer) {
          referredBy = referrer.id; // Use the referrer's ID, not the referral_link
          console.log("Found referrer:", referrer);
          
          // Update referrer's stats with the new count and points
          const newReferralCount = (referrer.referral_count || 0) + 1;
          const newPoints = (referrer.points || 0) + 10;
          
          const { error: updateError } = await supabase
            .from("waitlist")
            .update({ 
              referral_count: newReferralCount,
              points: newPoints,
              last_referral_at: new Date().toISOString()
            })
            .eq("id", referrer.id);

          if (updateError) {
            console.error("Error updating referrer stats:", updateError);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to update referrer stats.",
            });
          } else {
            console.log("Successfully updated referrer stats:", {
              newReferralCount,
              newPoints
            });
          }
        } else {
          console.log("No referrer found for code:", referralCode);
        }
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
        title: "Share with friends",
        className: "bg-black text-white border border-[#9b87f5]/20",
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
