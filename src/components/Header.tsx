import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  const handleShare = async (platform: string) => {
    const shareContent = {
      text: "I have just joined the waitlist to be apart of the future of the web. You should join too!",
      url: window.location.href
    };

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.text)}&url=${encodeURIComponent(shareContent.url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareContent.url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.url)}`);
        break;
      default:
        try {
          await navigator.share(shareContent);
        } catch (err) {
          console.log('Error sharing:', err);
        }
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <header className="container mx-auto py-4 md:py-6 px-4">
      <div className="flex justify-between items-center">
        <button 
          onClick={handleReload}
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src="/lovable-uploads/12218a5c-e6d1-4914-9dd8-943f5a6528e0.png" 
            alt="Gambix" 
            className="h-12 md:h-20" 
          />
        </button>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/login')}
            className="bg-[#e57c73] hover:bg-[#e57c73]/90 text-white"
          >
            Login
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 md:gap-2 text-sm md:text-base text-white hover:text-[#e57c73] transition-colors">
                <Share className="w-4 h-4 md:w-5 md:h-5" />
                Share
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-black border-[#e57c73]">
              <div className="flex flex-col gap-2">
                <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 text-white px-4 py-2 hover:bg-[#e57c73]/10">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter
                </button>
                <button onClick={() => handleShare('linkedin')} className="flex items-center gap-2 text-white px-4 py-2 hover:bg-[#e57c73]/10">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </button>
                <button onClick={() => handleShare('facebook')} className="flex items-center gap-2 text-white px-4 py-2 hover:bg-[#e57c73]/10">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;