import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

export const WaitlistForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...` // Your API key
        },
        body: JSON.stringify({
          email: email,
          fields: {
            name: name
          }
        })
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been added to our waitlist. We'll be in touch soon!",
        });
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4 p-2 bg-white/5 backdrop-blur-sm rounded-full">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
        <Input
          required
          type="text"
          placeholder="Name"
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
          className="px-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          Join Now
        </Button>
      </div>
      <div className="g-recaptcha" data-sitekey="6LfNkJMqAAAAAMmPz-okXEAO4CvzpA7OF65wk_cE"></div>
    </form>
  );
};