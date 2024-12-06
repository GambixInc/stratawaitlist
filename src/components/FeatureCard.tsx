import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm transition-all duration-300 hover:transform hover:scale-105">
      <Icon className="w-10 h-10 text-primary mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-secondary-muted">{description}</p>
    </div>
  );
};