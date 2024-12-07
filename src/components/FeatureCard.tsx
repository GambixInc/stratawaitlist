import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white/5 rounded-xl md:rounded-lg p-4 md:p-6 backdrop-blur-sm transition-all duration-300 hover:transform hover:scale-105">
      <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#e57c73] mb-3 md:mb-4" />
      <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm md:text-base text-secondary-muted">{description}</p>
    </div>
  );
};