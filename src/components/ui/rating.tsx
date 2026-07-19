'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  onValueChange?: (value: number) => void;
  max?: number;
  size?: number;
  readonly?: boolean;
}

export function Rating({
  value = 0,
  onValueChange,
  max = 5,
  size = 24,
  readonly = false,
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const handleStarClick = (starValue: number) => {
    if (!readonly && onValueChange) {
      onValueChange(starValue);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((starValue) => {
        const isFilled = (hoverValue !== null ? hoverValue : value) >= starValue;
        return (
          <Star
            key={starValue}
            size={size}
            className={cn(
              'cursor-pointer transition-all',
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
              !readonly && 'hover:fill-yellow-300 hover:text-yellow-300'
            )}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => !readonly && setHoverValue(starValue)}
            onMouseLeave={() => !readonly && setHoverValue(null)}
          />
        );
      })}
    </div>
  );
}
