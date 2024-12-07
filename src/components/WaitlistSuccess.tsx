import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CountdownTimer } from "./CountdownTimer";
import { RewardsProgress } from "./RewardsProgress";
import { Share } from "lucide-react";

interface WaitlistSuccessProps {
  userId: string;
}

export const WaitlistSuccess = ({ userId }: WaitlistSuccessProps) => {
  const [referralLink] = useState(`${window.location.origin}/?ref=${userId}`);
  const { toast } = useToast();

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'copy') => {
    const shareUrl = referralLink;
    const shareText = "Join me on the waitlist for this exciting new platform!";

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'instagram':
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Share it on Instagram",
        });
        break;
      case 'copy':
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Share it with your friends",
        });
        break;
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
                onClick={() => handleShare('copy')}
                className="bg-black hover:bg-black/80 text-white border border-white/10"
              >
                <Share className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        )}

        <RewardsProgress />
      </div>
    </div>
  );
};