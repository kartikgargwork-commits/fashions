import {Link} from "react-router-dom";
import {Header} from "@/components/Header";
import {HeroBanner} from "@/components/HeroBanner";
import {ProductCard} from "@/components/ProductCard";
import {CategoryCard} from "@/components/CategoryCard";
import {CartSidebar} from "@/components/CartSidebar";
import {Footer} from "@/components/Footer";
import {products, categories, dealProducts} from "@/data/products";
import {Zap, Truck, Shield, RotateCcw} from "lucide-react";

const features = [
    {icon: Truck, title: "Free Shipping", desc: "On orders over $35"},
    {icon: Shield, title: "Secure Payment", desc: "100% secure checkout"},
    {icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy"},
    {icon: Zap, title: "Fast Delivery", desc: "Same day delivery"},
];

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <CartSidebar/>

            <main>
                {/* Hero Banner */}
                <HeroBanner/>

                {/* Features Bar */}
                <section className="py-6 bg-card border-y border-border">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {features.map(({icon: Icon, title, desc}) => (
                                <div
                                    key={title}
                                    className="flex items-center gap-3 justify-center"
                                >
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Icon className="w-5 h-5 text-primary"/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">
                                            {title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Today's Deals */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                Today's Deals
                            </h2>
                            <Link
                                to="/category/all"
                                className="text-prime hover:underline text-sm font-medium"
                            >
                                See all deals
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {dealProducts.slice(0, 4).map((product, i) => (
                                <div
                                    key={product.id}
                                    className="animate-slide-up"
                                    style={{animationDelay: `${i * 100}ms`}}
                                >
                                    <ProductCard product={product}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-12 bg-secondary/30">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                Shop by Category
                            </h2>
                            <Link
                                to="/category/all"
                                className="text-prime hover:underline text-sm font-medium"
                            >
                                See all categories
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map((category, i) => (
                                <div
                                    key={category.id}
                                    className="animate-slide-up"
                                    style={{animationDelay: `${i * 50}ms`}}
                                >
                                    <CategoryCard category={category}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* All Products */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                Popular Products
                            </h2>
                            <Link
                                to="/category/all"
                                className="text-prime hover:underline text-sm font-medium"
                            >
                                See all products
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {products.map((product, i) => (
                                <div
                                    key={product.id}
                                    className="animate-slide-up"
                                    style={{animationDelay: `${i * 50}ms`}}
                                >
                                    <ProductCard product={product}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Promotional Banner */}
                <section className="py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
                    <div className="container mx-auto px-4">
                        <div
                            className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                                    Sign up for exclusive deals
                                </h2>
                                <p className="text-muted-foreground">
                                    Get special offers, free giveaways, and once-in-a-lifetime
                                    deals.
                                </p>
                            </div>
                            <Link to="/auth">
                                <button
                                    className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
                                    Join Now — It's Free
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer/>
        </div>
    );
};

export default Index;
