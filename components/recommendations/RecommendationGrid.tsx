'use client';

import RecommendationCard from './RecommendationCard';

interface Recommendation {
  id: number;
  food_item: string;
  description: string;
  condition: string;
  benefit: string;
  severity: 'safe' | 'caution' | 'danger';
}

interface RecommendationGridProps {
  items: Recommendation[];
}

export default function RecommendationGrid({ items }: RecommendationGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(rec => (
        <RecommendationCard
          key={rec.id}
          icon={rec.food_item.substring(0, 1) + '🥗'}
          title={rec.food_item}
          description={rec.description}
          condition={rec.condition}
          benefit={rec.benefit}
          severity={rec.severity}
        />
      ))}
    </div>
  );
}
