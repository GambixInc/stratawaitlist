import { useState, useEffect } from "react";
import { Copy, Share2, Twitter, Linkedin, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface WaitlistSuccessProps {
  userId: string;
}

export const WaitlistSuccess = ({ userId }: WaitlistSuccessProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userPosition, setUserPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data
        const { user } = await apiClient.getWaitlistEntryById(userId);
        setUserData(user);

        // Get leaderboard to calculate position
        const { leaderboard } = await apiClient.getLeaderboard(1000); // Get all users
        setTotalUsers(leaderboard.length);
        
        // Find user position (sorted by points, then referral count)
        const position = leaderboard.findIndex((entry: any) => entry.id === userId) + 1;
        setUserPosition(position);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const copyReferralLink = async () => {
    if (userData?.referral_link) {
      const referralUrl = `${window.location.origin}?ref=${userData.referral_link}`;
      try {
        await navigator.clipboard.writeText(referralUrl);
        toast({
          title: "Referral link copied!",
          description: "Share this link with friends to move up in line.",
          className: "bg-green-900/90 text-green-50 border-green-500/50 backdrop-blur-sm shadow-lg",
        });
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const shareOnSocial = (platform: string) => {
    const referralUrl = `${window.location.origin}?ref=${userData?.referral_link}`;
    const text = "Join the waitlist and get early access! Use my referral link to boost your position! 🚀";
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}&summary=${encodeURIComponent(text)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=Join the waitlist&body=${encodeURIComponent(text + " " + referralUrl)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + referralUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-white/70">Loading your position...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-6">
        {/* Success Message */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Successfully signed up for Strata's Waitlist
          </h2>
        </div>

        {/* Referral Link */}
        {userData?.referral_link && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Referral Link</h3>
            <div className="flex items-center gap-2 max-w-md mx-auto">
              <div className="flex-1 bg-white/10 rounded-lg p-3 text-sm font-mono text-white/90 truncate">
                {`${window.location.origin}?ref=${userData.referral_link}`}
              </div>
              <Button
                onClick={copyReferralLink}
                size="sm"
                className="bg-brand hover:bg-brand-hover text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Position Stats */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{userPosition}</div>
            <div className="text-sm text-white/70">Your Position</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{totalUsers}</div>
            <div className="text-sm text-white/70">People on Waitlist</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <p className="text-white/80">
            Share and refer your friends to move up in line!
          </p>
          
          {/* Social Sharing Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => shareOnSocial("email")}
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Mail className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => shareOnSocial("linkedin")}
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => shareOnSocial("twitter")}
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => shareOnSocial("whatsapp")}
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};