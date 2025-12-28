import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {CartProvider} from "@/context/CartContext";
import {AuthProvider} from "@/context/AuthContext";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Category from "./pages/Category";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import MyOrders from "./pages/MyOrders";
import TrackOrder from "./pages/TrackOrder";
import Stores from "./pages/Stores";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <CartProvider>
                <TooltipProvider>
                    <Toaster/>
                    <Sonner/>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Index/>}/>
                            <Route path="/product/:id" element={<ProductDetail/>}/>
                            <Route path="/cart" element={<Cart/>}/>
                            <Route path="/checkout" element={<Checkout/>}/>
                            <Route path="/order-confirmation" element={<OrderConfirmation/>}/>
                            <Route path="/category/:category" element={<Category/>}/>
                            <Route path="/category" element={<Category/>}/>
                            <Route path="/search" element={<Search/>}/>
                            <Route path="/auth" element={<Auth/>}/>
                            <Route path="/my-orders" element={<MyOrders/>}/>
                            <Route path="/track-order" element={<TrackOrder/>}/>
                            <Route path="/stores" element={<Stores/>}/>
                            <Route path="/admin" element={<AdminDashboard/>}/>
                            <Route path="/admin/orders" element={<AdminOrders/>}/>
                            <Route path="/admin/products" element={<AdminProducts/>}/>
                            <Route path="/admin/users" element={<AdminUsers/>}/>
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </CartProvider>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;