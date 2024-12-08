import { useNavigate } from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { ShareButton } from "./ShareButton";

const Header = () => {
  const navigate = useNavigate();

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
          <AuthButton />
          <ShareButton />
        </div>
      </div>
    </header>
  );
};

export default Header;