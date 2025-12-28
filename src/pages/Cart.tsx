import {Link, useNavigate} from 'react-router-dom';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {Button} from '@/components/ui/button';
import {useCart} from '@/context/CartContext';
import {Trash2, Minus, Plus, ShoppingBag, ChevronRight} from 'lucide-react';

export default function Cart() {
    const {items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart} = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header/>
                <main className="container mx-auto px-4 py-20 text-center">
                    <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6"/>
                    <h1 className="text-2xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
                    <Link to="/">
                        <Button>Continue Shopping</Button>
                    </Link>
                </main>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header/>

            <main className="container mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <ChevronRight className="w-4 h-4"/>
                    <span className="text-foreground">Shopping Cart</span>
                </nav>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Shopping Cart
                    ({totalItems} items)</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map(({product, quantity}) => (
                            <div key={product.id} className="flex gap-4 bg-card p-4 rounded-lg border border-border">
                                <Link to={`/product/${product.id}`} className="shrink-0">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                                    />
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="font-medium text-foreground hover:text-primary line-clamp-2">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <p className="text-sm text-muted-foreground mt-1">{product.category}</p>

                                    {product.inStock ? (
                                        <p className="text-sm text-success mt-1">In Stock</p>
                                    ) : (
                                        <p className="text-sm text-destructive mt-1">Out of Stock</p>
                                    )}

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center border border-border rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                                className="p-2 hover:bg-secondary transition-colors"
                                            >
                                                <Minus className="w-4 h-4"/>
                                            </button>
                                            <span className="px-4 py-2 font-medium">{quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                                className="p-2 hover:bg-secondary transition-colors"
                                            >
                                                <Plus className="w-4 h-4"/>
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(product.id)}
                                            className="text-destructive hover:text-destructive/80"
                                        >
                                            <Trash2 className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-bold text-foreground">
                                        ${(product.price * quantity).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        ${product.price.toFixed(2)} each
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={clearCart}>
                                Clear Cart
                            </Button>
                            <Link to="/">
                                <Button variant="ghost">Continue Shopping</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card p-6 rounded-lg border border-border sticky top-24">
                            <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-success font-medium">FREE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax (estimated)</span>
                                    <span className="font-medium">${(totalPrice * 0.08).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-border my-4"/>

                            <div className="flex justify-between text-lg font-bold mb-6">
                                <span>Total</span>
                                <span>${(totalPrice * 1.08).toFixed(2)}</span>
                            </div>

                            <Button className="w-full" onClick={() => navigate('/checkout')}>
                                Proceed to Checkout
                            </Button>

                            <p className="text-xs text-muted-foreground text-center mt-4">
                                Secure checkout powered by industry-leading encryption
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
}
