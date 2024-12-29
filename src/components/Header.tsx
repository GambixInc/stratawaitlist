import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Leaderboard } from "./Leaderboard";
import { Trophy, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-lg z-50">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate('/')}
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/0e88fe57-f24d-470f-bd94-1e8a284f5c77.png" 
              alt="Gambix" 
              className="h-8 md:h-12" 
            />
          </button>

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={toggleMenu}
              className="text-white p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
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
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg py-4 px-4 flex flex-col gap-4 animate-fade-in">
            <Button
              onClick={scrollToFeatures}
              variant="ghost"
              className="text-white hover:text-[#e57c73] w-full justify-start"
            >
              Features
            </Button>
            <Button
              onClick={() => {
                setShowLeaderboard(true);
                setIsMenuOpen(false);
              }}
              variant="ghost"
              className="text-white hover:text-[#e57c73] w-full justify-start flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Button>
            <div className="w-full">
              <AuthButton />
            </div>
          </div>
        )}
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