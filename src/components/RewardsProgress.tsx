import { Progress } from "@/components/ui/progress";
import { Trophy, Gift, Rocket } from "lucide-react";

interface RewardsProgressProps {
  referralCount: number;
}

export const RewardsProgress = ({ referralCount }: RewardsProgressProps) => {
  const tiers = [
    { count: 5, label: "Early Access", icon: Rocket },
    { count: 10, label: "Exclusive Merch", icon: Gift },
    { count: 25, label: "VIP Status", icon: Trophy },
  ];

  const getProgress = (targetCount: number) => {
    return Math.min((referralCount / targetCount) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Rewards Progress</h3>
      <div className="space-y-4">
        {tiers.map(({ count, label, icon: Icon }) => (
          <div key={count} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
              <span className="text-white/70">{referralCount}/{count}</span>
            </div>
            <Progress value={getProgress(count)} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};