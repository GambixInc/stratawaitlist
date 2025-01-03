import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface WaitlistFormInputsProps {
  firstName: string;
  lastName: string;
  email: string;
  isSubmitting: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export const WaitlistFormInputs = ({
  firstName,
  lastName,
  email,
  isSubmitting,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
}: WaitlistFormInputsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          required
          className="bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder:text-white/50 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]"
          disabled={isSubmitting}
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          required
          className="bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder:text-white/50 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]"
          disabled={isSubmitting}
        />
      </div>
      <Separator className="bg-white/10" />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        className="bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder:text-white/50 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]"
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        className="w-full bg-[#e57c73]/90 hover:bg-[#e57c73] backdrop-blur-xl border border-white/10 text-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Joining..." : "Join Now"}
      </Button>
    </div>
  );
};