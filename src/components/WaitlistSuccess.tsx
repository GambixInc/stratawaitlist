import { Leaderboard } from "./Leaderboard";

interface WaitlistSuccessProps {
  userId: string;
}

export const WaitlistSuccess = ({ userId }: WaitlistSuccessProps) => {
  return (
    <div className="animate-fade-in">
      <Leaderboard currentUserId={userId} />
    </div>
  );
};