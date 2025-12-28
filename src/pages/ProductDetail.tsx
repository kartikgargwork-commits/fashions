import {useParams, Link, useNavigate} from 'react-router-dom';
import {Header} from '@/components/Header';
import {CartSidebar} from '@/components/CartSidebar';
import {Footer} from '@/components/Footer';
import {StarRating} from '@/components/StarRating';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {products} from '@/data/products';
import {useCart} from '@/context/CartContext';
import {ShoppingCart, Heart, Share2, Check, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus} from 'lucide-react';
import {useState} from 'react';
import {ProductCard} from '@/components/ProductCard';

export default function ProductDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {addToCart} = useCart();
    const [quantity, setQuantity] = useState(1);

    const product = products.find(p => p.id === id);

    if (!product) {
        return (
            <div className="min-h-screen bg-background">
                <Header/>
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <Link to="/" className="text-primary hover:underline">Return to Home</Link>
                </div>
                <Footer/>
            </div>
        );
    }

    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const handleBuyNow = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        navigate('/checkout');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <CartSidebar/>

            <main className="container mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <ChevronRight className="w-4 h-4"/>
                    <Link to={`/category/${product.category.toLowerCase()}`}
                          className="hover:text-primary">{product.category}</Link>
                    <ChevronRight className="w-4 h-4"/>
                    <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
                </nav>

                {/* Product Details */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-card rounded-lg overflow-hidden border border-border">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <button key={i}
                                        className="w-20 h-20 rounded-lg border-2 border-border hover:border-primary overflow-hidden">
                                    <img src={product.image} alt="" className="w-full h-full object-cover"/>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-6">
                        {product.badge && (
                            <Badge variant={product.badge.includes('Deal') ? 'deal' : 'default'}>
                                {product.badge}
                            </Badge>
                        )}

                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.name}</h1>

                        <div className="flex items-center gap-4">
                            <StarRating rating={product.rating} reviewCount={product.reviewCount}/>
                            <span className="text-primary text-sm hover:underline cursor-pointer">
                {product.reviewCount.toLocaleString()} ratings
              </span>
                        </div>

                        <div className="border-t border-b border-border py-4">
                            <div className="flex items-baseline gap-3 flex-wrap">
                                {product.originalPrice && (
                                    <span className="text-sm text-muted-foreground">
                    <span className="line-through">${product.originalPrice.toFixed(2)}</span>
                  </span>
                                )}
                                <span className="text-3xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                                {discount > 0 && (
                                    <Badge variant="deal" className="text-sm">
                                        {discount}% off
                                    </Badge>
                                )}
                            </div>

                            {product.isPrime && (
                                <div className="flex items-center gap-2 text-prime text-sm font-medium mt-2">
                                    <Check className="w-4 h-4"/>
                                    <span>Prime</span>
                                    <span className="text-muted-foreground">FREE Delivery Tomorrow</span>
                                </div>
                            )}
                        </div>

                        <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Quantity:</span>
                            <div className="flex items-center border border-border rounded-lg">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="p-2 hover:bg-secondary transition-colors"
                                >
                                    <Minus className="w-4 h-4"/>
                                </button>
                                <span className="px-4 py-2 font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="p-2 hover:bg-secondary transition-colors"
                                >
                                    <Plus className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                className="flex-1"
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2"/>
                                Add to Cart
                            </Button>
                            <Button
                                variant="hero"
                                className="flex-1"
                                onClick={handleBuyNow}
                                disabled={!product.inStock}
                            >
                                Buy Now
                            </Button>
                        </div>

                        <div className="flex gap-4">
                            <button
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                                <Heart className="w-4 h-4"/>
                                Add to Wishlist
                            </button>
                            <button
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                                <Share2 className="w-4 h-4"/>
                                Share
                            </button>
                        </div>

                        {/* Stock Status */}
                        {product.inStock ? (
                            <p className="text-success font-medium">In Stock</p>
                        ) : (
                            <p className="text-destructive font-medium">Out of Stock</p>
                        )}

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                            <div className="text-center">
                                <Truck className="w-6 h-6 mx-auto mb-2 text-primary"/>
                                <p className="text-xs text-muted-foreground">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <Shield className="w-6 h-6 mx-auto mb-2 text-primary"/>
                                <p className="text-xs text-muted-foreground">Secure Payment</p>
                            </div>
                            <div className="text-center">
                                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary"/>
                                <p className="text-xs text-muted-foreground">30-Day Returns</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="py-8 border-t border-border">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p}/>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer/>
        </div>
    );
}
