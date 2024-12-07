import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export const WaitlistForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setShowConfirmation(true);
        setName("");
        setEmail("");
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
        <div className="flex flex-col gap-4 p-2 bg-white/5 backdrop-blur-sm rounded-full">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e57c73] to-[#e57c73]/70" />
          <Input
            required
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0"
            autoFocus
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
        <div className="g-recaptcha" data-sitekey="6LfNkJMqAAAAAMmPz-okXEAO4CvzpA7OF65wk_cE"></div>
      </form>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thank you for joining!</DialogTitle>
            <DialogDescription>
              Share with your network to move up the waitlist and get earlier access!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};