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
        .select("referral_count, email")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching referral count:", error);
        return;
      }

      setReferralCount(data.referral_count || 0);
      // Store email for later use in sign in
      if (data.email) {
        localStorage.setItem('waitlist_email', data.email);
      }
    };

    fetchReferralCount();
  }, [userId]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setHasShared(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
  };

  const handleDashboardAccess = async () => {
    const email = localStorage.getItem('waitlist_email');
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find your email. Please try logging in manually.",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Check your email for the login link.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send login link. Please try again.",
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
                shareText="Join me on the waitlist for this exciting new platform!"
                onShare={() => setHasShared(true)}
              />
              <Button
                onClick={handleDashboardAccess}
                disabled={!hasShared}
                className="bg-[#e57c73] hover:bg-[#e57c73]/90 text-white px-6"
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