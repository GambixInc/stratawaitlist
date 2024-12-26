import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { LeaderboardEntry } from "./LeaderboardEntry";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
        (payload) => {
          console.log('Realtime update:', payload);
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("waitlist")
          .select("id, first_name, last_name, referral_count, created_at, tier_level, points")
          .order("points", { ascending: false })
          .limit(10);

        if (error) throw error;
        return data as LeaderboardEntryType[];
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load leaderboard data. Please try again.",
          className: "bg-black text-white border border-brand/20",
        });
        throw error;
      }
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

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Failed to load leaderboard. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <LeaderboardHeader onClose={() => setIsVisible(false)} />
      
      <ScrollArea className="h-[300px] rounded-md">
        <div className="space-y-2">
          {leaderboard?.map((entry, index) => (
            <LeaderboardEntry
              key={entry.id}
              entry={entry}
              index={index}
              isCurrentUser={entry.id === currentUserId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};