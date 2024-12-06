import { Share, Brain, ChartBar, UserCheck } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FeatureCard } from "@/components/FeatureCard";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Index = () => {
  const shareContent = {
    text: "Strata is revolutionizing UX optimization with AI! 🚀 Be among the first to experience the future of web and app design. Join the waitlist now: www.strata.cx",
    url: window.location.href
  };

  const handleShare = async (platform: string) => {
    const shareData = {
      title: "Gambix Early Access",
      text: shareContent.text,
      url: shareContent.url
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
          await navigator.share(shareData);
        } catch (err) {
          console.log('Error sharing:', err);
        }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <img src="/lovable-uploads/12218a5c-e6d1-4914-9dd8-943f5a6528e0.png" alt="Gambix" className="h-10" />
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <Share className="w-4 h-4" />
                  Share
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 bg-[#1A1A1A] border-gray-800">
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleShare('twitter')} className="text-left px-4 py-2 hover:bg-white/10">
                    Twitter
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="text-left px-4 py-2 hover:bg-white/10">
                    LinkedIn
                  </button>
                  <button onClick={() => handleShare('native')} className="text-left px-4 py-2 hover:bg-white/10">
                    More Options
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            <button className="px-4 py-2 text-white/70 hover:text-white transition-colors">
              Login
            </button>
            <button className="px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              Join Waitlist →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-3xl mx-auto text-center space-y-20">
          {/* Early Access Badge */}
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-sm">
            Early access available from Jan 1, 2025
          </div>

          {/* Hero Section */}
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-20 bg-gradient-to-b from-pink-500 to-purple-500" />
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                Early Access
              </h1>
            </div>
            <p className="text-xl text-white/70">
              Welcome to <span className="text-white">the future of website optimization</span>. Get Early Access.
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl" />
            <div className="relative p-8">
              <WaitlistForm />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Content Generation"
              description="Create engaging content automatically with our advanced AI algorithms"
            />
            <FeatureCard
              icon={ChartBar}
              title="Real-Time User Analytics"
              description="Track and analyze user behavior with comprehensive real-time insights"
            />
            <FeatureCard
              icon={UserCheck}
              title="Expert UX Recommendations"
              description="Get personalized suggestions to enhance your user experience"
            />
          </div>

          {/* Social Proof */}
          <div className="mt-20">
            <p className="text-lg mb-8">Secure and Trusted by Techstars, gener8tor, BET, NFLPA</p>
            <div className="flex justify-center gap-8 grayscale hover:grayscale-0 transition-all">
              {/* Add partner logos here */}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center text-white/50 text-sm">
          <div className="flex gap-4">
            <AlertDialog>
              <AlertDialogTrigger className="hover:text-white/70">Privacy Policy</AlertDialogTrigger>
              <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Privacy Policy</AlertDialogTitle>
                  <AlertDialogDescription className="text-left whitespace-pre-wrap">
                    {`Privacy Policy

Last updated: 12/5/2024

Introduction
Gambix ("we," "us," or "our") is committed to protecting your privacy...`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger className="hover:text-white/70">Terms of Service</AlertDialogTrigger>
              <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Terms of Service</AlertDialogTitle>
                  <AlertDialogDescription className="text-left whitespace-pre-wrap">
                    {`Terms of Service

Last updated: 12/5/2024

Acceptance of Terms
By accessing our website...`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p>©2024 Gambix LLC. All Rights Reserved.</p>
        </div>
      </footer>

      {/* reCAPTCHA */}
      <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      <div className="g-recaptcha" data-sitekey="6LfNkJMqAAAAAMmPz-okXEAO4CvzpA7OF65wk_cE"></div>
    </div>
  );
};

export default Index;