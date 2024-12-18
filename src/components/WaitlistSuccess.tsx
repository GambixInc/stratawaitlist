import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CountdownTimer } from "./CountdownTimer";
import { RewardsProgress } from "./RewardsProgress";
import { ShareButton } from "./ShareButton";
import { supabase } from "@/lib/supabase";

interface WaitlistSuccessProps {
  userId: string;
}

export const WaitlistSuccess = ({ userId }: WaitlistSuccessProps) => {
  const [referralLink] = useState(`${window.location.origin}/?ref=${userId}`);
  const [referralCount, setReferralCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReferralCount = async () => {
      const { data, error } = await supabase
        .from("waitlist")
        .select("referral_count")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching referral count:", error);
        return;
      }

      setReferralCount(data.referral_count || 0);
    };

    fetchReferralCount();
  }, [userId]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
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

            <div className="flex justify-center">
              <ShareButton shareUrl={referralLink} shareText="Join me on the waitlist for this exciting new platform!" />
            </div>
          </div>
        )}

        <RewardsProgress referralCount={referralCount} />
      </div>
    </div>
  );
};