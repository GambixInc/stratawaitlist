import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { ShareButton } from "./ShareButton";
import { Button } from "./ui/button";

interface WaitlistSuccessProps {
  userId: string;
}

export const WaitlistSuccess = ({ userId }: WaitlistSuccessProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Showing success animation for user:', userId);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-brand mb-2">
          Welcome to the waitlist!
        </h3>
        <p className="text-white/80">
          Share with friends to climb the leaderboard!
        </p>
      </div>
      <ShareButton userId={userId} />
      <Button
        onClick={() => {
          console.log('Navigating to dashboard');
          navigate('/dashboard');
        }}
        className="w-full bg-brand hover:bg-brand-hover text-white"
      >
        Go to Dashboard
      </Button>
    </div>
  );
};