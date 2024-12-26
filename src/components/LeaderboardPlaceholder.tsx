import { User } from "lucide-react";

export const LeaderboardPlaceholder = () => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 opacity-50">
      <div className="flex items-center gap-3">
        <span className="text-lg font-medium w-6">-</span>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="font-medium">Join to compete!</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm bg-brand/10 px-2 py-1 rounded">
          0 points
        </span>
        <span className="text-sm bg-brand/10 px-2 py-1 rounded">
          0 refs
        </span>
      </div>
    </div>
  );
};