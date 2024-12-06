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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Success!",
      description: "You've been added to our waitlist. We'll be in touch soon!",
    });

    setName("");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 max-w-3xl mx-auto">
      <div className="flex-1 flex gap-4 p-2 bg-white/5 rounded-full">
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
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="px-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
      >
        Join Now
      </Button>
    </form>
  );
};