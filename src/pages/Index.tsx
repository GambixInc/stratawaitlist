import { WaitlistForm } from "@/components/WaitlistForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialProof from "@/components/SocialProof";
import FeaturesGrid from "@/components/FeaturesGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 pt-10 md:pt-20 pb-16 md:pb-32">
        <div className="max-w-3xl mx-auto text-center space-y-10 md:space-y-20">
          {/* Early Access Badge */}
          <div className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-lg rounded-full text-xs md:text-sm">
            Early access available from Jan 25, 2025
          </div>

          {/* Hero Section */}
          <div className="space-y-4 md:space-y-8">
            <div className="relative">
              <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-1 h-16 md:h-20 bg-gradient-to-b from-[#e57c73] to-[#e57c73]/70" />
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight">
                Early Access
              </h1>
            </div>
            <p className="text-lg md:text-xl text-white/70 px-4 md:px-0">
              Welcome to <span className="text-white">the future of website optimization</span>. Get Early Access.
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl" />
            <div className="relative p-4 md:p-8">
              <WaitlistForm />
            </div>
          </div>

          <FeaturesGrid />
          <SocialProof />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;