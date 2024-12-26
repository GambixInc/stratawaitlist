import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ShareButton } from "../ShareButton";

interface ReferralSectionProps {
  referralLink: string;
  onShare: () => void;
}

export const ReferralSection = ({ referralLink, onShare }: ReferralSectionProps) => {
  const { toast } = useToast();

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    onShare();
    toast({
      title: "Link copied!",
      description: "Share it with your friends to climb the leaderboard and unlock exclusive rewards!",
      className: "bg-black text-white border border-brand/20",
    });
  };

  return (
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
          onShare={onShare}
        />
      </div>
    </div>
  );
};