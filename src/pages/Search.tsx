import {useSearchParams, Link} from 'react-router-dom';
import {Header} from '@/components/Header';
import {CartSidebar} from '@/components/CartSidebar';
import {Footer} from '@/components/Footer';
import {ProductCard} from '@/components/ProductCard';
import {products} from '@/data/products';
import {ChevronRight, SearchX} from 'lucide-react';
import {useState} from 'react';
import {Button} from '@/components/ui/button';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [sortBy, setSortBy] = useState('featured');

    let filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );

    // Apply sorting
    switch (sortBy) {
        case 'price-low':
            filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
            break;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <CartSidebar/>

            <main className="container mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <ChevronRight className="w-4 h-4"/>
                    <span className="text-foreground">Search Results</span>
                </nav>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                            Search Results for "{query}"
                        </h1>
                        <p className="text-muted-foreground">{filteredProducts.length} products found</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Customer Rating</option>
                        </select>
                    </div>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map((product, i) => (
                            <div key={product.id} className="animate-slide-up" style={{animationDelay: `${i * 50}ms`}}>
                                <ProductCard product={product}/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <SearchX className="w-16 h-16 mx-auto text-muted-foreground mb-4"/>
                        <h2 className="text-xl font-bold text-foreground mb-2">No products found</h2>
                        <p className="text-muted-foreground mb-6">
                            We couldn't find any products matching "{query}"
                        </p>
                        <Link to="/">
                            <Button>Browse All Products</Button>
                        </Link>
                    </div>
                )}
            </main>

            <Footer/>
        </div>
    );
}
