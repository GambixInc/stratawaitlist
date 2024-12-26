import { Trophy, X } from "lucide-react";
import { Button } from "./ui/button";

interface LeaderboardHeaderProps {
  onClose: () => void;
}

export const LeaderboardHeader = ({ onClose }: LeaderboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-brand" />
        <h3 className="text-xl font-semibold">Top Gambixers</h3>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="hover:bg-brand/10 text-white"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};