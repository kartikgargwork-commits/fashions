import {useParams, Link} from 'react-router-dom';
import {Header} from '@/components/Header';
import {CartSidebar} from '@/components/CartSidebar';
import {Footer} from '@/components/Footer';
import {ProductCard} from '@/components/ProductCard';
import {products, categories} from '@/data/products';
import {ChevronRight, SlidersHorizontal} from 'lucide-react';
import {useState} from 'react';
import {Button} from '@/components/ui/button';

export default function Category() {
    const {category} = useParams();
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState<string>('all');

    const categoryName = category?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'All Products';

    let filteredProducts = category
        ? products.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase())
        : products;

    // Apply price filter
    if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => p.price >= min && (max ? p.price <= max : true));
    }

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
        case 'reviews':
            filteredProducts = [...filteredProducts].sort((a, b) => b.reviewCount - a.reviewCount);
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
                    <span className="text-foreground">{categoryName}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="bg-card p-4 rounded-lg border border-border sticky top-24">
                            <div className="flex items-center gap-2 mb-4">
                                <SlidersHorizontal className="w-5 h-5"/>
                                <h2 className="font-bold text-foreground">Filters</h2>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="font-medium text-foreground mb-3">Categories</h3>
                                <div className="space-y-2">
                                    <Link
                                        to="/category/all"
                                        className={`block text-sm hover:text-primary ${!category ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                                    >
                                        All Products
                                    </Link>
                                    {categories.map(cat => (
                                        <Link
                                            key={cat.id}
                                            to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className={`block text-sm hover:text-primary ${category === cat.name.toLowerCase().replace(/\s+/g, '-') ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                                        >
                                            {cat.name} ({cat.productCount})
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="font-medium text-foreground mb-3">Price Range</h3>
                                <div className="space-y-2">
                                    {[
                                        {label: 'All Prices', value: 'all'},
                                        {label: 'Under $100', value: '0-100'},
                                        {label: '$100 - $500', value: '100-500'},
                                        {label: '$500 - $1000', value: '500-1000'},
                                        {label: 'Over $1000', value: '1000-'},
                                    ].map(range => (
                                        <button
                                            key={range.value}
                                            onClick={() => setPriceRange(range.value)}
                                            className={`block text-sm w-full text-left hover:text-primary ${priceRange === range.value ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" onClick={() => {
                                setPriceRange('all');
                                setSortBy('featured');
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{categoryName}</h1>
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
                                    <option value="reviews">Most Reviews</option>
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {filteredProducts.map((product, i) => (
                                    <div key={product.id} className="animate-slide-up"
                                         style={{animationDelay: `${i * 50}ms`}}>
                                        <ProductCard product={product}/>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No products found matching your criteria.</p>
                                <Button variant="outline" className="mt-4" onClick={() => {
                                    setPriceRange('all');
                                    setSortBy('featured');
                                }}>
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
}
