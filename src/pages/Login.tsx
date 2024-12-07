import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart3, Zap, LineChart, TrendingUp, ArrowRight } from "lucide-react";

export const Login = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the login logic
    navigate('/dashboard');
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
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-[#e57c73] hover:bg-[#e57c73]/90 text-white"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white mb-8">
              Optimize Your Website with AI-Powered Analytics
            </h3>
            
            <div className="grid gap-6">
              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="p-2 bg-[#e57c73]/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-[#e57c73]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h4>
                  <p className="text-white/70">Track user behavior and engagement metrics in real-time with our advanced dashboard.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="p-2 bg-[#e57c73]/10 rounded-lg">
                  <Zap className="h-6 w-6 text-[#e57c73]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Insights</h4>
                  <p className="text-white/70">Get intelligent recommendations to optimize your website's performance.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="p-2 bg-[#e57c73]/10 rounded-lg">
                  <LineChart className="h-6 w-6 text-[#e57c73]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Performance Metrics</h4>
                  <p className="text-white/70">Monitor key metrics and track your website's growth over time.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#e57c73]/20 to-purple-500/20 rounded-xl border border-white/10">
              <TrendingUp className="h-8 w-8 text-[#e57c73]" />
              <p className="text-lg font-medium text-white">Join thousands of websites already optimizing with our platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;