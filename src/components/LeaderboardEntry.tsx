import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeaderboardEntryType } from "./Leaderboard";

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
  index: number;
  isCurrentUser: boolean;
}

export const LeaderboardEntry = ({ entry, index, isCurrentUser }: LeaderboardEntryProps) => {
  const fullName = `${entry.first_name} ${entry.last_name}`;
  
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg transition-colors",
        isCurrentUser
          ? "bg-brand/20 border border-brand/30"
          : "bg-white/5 hover:bg-white/10"
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-medium w-6">
          {index + 1}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-medium">{fullName}</span>
          {index < 3 && (
            <Crown className="w-4 h-4 text-brand" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm bg-brand/10 px-2 py-1 rounded">
          {entry.points} points
        </span>
        <span className="text-sm bg-brand/10 px-2 py-1 rounded">
          {entry.referral_count} refs
        </span>
      </div>
    </div>
  );
};