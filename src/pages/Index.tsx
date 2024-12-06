import { Share } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider">STUDIO AI</div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <Share className="w-4 h-4" />
              Share
            </button>
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
          <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm">
            Early access available from May 1, 2023
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
              Welcome to <span className="text-white">the future of web design</span>. Get Early Access.
            </p>
          </div>

          {/* Waitlist Form */}
          <WaitlistForm />

          {/* Terms */}
          <p className="text-sm text-white/50">
            This site is protected by reCAPTCHA and the{" "}
            <a href="#" className="underline hover:text-white/70">
              Google Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-white/70">
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center text-white/50 text-sm">
          <a href="#" className="hover:text-white/70">
            @studio
          </a>
          <p>©2023 STUDIO Inc. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Product Hunt Badge */}
      <div className="fixed bottom-4 right-4">
        <a
          href="#"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-black text-sm font-medium hover:bg-white/90 transition-colors"
        >
          🏆 #1 Product of the Week
        </a>
      </div>
    </div>
  );
};

export default Index;