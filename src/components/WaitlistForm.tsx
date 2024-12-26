import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { WaitlistFormInputs } from "./WaitlistFormInputs";
import { WaitlistSuccess } from "./WaitlistSuccess";
import { useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";

export const WaitlistForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUserId, setSubmittedUserId] = useState<string>();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
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

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Get user details from Google auth
          const { user } = session;
          const firstName = user.user_metadata.full_name?.split(' ')[0] || '';
          const lastName = user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '';
          const email = user.email || '';

          // Check if user already exists in waitlist
          const { data: existingUser } = await supabase
            .from('waitlist')
            .select('id')
            .eq('email', email)
            .maybeSingle();

          if (existingUser) {
            // User already exists, update localStorage
            localStorage.setItem('waitlist_id', existingUser.id);
            localStorage.setItem('waitlist_email', email);
            localStorage.setItem('first_name', firstName);
            localStorage.setItem('last_name', lastName);
            return;
          }

          // Add user to waitlist
          const { data: waitlistEntry, error: waitlistError } = await supabase
            .from('waitlist')
            .insert([
              {
                email,
                first_name: firstName,
                last_name: lastName,
                referral_count: 0,
                referred_by: referralCode,
              }
            ])
            .select()
            .single();

          if (waitlistError) throw waitlistError;

          if (waitlistEntry) {
            localStorage.setItem('waitlist_id', waitlistEntry.id);
            localStorage.setItem('waitlist_email', email);
            localStorage.setItem('first_name', firstName);
            localStorage.setItem('last_name', lastName);
            setSubmittedUserId(waitlistEntry.id);

            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });

            toast({
              title: "Welcome to the waitlist!",
              description: "Thank you for joining. Share with friends to climb the leaderboard!",
              className: "bg-black text-white border border-brand/20",
            });
          }
        } catch (error) {
          console.error('Error processing sign in:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to process your registration. Please try again.",
            className: "bg-black text-white border border-brand/20",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [referralCode, toast]);

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
        className: "bg-black text-white border border-brand/20",
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
        className: "bg-black text-white border border-brand/20",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
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
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-white/50">Or continue with email</span>
          </div>
        </div>

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
      </div>

      {submittedUserId && <WaitlistSuccess userId={submittedUserId} />}
    </div>
  );
};