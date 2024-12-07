import { LoginHeader } from "@/components/LoginHeader";
import { LoginForm } from "@/components/LoginForm";
import { LoginFeatures } from "@/components/LoginFeatures";

export const Login = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a5a] to-[#1a1a1a] opacity-50" />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <LoginHeader />

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <LoginForm />
            <LoginFeatures />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;