import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {useAuth} from '@/context/AuthContext';
import {toast} from 'sonner';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    LogOut,
    Search,
    ChevronDown,
    Menu,
    X,
    Eye,
    Filter,
} from 'lucide-react';

interface Order {
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip: string;
    tracking_number: string | null;
    order_items: Array<{
        product_name: string;
        quantity: number;
        price: number;
    }>;
}

/* ---------------- MOCK DATA ---------------- */
const MOCK_ORDERS: Order[] = [
    {
        id: 'ORD-1001',
        status: 'pending',
        total_amount: 1299,
        created_at: new Date().toISOString(),
        shipping_address: 'Street 12',
        shipping_city: 'Delhi',
        shipping_state: 'DL',
        shipping_zip: '110001',
        tracking_number: null,
        order_items: [
            {product_name: 'Shoes', quantity: 1, price: 1299},
        ],
    },
    {
        id: 'ORD-1002',
        status: 'delivered',
        total_amount: 2499,
        created_at: new Date().toISOString(),
        shipping_address: 'Sector 62',
        shipping_city: 'Noida',
        shipping_state: 'UP',
        shipping_zip: '201301',
        tracking_number: 'TRK123',
        order_items: [
            {product_name: 'Watch', quantity: 1, price: 2499},
        ],
    },
];

export default function AdminOrders() {
    const {user, isAdmin, isLoading: authLoading, signOut} = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    /* ---------------- AUTH GUARD ---------------- */
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate('/auth');
            } else if (!isAdmin) {
                toast.error('Access denied. Admin privileges required.');
                navigate('/');
            }
        }
    }, [user, isAdmin, authLoading, navigate]);

    /* ---------------- LOAD DATA (MOCK) ---------------- */
    useEffect(() => {
        if (isAdmin) {
            setOrders(MOCK_ORDERS);
            setIsLoading(false);
        }
    }, [isAdmin]);

    /* ---------------- FILTER LOGIC ---------------- */
    useEffect(() => {
        let filtered = orders;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(o => o.status === statusFilter);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                o =>
                    o.id.toLowerCase().includes(q) ||
                    o.shipping_city.toLowerCase().includes(q) ||
                    o.shipping_address.toLowerCase().includes(q)
            );
        }

        setFilteredOrders(filtered);
    }, [orders, searchQuery, statusFilter]);

    /* ---------------- UPDATE STATUS (LOCAL ONLY) ---------------- */
    const updateOrderStatus = (orderId: string, newStatus: string) => {
        setOrders(prev =>
            prev.map(o =>
                o.id === orderId ? {...o, status: newStatus} : o
            )
        );
        toast.success(`Order status updated to ${newStatus}`);
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'success';
            case 'shipped':
            case 'in_transit':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
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
                    <div className="p-4 border-b">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary">Shop</span>
                            {sidebarOpen && <span className="text-xl font-bold">Hub Admin</span>}
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        <Link to="/admin" className="nav-link">
                            <LayoutDashboard className="w-5 h-5"/>
                            {sidebarOpen && <span>Dashboard</span>}
                        </Link>
                        <Link to="/admin/orders" className="nav-link active">
                            <ShoppingCart className="w-5 h-5"/>
                            {sidebarOpen && <span>Orders</span>}
                        </Link>
                        <Link to="/admin/products" className="nav-link">
                            <Package className="w-5 h-5"/>
                            {sidebarOpen && <span>Products</span>}
                        </Link>
                        <Link to="/admin/users" className="nav-link">
                            <Users className="w-5 h-5"/>
                            {sidebarOpen && <span>Users</span>}
                        </Link>
                    </nav>

                    <div className="p-4 border-t">
                        <button onClick={handleSignOut} className="nav-link w-full">
                            <LogOut className="w-5 h-5"/>
                            {sidebarOpen && <span>Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6">
                <h1 className="text-xl font-bold mb-4">Orders</h1>

                <div className="flex gap-4 mb-4">
                    <Input
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="border rounded px-3"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="border p-4 rounded mb-3">
                            <div className="flex justify-between">
                                <span>{order.id}</span>
                                <Badge variant={getStatusColor(order.status) as any}>
                                    {order.status}
                                </Badge>
                            </div>
                            <p>{order.shipping_city}, {order.shipping_state}</p>
                            <p>₹{order.total_amount}</p>

                            <select
                                value={order.status}
                                onChange={e => updateOrderStatus(order.id, e.target.value)}
                                className="mt-2 border rounded px-2"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="in_transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}
