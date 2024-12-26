import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { WaitlistFormInputs } from "./WaitlistFormInputs";
import { WaitlistSuccess } from "./WaitlistSuccess";
import { useSearchParams } from "react-router-dom";
import { GoogleSignInButton } from "./GoogleSignInButton";

export const WaitlistForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUserId, setSubmittedUserId] = useState<string>();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");

  useEffect(() => {
    // Listen for auth state changes
    console.log('Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Get user details from Google auth
          const { user } = session;
          console.log('User signed in:', user);
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
            console.log('User already exists in waitlist:', existingUser);
            // User already exists, update localStorage
            localStorage.setItem('waitlist_id', existingUser.id);
            localStorage.setItem('waitlist_email', email);
            localStorage.setItem('first_name', firstName);
            localStorage.setItem('last_name', lastName);
            setSubmittedUserId(existingUser.id);
            return;
          }

          console.log('Adding new user to waitlist');
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
            console.log('User added to waitlist:', waitlistEntry);
            localStorage.setItem('waitlist_id', waitlistEntry.id);
            localStorage.setItem('waitlist_email', email);
            localStorage.setItem('first_name', firstName);
            localStorage.setItem('last_name', lastName);
            setSubmittedUserId(waitlistEntry.id);

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
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [referralCode, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting waitlist form');

    try {
      // First, check if the referral code is valid
      let referredBy = null;
      if (referralCode) {
        console.log('Checking referral code:', referralCode);
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
          console.log('Updated referrer count');
        }
      }

      console.log('Adding new user to waitlist');
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

      console.log('User added successfully:', data);
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
      {!submittedUserId ? (
        <div className="space-y-6">
          <GoogleSignInButton />
          
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
      ) : (
        <WaitlistSuccess userId={submittedUserId} />
      )}
    </div>
  );
};