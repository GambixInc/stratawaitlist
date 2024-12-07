import { LoginFeatures } from "@/components/LoginFeatures";
import { Leaderboard } from "@/components/Leaderboard";
import Header from "@/components/Header";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#e57c73]">
          Welcome Back!
        </h1>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Leaderboard />
          <LoginFeatures />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;