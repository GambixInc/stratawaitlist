import { Share } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  shareUrl?: string;
  shareText?: string;
  onShare?: () => void;
}

export const ShareButton = ({ shareUrl, shareText, onShare }: ShareButtonProps) => {
  const { toast } = useToast();
  
  const getShareUrl = (url: string, platform: string) => {
    const baseUrl = url || window.location.href;
    const utmParams = new URLSearchParams({
      utm_source: platform,
      utm_medium: 'referral',
      utm_campaign: 'waitlist_share'
    });
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${utmParams.toString()}`;
  };

  const defaultShareText = "🚀 Join me on Gambix! I'm already in line for early access to the future of website optimization. Skip the queue and get exclusive rewards using my referral link:";
  
  const handleShare = async (platform: string) => {
    const url = getShareUrl(shareUrl || window.location.href, platform);
    const text = shareText || defaultShareText;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
        break;
      default:
        try {
          if (navigator.share) {
            await navigator.share({
              title: "Join Gambix Waitlist",
              text: text,
              url: url
            });
          } else {
            await navigator.clipboard.writeText(`${text}\n${url}`);
            toast({
              title: "Link copied!",
              description: "Share it with your friends to climb the leaderboard and unlock exclusive rewards!",
              className: "bg-black text-white border border-brand/20",
            });
          }
        } catch (err) {
          console.error('Error sharing:', err);
        }
    }
    
    onShare?.();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 md:gap-2 text-sm md:text-base text-white hover:text-brand transition-colors">
          <Share className="w-4 h-4 md:w-5 md:h-5" />
          Share
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 bg-black border-brand">
        <div className="flex flex-col gap-2">
          <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 text-white px-4 py-2 hover:bg-brand/10">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Twitter
          </button>
          <button onClick={() => handleShare('linkedin')} className="flex items-center gap-2 text-white px-4 py-2 hover:bg-brand/10">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </button>
          <button onClick={() => handleShare('facebook')} className="flex items-center gap-2 text-white px-4 py-2 hover:bg-brand/10">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};