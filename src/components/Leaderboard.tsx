import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Trophy, Crown, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { LeaderboardEntry } from "./LeaderboardEntry";
import { LeaderboardHeader } from "./LeaderboardHeader";

export type LeaderboardEntryType = {
  id: string;
  first_name: string;
  last_name: string;
  referral_count: number;
  created_at: string;
  tier_level: number;
  points: number;
};

export const Leaderboard = ({ currentUserId }: { currentUserId?: string }) => {
  const [isVisible, setIsVisible] = useState(true);
  const queryClient = useQueryClient();

  // Note: Real-time updates are not implemented in the SQLite version
  // You can implement polling or WebSocket if needed
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [queryClient]);

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { leaderboard } = await apiClient.getLeaderboard(10);
      return leaderboard as LeaderboardEntryType[];
    },
  });

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="w-full bg-brand hover:bg-brand-hover text-white"
      >
        <Trophy className="w-4 h-4 mr-2" />
        Show Leaderboard
      </Button>
    );
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading leaderboard...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <LeaderboardHeader onClose={() => setIsVisible(false)} />
      
      <ScrollArea className="h-[300px] rounded-md">
        {leaderboard && leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <LeaderboardEntry
                key={entry.id}
                entry={entry}
                index={index}
                isCurrentUser={entry.id === currentUserId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-white/70">
            No entries yet. Be the first to join!
          </div>
        )}
      </ScrollArea>
    </div>
  );
};