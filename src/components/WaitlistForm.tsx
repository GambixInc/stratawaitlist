import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import confetti from 'canvas-confetti';
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address")
});

type LeaderboardEntry = {
  name: string;
  referrals: number;
  position: number;
};

export const WaitlistForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPosition, setUserPosition] = useState<number>(0);

  useEffect(() => {
    // Auto-focus name input on mount
    const nameInput = document.getElementById("name-input");
    if (nameInput) nameInput.focus();
  }, []);

  const validateForm = () => {
    try {
      formSchema.parse({ name, email });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: "Validation Error",
            description: err.message,
            variant: "destructive"
          });
        });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZjI1MzBkMzFlOWJjMmJlY2Y1MWM4Y2FmNDUzZmEzMzE2ZjE1OGIzYjJjMDE2ZDI3M2EyMDE1MDNlYWViMzlkODkyNjIyMGFkODdmODRmYWQiLCJpYXQiOjE3MzM0MzA4NTEuODMzOTE5LCJuYmYiOjE3MzM0MzA4NTEuODMzOTIyLCJleHAiOjQ4ODkxMDQ0NTEuODI5MjUxLCJzdWIiOiI2NzY0MTciLCJzY29wZXMiOltdfQ.hd_7BSSBN2ycoca7lp7FpRsk7jKfUTt6BkBwDCMrLuRr6IgaAd-H2dmue0H9iH5xleGu2-Fi-SKnZUzUgoVJSD0AGxkyXNr7owPMz8rSi6A1PiLMNwKq8JzRE1se_nM0opJ_qr1YGoz46ahZUQB89Wy8y0aQJhwZ9XBFcHIKPYhOCXlsQ8VX-c1naibi9HRAYffBDdszFMULuYUN3JUYyCh5uBbXi_ygvu8bRjQSXpwTAsrjRbgEUFNy_FIJIZJfI-RhQ0p-s9e4auEzBKyT9c9cMgbpdzv3GMQ3y-iLEKm7yzxYHsoSkNJ61aL_XGgXAfGBEJA9-hAPWGc5q6EztQIMvWVI72N7Nz0rNm3QcHOKe8Gp0nThJj1bhDHjLsUZQPl4t8kYI0Cm_4V19LK4YnAZ2Z2CVj1Ym2q0ffsLjnYMKqF0fGgjZKh9xMJXznvwcDpHPvbjdSdwkNhQgVl1Ke5gaJK7BQaE1CwBtQKVJYUlB-qBZMrwtUuc-3LqP9KuGnH3xaIIG5E6Zs58nrm-4emqDVBa370RLhSVEL97FAzLMjOYmBhUKokOIo56A5UzArrg2yQ9r6cXVxZPQWFaavHQLwUzLkFe6PVelRlDPBuctjKmcWIOSGT3_5TgsRA6RJRby0XyJ2etZjkA_6Jh7gLCq2OIjKQ5snDdZa4wgYM`
        },
        body: JSON.stringify({
          email: email,
          fields: {
            name: name
          }
        })
      });

      if (response.ok) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setShowConfirmation(true);
        setName("");
        setEmail("");
        // Generate a unique referral code (you might want to get this from your backend)
        setReferralCode(`${name.toLowerCase().replace(/\s+/g, '')}-${Math.random().toString(36).substr(2, 6)}`);
        // Mock leaderboard data - replace with real data from your backend
        setLeaderboard([
          { name: "John D.", referrals: 15, position: 1 },
          { name: "Sarah M.", referrals: 12, position: 2 },
          { name: "Mike R.", referrals: 10, position: 3 },
          // Add more entries...
        ]);
        setUserPosition(4); // Mock position - replace with real position from your backend
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-6 p-2 bg-white/5 backdrop-blur-sm rounded-full">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e57c73] to-[#e57c73]/70" />
          <Input
            required
            id="name-input"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0"
          />
          <Input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 rounded-full bg-[#e57c73] hover:bg-[#e57c73]/90 text-white"
          >
            Join Now
          </Button>
        </div>
      </form>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-black/90 backdrop-blur-lg border-[#e57c73]/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Welcome to the Future! 🚀</DialogTitle>
            <DialogDescription className="text-white/90">
              <div className="space-y-6 mt-4">
                <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-2">Your Position: #{userPosition}</h3>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#e57c73] rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min(100, (userPosition/10) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Leaderboard</h3>
                  <div className="space-y-2">
                    {leaderboard.map((entry, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center p-2 rounded bg-white/5"
                      >
                        <span>#{entry.position} {entry.name}</span>
                        <span>{entry.referrals} referrals</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Share to climb the ranks!</h3>
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`https://yourdomain.com?ref=${referralCode}`);
                        toast({
                          title: "Link Copied!",
                          description: "Share it with your network to climb the leaderboard!",
                        });
                      }}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                <div className="text-sm text-white/60">
                  <h4 className="font-semibold mb-1">Rewards:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>5 referrals: Early Access</li>
                    <li>10 referrals: Exclusive Merch</li>
                    <li>20 referrals: VIP Benefits</li>
                  </ul>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};