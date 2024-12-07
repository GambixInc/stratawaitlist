import { useEffect, useState } from "react";
import { Leaderboard } from "./Leaderboard";
import { supabase } from "@/lib/supabase";
import { Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface WaitlistSuccessProps {
  userId: string;
}

export const WaitlistSuccess = ({ userId }: WaitlistSuccessProps) => {
  const [referralLink, setReferralLink] = useState<string>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchReferralLink = async () => {
      const { data } = await supabase
        .from("waitlist")
        .select("referral_link")
        .eq("id", userId)
        .single();
      
      if (data) {
        const fullLink = `${window.location.origin}/?ref=${data.referral_link}`;
        setReferralLink(fullLink);
      }
    };

    fetchReferralLink();
  }, [userId]);

  const handleShare = async () => {
    if (!referralLink) return;

    try {
      await navigator.share({
        title: "Join the Waitlist",
        text: "I just joined the waitlist for an exciting new platform. Join me!",
        url: referralLink,
      });
    } catch (err) {
      // If Web Share API is not supported, copy to clipboard
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link copied!",
        description: "Share it with your friends to earn rewards.",
      });
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {referralLink && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-semibold">Share with friends</h3>
          <p className="text-sm text-white/70">
            Share your unique link to climb the leaderboard and unlock rewards!
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm"
            />
            <Button
              onClick={handleShare}
              variant="secondary"
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      )}
      <Leaderboard currentUserId={userId} />
    </div>
  );
};