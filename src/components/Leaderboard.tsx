import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trophy } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { LeaderboardEntry } from "./LeaderboardEntry";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardPlaceholder } from "./LeaderboardPlaceholder";
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

  // Set up real-time subscription
  useEffect(() => {
    console.log('Setting up real-time leaderboard subscription');
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
          console.log('Realtime leaderboard update:', payload);
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up leaderboard subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      console.log('Fetching leaderboard data');
      try {
        const { data, error } = await supabase
          .from("waitlist")
          .select("id, first_name, last_name, referral_count, created_at, tier_level, points")
          .order("points", { ascending: false })
          .limit(10);

        if (error) {
          console.error('Leaderboard fetch error:', error);
          throw error;
        }
        
        console.log('Leaderboard data fetched:', data);
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

  // Calculate how many placeholder rows we need
  const placeholderCount = Math.max(0, 10 - (leaderboard?.length || 0));

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
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <LeaderboardPlaceholder key={`placeholder-${index}`} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};