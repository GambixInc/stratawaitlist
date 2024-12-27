import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Leaderboard } from "./Leaderboard";
import { Trophy } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="container mx-auto py-4 md:py-6 px-4">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src="/lovable-uploads/0e88fe57-f24d-470f-bd94-1e8a284f5c77.png" 
            alt="Gambix" 
            className="h-16" 
          />
        </button>
        <div className="flex items-center gap-4">
          <Button
            onClick={scrollToFeatures}
            variant="ghost"
            className="text-white hover:text-[#e57c73]"
          >
            Features
          </Button>
          <Button
            onClick={() => setShowLeaderboard(true)}
            variant="ghost"
            className="text-white hover:text-[#e57c73] flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </Button>
          <AuthButton />
        </div>
      </div>

      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="bg-black border-brand text-white max-w-2xl">
          <Leaderboard />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;