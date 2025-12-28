import {Link} from 'react-router-dom';
import {Product} from '@/types/product';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {StarRating} from '@/components/StarRating';
import {useCart} from '@/context/CartContext';
import {ShoppingCart, Check} from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({product}: ProductCardProps) {
    const {addToCart} = useCart();

    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <div
            className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in">
            {/* Image Container */}
            <Link to={`/product/${product.id}`}
                  className="block relative aspect-square overflow-hidden bg-secondary/30">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                    <Badge
                        variant={product.badge.includes('Deal') ? 'deal' : 'default'}
                        className="absolute top-3 left-3"
                    >
                        {product.badge}
                    </Badge>
                )}
                {/* Quick Add Button */}
                <Button
                    variant="cart"
                    size="icon"
                    className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                    }}
                >
                    <ShoppingCart className="w-4 h-4"/>
                </Button>
            </Link>

            {/* Content */}
            <div className="p-4 space-y-2">
                <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <StarRating rating={product.rating} reviewCount={product.reviewCount}/>

                <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
                    {product.originalPrice && (
                        <>
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
                            <Badge variant="deal" className="text-xs">
                                {discount}% off
                            </Badge>
                        </>
                    )}
                </div>

                {product.isPrime && (
                    <div className="flex items-center gap-1 text-prime text-sm font-medium">
                        <Check className="w-4 h-4"/>
                        <span>Prime</span>
                        <span className="text-muted-foreground">FREE Delivery</span>
                    </div>
                )}

                {product.inStock ? (
                    <p className="text-sm text-success font-medium">In Stock</p>
                ) : (
                    <p className="text-sm text-destructive font-medium">Out of Stock</p>
                )}

                <Button
                    className="w-full mt-2"
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                >
                    Add to Cart
                </Button>
            </div>
        </div>
    );
}