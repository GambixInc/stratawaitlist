import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const WaitlistForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { fullName, email });
    // Reset form
    setFullName("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
        <Separator className="bg-white/10" />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
      </div>
      <Button type="submit" className="w-full bg-[#e57c73] hover:bg-[#e57c73]/90 text-white">
        Join Now
      </Button>
    </form>
  );
};