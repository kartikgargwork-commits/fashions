import {useState, useEffect} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {useAuth} from "@/context/AuthContext";
import {toast} from "sonner";
import DeliveryMap from "@/components/DeliveryMap";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Package,
    Truck,
    MapPin,
    CheckCircle2,
    Clock,
    ChevronRight,
    Search,
    Box,
    XCircle,
    Map,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* -------------------- TYPES -------------------- */

interface TrackingEvent {
    id: string;
    status: string;
    location: string;
    description: string;
    timestamp: string;
}

interface OrderWithItems {
    id: string;
    status: string;
    trackingNumber: string | null;
    estimatedDelivery: string | null;
    createdAt: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZip: string;
    totalAmount: number;
    orderItems: Array<{
        productName: string;
        quantity: number;
        productImage: string | null;
    }>;
    trackingEvents: TrackingEvent[];
}

/* -------------------- HELPERS -------------------- */

const getStatusIcon = (status: string) => {
    switch (status) {
        case "DELIVERED":
            return <CheckCircle2 className="w-5 h-5 text-success"/>;
        case "OUT_FOR_DELIVERY":
            return <Truck className="w-5 h-5 text-primary"/>;
        case "IN_TRANSIT":
            return <Package className="w-5 h-5 text-primary"/>;
        case "SHIPPED":
            return <Box className="w-5 h-5 text-muted-foreground"/>;
        default:
            return <Clock className="w-5 h-5 text-muted-foreground"/>;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "DELIVERED":
            return "success";
        case "SHIPPED":
        case "IN_TRANSIT":
        case "OUT_FOR_DELIVERY":
            return "default";
        case "CANCELLED":
            return "destructive";
        default:
            return "secondary";
    }
};

/* -------------------- COMPONENT -------------------- */

export default function TrackOrder() {
    const {user} = useAuth();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("id");

    const [trackingNumber, setTrackingNumber] = useState("");
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    const token = localStorage.getItem("token");

    /* -------------------- API CALLS -------------------- */

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/api/orders/my`, {
                headers: {Authorization: `Bearer ${token}`},
            });

            if (!res.ok) throw new Error("Failed to load orders");
            setOrders(await res.json());
        } catch {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderById = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            });

            if (!res.ok) throw new Error();
            setSelectedOrder(await res.json());
        } catch {
            toast.error("Order not found");
        }
    };

    const cancelOrder = async (id: string) => {
        setCancelling(true);
        try {
            const res = await fetch(`${API_URL}/api/orders/${id}/cancel`, {
                method: "PUT",
                headers: {Authorization: `Bearer ${token}`},
            });

            if (!res.ok) throw new Error();
            toast.success("Order cancelled");

            fetchOrders();
            fetchOrderById(id);
        } catch {
            toast.error("Failed to cancel order");
        } finally {
            setCancelling(false);
        }
    };

    /* -------------------- EFFECTS -------------------- */

    useEffect(() => {
        if (user) fetchOrders();
        else setLoading(false);
    }, [user]);

    useEffect(() => {
        if (orderId) fetchOrderById(orderId);
    }, [orderId]);

    /* -------------------- UI -------------------- */

    return (
        <div className="min-h-screen bg-background">
            <Header/>

            <main className="container mx-auto px-4 py-8">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <ChevronRight className="w-4 h-4"/>
                    <span className="text-foreground">Track Order</span>
                </nav>

                <h1 className="text-2xl md:text-3xl font-bold mb-8">
                    Track Your Order
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT */}
                    <div className="space-y-6">
                        <div className="bg-card p-6 rounded-lg border">
                            <h2 className="font-semibold mb-4 flex items-center gap-2">
                                <Search className="w-5 h-5"/>
                                Track by Order ID
                            </h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    fetchOrderById(trackingNumber);
                                }}
                                className="space-y-3"
                            >
                                <Input
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="Order ID"
                                />
                                <Button className="w-full">Track</Button>
                            </form>
                        </div>

                        {user && (
                            <div className="bg-card p-6 rounded-lg border">
                                <h2 className="font-semibold mb-4">Your Orders</h2>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    orders.map((o) => (
                                        <button
                                            key={o.id}
                                            onClick={() => setSelectedOrder(o)}
                                            className="w-full p-3 text-left border rounded mb-2"
                                        >
                                            #{o.id.slice(0, 8)}
                                            <Badge className="ml-2" variant={getStatusColor(o.status) as any}>
                                                {o.status}
                                            </Badge>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-2">
                        {selectedOrder ? (
                            <div className="bg-card p-6 rounded-lg border">
                                <h2 className="text-xl font-bold mb-2">
                                    Order #{selectedOrder.id.slice(0, 8)}
                                </h2>

                                <Badge variant={getStatusColor(selectedOrder.status) as any}>
                                    {selectedOrder.status}
                                </Badge>

                                {selectedOrder.status !== "CANCELLED" && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="ml-3"
                                                disabled={cancelling}
                                            >
                                                <XCircle className="w-4 h-4 mr-1"/>
                                                Cancel
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Back</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => cancelOrder(selectedOrder.id)}
                                                >
                                                    Cancel Order
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}

                                <div className="mt-6">
                                    {selectedOrder.trackingEvents.map((e) => (
                                        <div key={e.id} className="flex gap-3 mb-4">
                                            {getStatusIcon(e.status)}
                                            <div>
                                                <p className="font-medium">{e.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {e.location} · {new Date(e.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-card p-12 text-center rounded-lg border">
                                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground"/>
                                <p className="text-muted-foreground">
                                    Enter an order ID to track
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
}
