import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useCart} from "@/context/CartContext";
import {useAuth} from "@/context/AuthContext";
import {ChevronRight, CreditCard, Truck, Lock, Check} from "lucide-react";
import {toast} from "sonner";
import LocationDetector from "@/components/LocationDetector";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Checkout() {
    const {items, totalPrice, totalItems, clearCart} = useCart();
    const {user} = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState<"shipping" | "payment">("shipping");
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
    });

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("payment");
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to continue");
                return;
            }

            const res = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    shippingInfo,
                    items: items.map(({product, quantity}) => ({
                        productId: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        quantity,
                    })),
                }),
            });

            if (!res.ok) {
                throw new Error("Order creation failed");
            }

            const data = await res.json();

            clearCart();
            toast.success("Order placed successfully!");
            navigate(`/order-confirmation?id=${data.orderId}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header/>
                <main className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
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
                    <Link to="/cart" className="hover:text-primary">Cart</Link>
                    <ChevronRight className="w-4 h-4"/>
                    <span className="text-foreground">Checkout</span>
                </nav>

                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {/* Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 ${step === "shipping" ? "text-primary" : "text-success"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step === "shipping" ? "bg-primary text-primary-foreground" : "bg-success text-success-foreground"
                        }`}>
                            {step === "payment" ? <Check className="w-4 h-4"/> : "1"}
                        </div>
                        <span>Shipping</span>
                    </div>
                    <div className="w-16 h-0.5 bg-border"/>
                    <div
                        className={`flex items-center gap-2 ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step === "payment" ? "bg-primary text-primary-foreground" : "bg-secondary"
                        }`}>
                            2
                        </div>
                        <span>Payment</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {step === "shipping" ? (
                            <form onSubmit={handleShippingSubmit} className="bg-card p-6 rounded-lg border">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-primary"/>
                                        <h2 className="text-xl font-bold">Shipping Information</h2>
                                    </div>
                                    <LocationDetector
                                        onLocationDetected={(loc) =>
                                            setShippingInfo((prev) => ({
                                                ...prev,
                                                address: loc.address,
                                                city: loc.city,
                                                state: loc.state,
                                                zipCode: loc.zipCode,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {Object.entries(shippingInfo).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <Label>{key}</Label>
                                            <Input
                                                value={value}
                                                onChange={(e) =>
                                                    setShippingInfo((prev) => ({...prev, [key]: e.target.value}))
                                                }
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>

                                <Button type="submit" className="w-full mt-6">
                                    Continue to Payment
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handlePaymentSubmit} className="bg-card p-6 rounded-lg border">
                                <div className="flex items-center gap-2 mb-6">
                                    <CreditCard className="w-5 h-5 text-primary"/>
                                    <h2 className="text-xl font-bold">Payment Information</h2>
                                </div>

                                <div className="space-y-4">
                                    <Input placeholder="Name on Card" required/>
                                    <Input placeholder="Card Number" required/>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="MM/YY" required/>
                                        <Input placeholder="CVV" type="password" required/>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm mt-4 text-muted-foreground">
                                    <Lock className="w-4 h-4"/>
                                    Payment is secure
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <Button variant="outline" onClick={() => setStep("shipping")}>
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={isProcessing}>
                                        {isProcessing ? "Processing..." : `Pay ₹${(totalPrice * 1.08).toFixed(2)}`}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-card p-6 rounded-lg border">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        {items.map(({product, quantity}) => (
                            <div key={product.id} className="flex justify-between text-sm mb-2">
                                <span>{product.name} × {quantity}</span>
                                <span>₹{(product.price * quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <hr className="my-3"/>
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹{(totalPrice * 1.08).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
}
