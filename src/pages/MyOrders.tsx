import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useAuth} from "@/context/AuthContext";
import {
    Package,
    ChevronRight,
    Truck,
    Eye,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
    productImage?: string;
}

interface Order {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    orderItems: OrderItem[];
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "delivered":
            return "success";
        case "shipped":
        case "in_transit":
            return "default";
        case "pending":
            return "secondary";
        case "cancelled":
            return "destructive";
        default:
            return "secondary";
    }
};

export default function MyOrders() {
    const {user, isLoading: authLoading} = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/auth");
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`${API_URL}/api/orders/my`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    if (authLoading || !user) return null;

    return (
        <div className="min-h-screen bg-background">
            <Header/>

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <ChevronRight className="w-4 h-4"/>
                    <span className="text-foreground">My Orders</span>
                </nav>

                <h1 className="text-2xl md:text-3xl font-bold mb-8">
                    My Orders
                </h1>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div
                            className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"/>
                        <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-card p-12 rounded-lg border text-center">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4"/>
                        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Start shopping to see your orders here
                        </p>
                        <Link to="/">
                            <Button>Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-card p-6 rounded-lg border"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold">
                                                Order #{order.id.slice(0, 8)}
                                            </h3>
                                            <Badge variant={getStatusColor(order.status) as any}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Total</p>
                                        <p className="text-xl font-bold">
                                            ₹{order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {order.orderItems.slice(0, 3).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2"
                                        >
                                            <div
                                                className="w-10 h-10 bg-secondary rounded flex items-center justify-center">
                                                {item.productImage ? (
                                                    <img
                                                        src={item.productImage}
                                                        alt={item.productName}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                ) : (
                                                    <Package className="w-5 h-5 text-muted-foreground"/>
                                                )}
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-medium line-clamp-1">
                                                    {item.productName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    x{item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Link to={`/track-order?id=${order.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Truck className="w-4 h-4 mr-2"/>
                                            Track Order
                                        </Button>
                                    </Link>
                                    <Link to={`/track-order?id=${order.id}`}>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="w-4 h-4 mr-2"/>
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer/>
        </div>
    );
}
