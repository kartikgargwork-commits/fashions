import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {useAuth} from '@/context/AuthContext';
import {toast} from 'sonner';
import {products} from '@/data/products';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    LogOut,
    Search,
    Menu,
    X,
    Eye,
    Plus,
    Edit,
    Trash2,
} from 'lucide-react';

export default function AdminProducts() {
    const {user, isAdmin, isLoading: authLoading, signOut} = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const handleDelete = (productId: string) => {
        toast.success('Product deleted (demo)');
    };

    if (authLoading || !user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-header text-header-foreground transform transition-transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16'
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-header-foreground/10">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary">Shop</span>
                            {sidebarOpen && <span className="text-xl font-bold">Hub Admin</span>}
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        <Link
                            to="/admin"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-header-foreground/10 transition-colors"
                        >
                            <LayoutDashboard className="w-5 h-5"/>
                            {sidebarOpen && <span>Dashboard</span>}
                        </Link>
                        <Link
                            to="/admin/orders"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-header-foreground/10 transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5"/>
                            {sidebarOpen && <span>Orders</span>}
                        </Link>
                        <Link
                            to="/admin/products"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary"
                        >
                            <Package className="w-5 h-5"/>
                            {sidebarOpen && <span>Products</span>}
                        </Link>
                        <Link
                            to="/admin/users"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-header-foreground/10 transition-colors"
                        >
                            <Users className="w-5 h-5"/>
                            {sidebarOpen && <span>Users</span>}
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-header-foreground/10">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-header-foreground/10 transition-colors text-left"
                        >
                            <LogOut className="w-5 h-5"/>
                            {sidebarOpen && <span>Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <header className="sticky top-0 z-40 bg-background border-b border-border">
                    <div className="flex items-center justify-between px-6 h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg hover:bg-secondary"
                            >
                                {sidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                            </button>
                            <h1 className="text-xl font-bold">Products</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => toast.success('Add product modal (demo)')}>
                                <Plus className="w-4 h-4 mr-2"/>
                                Add Product
                            </Button>
                            <Link to="/">
                                <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2"/>
                                    View Store
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-card rounded-xl border border-border overflow-hidden group"
                            >
                                <div className="aspect-square relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {product.badge && (
                                        <Badge variant="deal" className="absolute top-2 left-2">
                                            {product.badge}
                                        </Badge>
                                    )}
                                    <div
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => toast.success('Edit product (demo)')}
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-lg font-bold text-primary">${product.price}</span>
                                        <Badge variant={product.inStock ? 'success' : 'destructive'}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
