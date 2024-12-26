import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface ShareButtonProps {
  userId: string;
}

export const ShareButton = ({ userId }: ShareButtonProps) => {
  const { toast } = useToast();
  
  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}?ref=${userId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Link copied!",
        description: "Share it with your friends to earn points!",
        className: "bg-black text-white border border-brand/20",
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link. Please try again.",
        className: "bg-black text-white border border-brand/20",
      });
    }
  };

  return (
    <Button 
      onClick={handleShare}
      className="w-full bg-brand hover:bg-brand-hover text-white"
    >
      Share Referral Link
    </Button>
  );
};