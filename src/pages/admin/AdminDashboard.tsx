import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useAuth} from "@/context/AuthContext";
import {toast} from "sonner";
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    TrendingUp,
    DollarSign,
    Eye,
    LogOut,
    Search,
    ChevronDown,
    Menu,
    X,
} from "lucide-react";
import {Input} from "@/components/ui/input";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ---------------- TYPES ---------------- */

interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    pendingOrders: number;
}

interface Order {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    shippingCity: string;
}

/* ---------------- COMPONENT ---------------- */

export default function AdminDashboard() {
    const {user, isAdmin, isLoading: authLoading, signOut} = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        pendingOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const token = localStorage.getItem("token");

    /* ---------------- AUTH GUARD ---------------- */

    useEffect(() => {
        if (!authLoading) {
            if (!user) navigate("/auth");
            else if (!isAdmin) {
                toast.error("Admin access required");
                navigate("/");
            }
        }
    }, [user, isAdmin, authLoading, navigate]);

    /* ---------------- DATA FETCH ---------------- */

    useEffect(() => {
        if (isAdmin) fetchDashboard();
    }, [isAdmin]);

    const fetchDashboard = async () => {
        try {
            const [statsRes, ordersRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/dashboard`, {
                    headers: {Authorization: `Bearer ${token}`},
                }),
                fetch(`${API_URL}/api/admin/orders?limit=10`, {
                    headers: {Authorization: `Bearer ${token}`},
                }),
            ]);

            if (!statsRes.ok || !ordersRes.ok) {
                throw new Error("Failed to load dashboard");
            }

            setStats(await statsRes.json());
            setRecentOrders(await ordersRes.json());
        } catch (e) {
            toast.error("Failed to load admin dashboard");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- ACTIONS ---------------- */

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch(
                `${API_URL}/api/admin/orders/${orderId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({status}),
                }
            );

            if (!res.ok) throw new Error();
            toast.success("Order status updated");
            fetchDashboard();
        } catch {
            toast.error("Failed to update order");
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return "success";
            case "SHIPPED":
            case "IN_TRANSIT":
                return "default";
            case "PENDING":
                return "secondary";
            case "CANCELLED":
                return "destructive";
            default:
                return "secondary";
        }
    };

    if (authLoading || !user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
            </div>
        );
    }

    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen bg-background flex">
            {/* SIDEBAR */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-header transform transition-transform ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
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
                        <Link to="/admin"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                            <LayoutDashboard className="w-5 h-5"/>
                            {sidebarOpen && <span>Dashboard</span>}
                        </Link>
                        <Link to="/admin/orders"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary">
                            <ShoppingCart className="w-5 h-5"/>
                            {sidebarOpen && <span>Orders</span>}
                        </Link>
                        <Link to="/admin/products"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary">
                            <Package className="w-5 h-5"/>
                            {sidebarOpen && <span>Products</span>}
                        </Link>
                        <Link to="/admin/users"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary">
                            <Users className="w-5 h-5"/>
                            {sidebarOpen && <span>Users</span>}
                        </Link>
                    </nav>

                    <div className="p-4 border-t">
                        <button onClick={handleSignOut}
                                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-secondary">
                            <LogOut className="w-5 h-5"/>
                            {sidebarOpen && <span>Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1">
                <header className="sticky top-0 bg-background border-b">
                    <div className="flex items-center justify-between px-6 h-16">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                            {sidebarOpen ? <X/> : <Menu/>}
                        </button>
                        <Link to="/">
                            <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2"/>
                                View Store
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="p-6">
                    {/* STATS */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard title="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={<DollarSign/>}/>
                        <StatCard title="Orders" value={stats.totalOrders} icon={<ShoppingCart/>}/>
                        <StatCard title="Users" value={stats.totalUsers} icon={<Users/>}/>
                        <StatCard title="Pending" value={stats.pendingOrders} icon={<Package/>}/>
                    </div>

                    {/* ORDERS */}
                    <div className="bg-card rounded-xl border">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-bold">Recent Orders</h2>
                        </div>
                        <table className="w-full">
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td className="p-6 text-center">Loading...</td>
                                </tr>
                            ) : (
                                recentOrders.map(o => (
                                    <tr key={o.id} className="border-b">
                                        <td className="p-4">#{o.id.slice(0, 8)}</td>
                                        <td className="p-4">{o.shippingCity}</td>
                                        <td className="p-4">${o.totalAmount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <Badge variant={getStatusColor(o.status) as any}>{o.status}</Badge>
                                        </td>
                                        <td className="p-4">{formatDate(o.createdAt)}</td>
                                        <td className="p-4">
                                            <select
                                                value={o.status}
                                                onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                className="bg-secondary rounded px-2 py-1"
                                            >
                                                <option>PENDING</option>
                                                <option>CONFIRMED</option>
                                                <option>SHIPPED</option>
                                                <option>IN_TRANSIT</option>
                                                <option>DELIVERED</option>
                                                <option>CANCELLED</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ---------------- SMALL COMPONENT ---------------- */

function StatCard({title, value, icon}: any) {
    return (
        <div className="bg-card p-6 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-primary/10 rounded">{icon}</div>
            </div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}
