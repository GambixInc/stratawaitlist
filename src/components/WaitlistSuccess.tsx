import { CountdownTimer } from "./CountdownTimer";

interface WaitlistSuccessProps {
  userId: string;
}

export const WaitlistSuccess = ({ userId }: WaitlistSuccessProps) => {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-6">
        <CountdownTimer />
      </div>
    </div>
  );
};