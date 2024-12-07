import { Zap, Bot, Sparkles, Settings2 } from "lucide-react";

export const LoginFeatures = () => {
  return (
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
        <p className="text-lg font-medium text-white">Experience the future of website automation with AI</p>
      </div>
    </div>
  );
};