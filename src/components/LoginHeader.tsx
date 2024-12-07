import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const LoginHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-16">
      <img 
        src="/lovable-uploads/0e88fe57-f24d-470f-bd94-1e8a284f5c77.png" 
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
  );
};