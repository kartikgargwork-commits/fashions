import {Star, StarHalf} from 'lucide-react';

interface StarRatingProps {
    rating: number;
    reviewCount?: number;
    showCount?: boolean;
    size?: 'sm' | 'md';
}

export function StarRating({rating, reviewCount, showCount = true, size = 'sm'}: StarRatingProps) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {Array.from({length: fullStars}).map((_, i) => (
                    <Star key={`full-${i}`} className={`${starSize} fill-rating text-rating`}/>
                ))}
                {hasHalfStar && <StarHalf className={`${starSize} fill-rating text-rating`}/>}
                {Array.from({length: emptyStars}).map((_, i) => (
                    <Star key={`empty-${i}`} className={`${starSize} text-muted-foreground/30`}/>
                ))}
            </div>
            {showCount && reviewCount && (
                <span className="text-sm text-prime hover:text-primary hover:underline cursor-pointer">
          {reviewCount.toLocaleString()}
        </span>
            )}
        </div>
    );
}
