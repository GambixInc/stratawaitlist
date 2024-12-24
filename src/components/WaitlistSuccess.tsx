import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CountdownTimer } from "./CountdownTimer";
import { RewardsProgress } from "./RewardsProgress";
import { ShareButton } from "./ShareButton";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface WaitlistSuccessProps {
  userId: string;
}

export const WaitlistSuccess = ({ userId }: WaitlistSuccessProps) => {
  const [referralLink] = useState(`${window.location.origin}/?ref=${userId}`);
  const [referralCount, setReferralCount] = useState(0);
  const [hasShared, setHasShared] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferralCount = async () => {
      const { data, error } = await supabase
        .from("waitlist")
        .select("referral_count, email, first_name, last_name")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching referral count:", error);
        return;
      }

      setReferralCount(data.referral_count || 0);
      if (data.email) {
        localStorage.setItem('waitlist_email', data.email);
        localStorage.setItem('waitlist_id', userId);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('last_name', data.last_name);
      }
    };

    fetchReferralCount();
  }, [userId]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setHasShared(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends to climb the leaderboard and unlock exclusive rewards!",
      className: "bg-black text-white border border-brand/20",
    });
  };

  const handleDashboardAccess = async () => {
    try {
      const email = localStorage.getItem('waitlist_email');
      const firstName = localStorage.getItem('first_name');
      const lastName = localStorage.getItem('last_name');
      
      if (!email || !firstName || !lastName) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not find your information. Please try logging in manually.",
          className: "bg-black text-white border border-brand/20",
        });
        return;
      }

      // First check if user already exists
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Generate a secure password
        const password = Math.random().toString(36).slice(-12);
        
        // Sign up the user
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              waitlist_id: userId,
              first_name: firstName,
              last_name: lastName
            }
          }
        });

        if (signUpError) {
          // If user already exists, try signing in
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            throw signInError;
          }
        }
      }

      // At this point, user should be authenticated
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        toast({
          title: "Success!",
          description: "You've been automatically signed in.",
          className: "bg-black text-white border border-brand/20",
        });
        navigate('/dashboard');
      } else {
        throw new Error('Failed to authenticate');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to access dashboard. Please try logging in manually.",
        className: "bg-black text-white border border-brand/20",
      });
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-6">
        <CountdownTimer />
        
        {referralLink && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Share with friends</h3>
              <p className="text-sm text-white/70">
                Share your unique link to climb the leaderboard and unlock rewards!
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="bg-white/5 backdrop-blur-xl border-white/10 text-white"
              />
              <Button
                onClick={handleCopyLink}
                className="bg-black hover:bg-black/80 text-white border border-white/10"
              >
                Copy
              </Button>
            </div>

            <div className="flex flex-col gap-4 items-center">
              <ShareButton 
                shareUrl={referralLink} 
                shareText="Join me on the waitlist for this exciting new platform! Get early access and exclusive rewards 🚀"
                onShare={() => setHasShared(true)}
              />
              <Button
                onClick={handleDashboardAccess}
                disabled={!hasShared}
                className="bg-[#e57c73] hover:bg-[#e57c73]/80 text-white px-6 py-2 text-sm"
              >
                {hasShared ? "Go to Dashboard" : "Share First to Unlock Dashboard"}
              </Button>
            </div>
          </div>
        )}

        <RewardsProgress referralCount={referralCount} />
      </div>
    </div>
  );
};