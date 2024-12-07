import { Brain, BarChart, UserCheck } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const FeaturesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-20">
      <FeatureCard
        icon={Brain}
        title="AI-Powered Content Generation"
        description="Create engaging content automatically with our advanced AI algorithms"
      />
      <FeatureCard
        icon={BarChart}
        title="Real-Time User Analytics"
        description="Track and analyze user behavior with comprehensive real-time insights"
      />
      <FeatureCard
        icon={UserCheck}
        title="Expert UX Recommendations"
        description="Get personalized suggestions to enhance your user experience"
      />
    </div>
  );
};

export default FeaturesGrid;