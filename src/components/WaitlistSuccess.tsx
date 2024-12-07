import { useEffect, useState } from "react";
import { Leaderboard } from "./Leaderboard";
import { supabase } from "@/lib/supabase";
import { Share2, Facebook, Linkedin, Instagram, X } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { RewardsProgress } from "./RewardsProgress";
import { CountdownTimer } from "./CountdownTimer";

interface WaitlistSuccessProps {
  userId: string;
}

export const WaitlistSuccess = ({ userId }: WaitlistSuccessProps) => {
  const [referralLink, setReferralLink] = useState<string>();
  const [referralCount, setReferralCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase
        .from("waitlist")
        .select("referral_link, referral_count")
        .eq("id", userId)
        .single();
      
      if (data) {
        const fullLink = `${window.location.origin}/?ref=${data.referral_link}`;
        setReferralLink(fullLink);
        setReferralCount(data.referral_count || 0);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleShare = async (platform?: string) => {
    if (!referralLink) return;

    const shareText = "Join me on the waitlist for an exciting new platform!";
    const shareUrl = referralLink;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'instagram':
        // Since Instagram doesn't have a direct share URL, we'll copy the link
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Share it on Instagram with your friends.",
        });
        break;
      default:
        try {
          await navigator.share({
            title: "Join the Waitlist",
            text: shareText,
            url: shareUrl,
          });
        } catch (err) {
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Link copied!",
            description: "Share it with your friends to earn rewards.",
          });
        }
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-6">
        <CountdownTimer />
        
        {referralLink && (
          <div className="space-y-4">
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
                onClick={() => handleShare()}
                variant="secondary"
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                onClick={() => handleShare('facebook')}
                variant="ghost"
                size="icon"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-lg"
              >
                <Facebook className="w-6 h-6" />
              </Button>
              <Button
                onClick={() => handleShare('twitter')}
                variant="ghost"
                size="icon"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-lg"
              >
                <X className="w-6 h-6" />
              </Button>
              <Button
                onClick={() => handleShare('linkedin')}
                variant="ghost"
                size="icon"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-lg"
              >
                <Linkedin className="w-6 h-6" />
              </Button>
              <Button
                onClick={() => handleShare('instagram')}
                variant="ghost"
                size="icon"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-lg"
              >
                <Instagram className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}

        <RewardsProgress referralCount={referralCount} />
      </div>
      
      <Leaderboard currentUserId={userId} />
    </div>
  );
};