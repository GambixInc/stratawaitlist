import { Brain, ChartBar, Lightbulb } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FeatureCard } from "@/components/FeatureCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <img src="/lovable-uploads/7c3c2b6a-e7c5-4012-8c44-fd1f26f23e55.png" alt="Strata Logo" className="h-10" />
          <nav className="space-x-6">
            <a href="#features" className="text-white/70 hover:text-white transition-colors">
              Features
            </a>
            <a href="#about" className="text-white/70 hover:text-white transition-colors">
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          Revolutionize Your UX Design with AI-Powered Insights
        </h1>
        <p className="text-xl md:text-2xl text-secondary mb-12 max-w-2xl mx-auto">
          Join the waitlist and get exclusive early access to the ultimate UX optimization platform
        </p>
        <WaitlistForm />
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Brain}
            title="AI-Powered Content Generation"
            description="Create compelling UX content with advanced AI assistance"
          />
          <FeatureCard
            icon={ChartBar}
            title="Real-Time User Analytics"
            description="Track and analyze user behavior with detailed insights"
          />
          <FeatureCard
            icon={Lightbulb}
            title="Expert UX Recommendations"
            description="Get AI-driven suggestions to optimize your design"
          />
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-20 text-center">
        <p className="text-secondary-muted mb-8">Secure and Trusted by</p>
        <div className="flex justify-center items-center space-x-8 opacity-50 hover:opacity-100 transition-opacity">
          <span className="text-xl font-semibold">Techstars</span>
          <span className="text-xl font-semibold">gener8tor</span>
          <span className="text-xl font-semibold">BET</span>
          <span className="text-xl font-semibold">NFLPA</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-secondary-muted">
          <div className="space-x-4">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
          <p className="mt-4 md:mt-0">
            © 2024 Strata Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;