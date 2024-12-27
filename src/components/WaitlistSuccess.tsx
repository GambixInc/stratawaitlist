import { useState, useEffect } from "react";
import { CountdownTimer } from "./CountdownTimer";
import { RewardsProgress } from "./RewardsProgress";
import { supabase } from "@/lib/supabase";
import { ReferralSection } from "./waitlist/ReferralSection";

interface WaitlistSuccessProps {
  userId: string;
}

export const WaitlistSuccess = ({ userId }: WaitlistSuccessProps) => {
  const [referralLink] = useState(`${window.location.origin}/?ref=${userId}`);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    const fetchReferralCount = async () => {
      const { data, error } = await supabase
        .from("waitlist")
        .select("referral_count, email, first_name, last_name")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching referral count:", error);
        return;
      }

      setReferralCount(data.referral_count || 0);
      if (data.email) {
        localStorage.setItem('waitlist_email', data.email);
        localStorage.setItem('waitlist_id', userId);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('last_name', data.last_name);
      }
    };

    fetchReferralCount();
  }, [userId]);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-6">
        <CountdownTimer />
        
        {referralLink && (
          <div className="space-y-4">
            <ReferralSection 
              referralLink={referralLink}
              onShare={() => {}}
            />
          </div>
        )}

        <RewardsProgress referralCount={referralCount} />
      </div>
    </div>
  );
};