import {useState, useEffect} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import {Button} from "@/components/ui/button";
import {CheckCircle, Package, Truck, Home} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Order {
    id: string;
    trackingNumber: string | null;
    estimatedDelivery: string | null;
    createdAt: string;
    status: string;
}

export default function OrderConfirmation() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("id");
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (orderId) {
            fetchOrder(orderId);
        }
    }, [orderId]);

    const fetchOrder = async (id: string) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/api/orders/${id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch order");
            }

            const data = await res.json();
            setOrder(data);
        } catch (err) {
            console.error("Error fetching order:", err);
        }
    };

    const orderNumber = order?.id
        ? `#${order.id.slice(0, 8).toUpperCase()}`
        : `ORD-${Date.now().toString().slice(-8)}`;

    const estimatedDelivery = order?.estimatedDelivery
        ? new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        })
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
            }
        );

    const getProgressWidth = () => {
        switch (order?.status) {
            case "CONFIRMED":
                return "w-1/4";
            case "PROCESSING":
                return "w-2/4";
            case "SHIPPED":
                return "w-3/4";
            case "DELIVERED":
                return "w-full";
            default:
                return "w-1/4";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header/>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-success"/>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Thank You for Your Order!
                    </h1>

                    <p className="text-lg text-muted-foreground mb-8">
                        Your order has been placed successfully.
                    </p>

                    {/* Order Details */}
                    <div className="bg-card p-6 rounded-lg border mb-8 text-left">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Order Number</p>
                                <p className="text-lg font-bold">{orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Estimated Delivery
                                </p>
                                <p className="text-lg font-bold">{estimatedDelivery}</p>
                            </div>

                            {order?.trackingNumber && (
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-muted-foreground">
                                        Tracking Number
                                    </p>
                                    <p className="text-lg font-bold">
                                        {order.trackingNumber}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="bg-card p-6 rounded-lg border mb-8">
                        <h2 className="text-xl font-bold mb-6">Order Status</h2>

                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-4 left-0 right-0 h-1 bg-border">
                                <div
                                    className={`h-full ${getProgressWidth()} bg-success transition-all`}
                                />
                            </div>

                            <StatusStep
                                active
                                label="Confirmed"
                                icon={<CheckCircle className="w-4 h-4"/>}
                            />
                            <StatusStep
                                active={["PROCESSING", "SHIPPED", "DELIVERED"].includes(
                                    order?.status || ""
                                )}
                                label="Processing"
                                icon={<Package className="w-4 h-4"/>}
                            />
                            <StatusStep
                                active={["SHIPPED", "DELIVERED"].includes(
                                    order?.status || ""
                                )}
                                label="Shipped"
                                icon={<Truck className="w-4 h-4"/>}
                            />
                            <StatusStep
                                active={order?.status === "DELIVERED"}
                                label="Delivered"
                                icon={<Home className="w-4 h-4"/>}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/">
                            <Button>Continue Shopping</Button>
                        </Link>
                        <Link to={orderId ? `/track-order?id=${orderId}` : "/track-order"}>
                            <Button variant="outline">Track Order</Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
}

/* ---------- Helper Component ---------- */

function StatusStep({
                        active,
                        label,
                        icon,
                    }: {
    active: boolean;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="relative flex flex-col items-center z-10">
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    active
                        ? "bg-success text-success-foreground"
                        : "bg-secondary text-muted-foreground"
                }`}
            >
                {icon}
            </div>
            <span className="text-xs mt-2">{label}</span>
        </div>
    );
}
