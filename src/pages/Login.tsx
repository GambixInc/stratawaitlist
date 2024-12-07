import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Bot, Sparkles, ArrowRight, Settings2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const Login = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user exists in waitlist
      const { data, error } = await supabase
        .from("waitlist")
        .select()
        .eq("email", email)
        .eq("full_name", fullName)
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Please join our waitlist first to gain access.",
        });
        navigate('/');
        return;
      }

      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <img 
            src="/lovable-uploads/12218a5c-e6d1-4914-9dd8-943f5a6528e0.png" 
            alt="Gambix" 
            className="h-16" 
          />
          <Button
            variant="ghost"
            className="text-white hover:text-[#e57c73]"
            onClick={() => navigate('/')}
          >
            Back to Waitlist
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Login Form */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#e57c73] to-purple-500 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-[#e57c73] hover:bg-[#e57c73]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Checking..." : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white mb-8">
              AI-Powered Website Optimization & Automation
            </h3>
            
            <div className="grid gap-6">
              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="p-2 bg-[#e57c73]/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-[#e57c73]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Increase Revenue by 30%+</h4>
                  <p className="text-white/70">Our AI optimization engine automatically enhances your conversion rates.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="p-2 bg-[#e57c73]/10 rounded-lg">
                  <Bot className="h-6 w-6 text-[#e57c73]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Automated Maintenance</h4>
                  <p className="text-white/70">AI-powered updates and maintenance keep your site running smoothly 24/7.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="p-2 bg-[#e57c73]/10 rounded-lg">
                  <Settings2 className="h-6 w-6 text-[#e57c73]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Smart Optimization</h4>
                  <p className="text-white/70">Continuous performance improvements with zero manual effort.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#e57c73]/20 to-purple-500/20 rounded-xl border border-white/10">
              <Zap className="h-8 w-8 text-[#e57c73]" />
              <p className="text-lg font-medium text-white">Join the businesses saving $10k+ monthly with our AI platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;