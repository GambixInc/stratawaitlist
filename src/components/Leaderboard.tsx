import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Trophy, Crown, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";

export type LeaderboardEntry = {
  id: string;
  full_name: string;
  referral_count: number;
  created_at: string;
  tier_level: number;
  points: number;
};

export const Leaderboard = ({ currentUserId }: { currentUserId?: string }) => {
  const [isVisible, setIsVisible] = useState(true);
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitlist'
        },
        () => {
          // Invalidate and refetch when data changes
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waitlist")
        .select("id, full_name, referral_count, created_at, tier_level, points")
        .order("points", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as LeaderboardEntry[];
    },
  });

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white"
      >
        <Trophy className="w-4 h-4 mr-2 text-[#e57c73]" />
        Show Leaderboard
      </Button>
    );
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading leaderboard...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[#e57c73]" />
          <h3 className="text-xl font-semibold">Top Gambixers</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[300px] rounded-md">
        <div className="space-y-2">
          {leaderboard?.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                entry.id === currentUserId
                  ? "bg-[#e57c73]/20 border border-[#e57c73]/30"
                  : "bg-white/5 hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium w-6">
                  {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.full_name}</span>
                  {index < 3 && (
                    <Crown className={cn("w-4 h-4 text-[#e57c73]")} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-white/10 px-2 py-1 rounded">
                  {entry.points} points
                </span>
                <span className="text-sm bg-white/10 px-2 py-1 rounded">
                  {entry.referral_count} refs
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};