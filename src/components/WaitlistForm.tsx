import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
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
        try {
          const { user: existingUser } = await apiClient.getWaitlistEntryById(storedId);
          if (existingUser && existingUser.email === storedEmail) {
            setSubmittedUserId(existingUser.id);
          }
        } catch (error) {
          console.error('Error checking existing user:', error);
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
      try {
        const { user: existingUser } = await apiClient.getWaitlistEntryByEmail(email);
        if (existingUser) {
          toast({
            variant: "destructive",
            title: "Already registered",
            description: "This email is already on the waitlist.",
          });
          setSubmittedUserId(existingUser.id);
          return;
        }
      } catch (error) {
        // User doesn't exist, continue with registration
      }

      // Create new waitlist entry with referral code if provided
      const { user: data } = await apiClient.createWaitlistEntry({
        first_name: firstName,
        last_name: lastName,
        email: email,
        referral_code: referralCode || undefined
      });

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
