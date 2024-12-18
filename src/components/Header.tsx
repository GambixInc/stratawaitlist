import { useNavigate } from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { Button } from "./ui/button";

const Header = () => {
  const navigate = useNavigate();

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
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;