import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export type LeaderboardEntry = {
  id: string;
  full_name: string;
  referral_count: number;
  created_at: string;
};

export const Leaderboard = ({ currentUserId }: { currentUserId?: string }) => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waitlist")
        .select("id, full_name, referral_count, created_at")
        .order("referral_count", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as LeaderboardEntry[];
    },
  });

  if (isLoading) {
    return <div className="text-center p-4">Loading leaderboard...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-semibold">Top Referrers</h3>
      </div>
      
      <ScrollArea className="h-[300px] rounded-md">
        <div className="space-y-2">
          {leaderboard?.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                entry.id === currentUserId
                  ? "bg-primary/20 border border-primary/30"
                  : "bg-white/5 hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium w-6">
                  {index + 1}
                </span>
                <span className="font-medium">{entry.full_name}</span>
              </div>
              <span className="text-sm bg-white/10 px-2 py-1 rounded">
                {entry.referral_count} referrals
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};