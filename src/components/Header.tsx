import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-brand hover:text-brand/90 transition-colors"
          >
            Gambix
          </button>

          {isMobile ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
                onClick={scrollToFeatures}
              >
                Features
              </Button>
            </div>
          )}
        </div>

        {isMobile && isOpen && (
          <div className="py-4 space-y-4">
            <Button
              variant="ghost"
              className="w-full text-white hover:text-white hover:bg-white/10 justify-start"
              onClick={scrollToFeatures}
            >
              Features
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;