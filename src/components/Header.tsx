import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Search,
    ShoppingCart,
    Menu,
    MapPin,
    ChevronDown,
    User,
    LogOut,
    Package,
    Shield,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {useCart} from "@/context/CartContext";
import {useAuth} from "@/context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
    {label: "Today's Deals", href: "/category/all"},
    {label: "Electronics", href: "/category/electronics"},
    {label: "Fashion", href: "/category/fashion"},
    {label: "Home & Kitchen", href: "/category/home-&-kitchen"},
    {label: "Books", href: "/category/books"},
];

export function Header() {
    const {totalItems, setIsCartOpen} = useCart();
    const {user, isAdmin, signOut} = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50">
            {/* Main Header */}
            <div className="bg-header text-header-foreground">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-1 shrink-0">
                            <span className="text-2xl font-bold text-primary">Shop</span>
                            <span className="text-2xl font-bold">Hub</span>
                        </Link>

                        {/* Deliver to */}
                        <button
                            className="hidden lg:flex items-center gap-1 text-sm hover:outline hover:outline-1 hover:outline-header-foreground/50 rounded p-1">
                            <MapPin className="w-5 h-5"/>
                            <div className="text-left">
                <span className="text-xs text-muted-foreground">
                  Deliver to
                </span>
                                <p className="font-bold text-header-foreground">
                                    New York 10001
                                </p>
                            </div>
                        </button>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
                            <div className="flex">
                                <select
                                    className="hidden sm:block h-10 px-3 bg-secondary text-secondary-foreground text-sm rounded-l-md border-r border-border focus:outline-none">
                                    <option>All</option>
                                    <option>Electronics</option>
                                    <option>Fashion</option>
                                    <option>Home</option>
                                    <option>Books</option>
                                </select>
                                <Input
                                    type="search"
                                    placeholder="Search products, brands and more..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="
    flex-1 h-10 rounded-none sm:rounded-l-none
    bg-white
    text-black
    caret-black
    placeholder:text-gray-400
    border-0
    focus-visible:ring-0 focus-visible:ring-offset-0
  "
                                />


                                <Button type="submit" className="h-10 rounded-l-none px-4">
                                    <Search className="w-5 h-5"/>
                                </Button>
                            </div>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Account */}
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className="hidden md:flex flex-col items-start text-sm hover:outline hover:outline-1 hover:outline-header-foreground/50 rounded p-1">
                      <span className="text-xs">
                        Hello, {user.email?.split("@")[0]}
                      </span>
                                            <span className="font-bold flex items-center gap-1">
                        Account <ChevronDown className="w-3 h-3"/>
                      </span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={() => navigate("/my-orders")}>
                                            <Package className="w-4 h-4 mr-2"/>
                                            My Orders
                                        </DropdownMenuItem>
                                        {isAdmin && (
                                            <>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem onClick={() => navigate("/admin")}>
                                                    <Shield className="w-4 h-4 mr-2"/>
                                                    Admin Portal
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem onClick={handleSignOut}>
                                            <LogOut className="w-4 h-4 mr-2"/>
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="hidden md:flex flex-col items-start text-sm hover:outline hover:outline-1 hover:outline-header-foreground/50 rounded p-1"
                                >
                                    <span className="text-xs">Hello, sign in</span>
                                    <span className="font-bold flex items-center gap-1">
                    Account <ChevronDown className="w-3 h-3"/>
                  </span>
                                </Link>
                            )}

                            {/* Orders */}
                            <Link
                                to={user ? "/my-orders" : "/auth"}
                                className="hidden md:flex flex-col items-start text-sm hover:outline hover:outline-1 hover:outline-header-foreground/50 rounded p-1"
                            >
                                <span className="text-xs">Returns</span>
                                <span className="font-bold">& Orders</span>
                            </Link>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative flex items-center gap-1 hover:outline hover:outline-1 hover:outline-header-foreground/50 rounded p-1"
                            >
                                <div className="relative">
                                    <ShoppingCart className="w-8 h-8"/>
                                    {totalItems > 0 && (
                                        <Badge variant="cart" className="absolute -top-2 -right-2">
                                            {totalItems}
                                        </Badge>
                                    )}
                                </div>
                                <span className="hidden sm:block font-bold text-sm">Cart</span>
                            </Link>

                            {/* Mobile Menu */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden text-header-foreground"
                            >
                                <Menu className="w-6 h-6"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub Navigation */}
            <div className="bg-header/95 text-header-foreground border-t border-header-foreground/10">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-1 h-10 overflow-x-auto scrollbar-hide">
                        <Link
                            to="/category/all"
                            className="flex items-center gap-1 px-2 py-1 text-sm font-bold hover:outline hover:outline-1 hover:outline-header-foreground/50 rounded whitespace-nowrap"
                        >
                            <Menu className="w-5 h-5"/>
                            All
                        </Link>
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="px-2 py-1 text-sm hover:outline hover:outline-1 hover:outline-header-foreground/50 rounded whitespace-nowrap"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}
