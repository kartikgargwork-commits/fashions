import {Link} from 'react-router-dom';
import {Category} from '@/types/product';

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({category}: CategoryCardProps) {
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');

    return (
        <Link to={`/category/${categorySlug}`} className="group cursor-pointer block">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30">
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent"/>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm opacity-80">{category.productCount.toLocaleString()} products</p>
                </div>
            </div>
        </Link>
    );
}