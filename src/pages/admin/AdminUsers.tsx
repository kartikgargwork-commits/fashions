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
    Menu,
    X,
    Eye,
    Shield,
    User,
} from 'lucide-react';

interface UserRole {
    role: 'admin' | 'moderator' | 'user';
}

interface UserProfile {
    id: string;
    user_id: string;
    full_name: string | null;
    email: string | null;
    created_at: string;
    user_roles: UserRole[];
}

/* ---------------- MOCK USERS ---------------- */
const MOCK_USERS: UserProfile[] = [
    {
        id: '1',
        user_id: 'u1',
        full_name: 'Admin User',
        email: 'admin@shop.com',
        created_at: new Date().toISOString(),
        user_roles: [{role: 'admin'}],
    },
    {
        id: '2',
        user_id: 'u2',
        full_name: 'Normal User',
        email: 'user@shop.com',
        created_at: new Date().toISOString(),
        user_roles: [{role: 'user'}],
    },
    {
        id: '3',
        user_id: 'u3',
        full_name: 'Moderator User',
        email: 'mod@shop.com',
        created_at: new Date().toISOString(),
        user_roles: [{role: 'moderator'}],
    },
];

export default function AdminUsers() {
    const {user, isAdmin, isLoading: authLoading, signOut} = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState<UserProfile[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    /* ---------------- LOAD USERS (MOCK) ---------------- */
    useEffect(() => {
        if (isAdmin) {
            setUsers(MOCK_USERS);
            setIsLoading(false);
        }
    }, [isAdmin]);

    /* ---------------- SEARCH ---------------- */
    useEffect(() => {
        if (!searchQuery) {
            setFilteredUsers(users);
            return;
        }

        const q = searchQuery.toLowerCase();
        setFilteredUsers(
            users.filter(
                u =>
                    u.full_name?.toLowerCase().includes(q) ||
                    u.email?.toLowerCase().includes(q)
            )
        );
    }, [users, searchQuery]);

    /* ---------------- TOGGLE ADMIN (LOCAL) ---------------- */
    const toggleAdminRole = (userId: string, currentlyAdmin: boolean) => {
        setUsers(prev =>
            prev.map(u => {
                if (u.user_id !== userId) return u;

                return {
                    ...u,
                    user_roles: currentlyAdmin
                        ? u.user_roles.filter(r => r.role !== 'admin')
                        : [...u.user_roles, {role: 'admin'}],
                };
            })
        );

        toast.success(
            currentlyAdmin ? 'Admin role removed' : 'Admin role granted'
        );
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
        });

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
                        <Link to="/admin/orders" className="nav-link">
                            <ShoppingCart className="w-5 h-5"/>
                            {sidebarOpen && <span>Orders</span>}
                        </Link>
                        <Link to="/admin/products" className="nav-link">
                            <Package className="w-5 h-5"/>
                            {sidebarOpen && <span>Products</span>}
                        </Link>
                        <Link to="/admin/users" className="nav-link active">
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
                <h1 className="text-xl font-bold mb-6">Users</h1>

                <div className="mb-6 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="bg-card rounded-xl border">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b">
                            <th className="p-4 text-left">User</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Role</th>
                            <th className="p-4 text-left">Joined</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center">Loading...</td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center">No users found</td>
                            </tr>
                        ) : (
                            filteredUsers.map(u => {
                                const isUserAdmin = u.user_roles.some(r => r.role === 'admin');

                                return (
                                    <tr key={u.id} className="border-b hover:bg-secondary/50">
                                        <td className="p-4 flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                {isUserAdmin ? (
                                                    <Shield className="w-5 h-5 text-primary"/>
                                                ) : (
                                                    <User className="w-5 h-5 text-muted-foreground"/>
                                                )}
                                            </div>
                                            {u.full_name || 'Unknown'}
                                        </td>
                                        <td className="p-4">{u.email}</td>
                                        <td className="p-4">
                                            <Badge variant={isUserAdmin ? 'default' : 'secondary'}>
                                                {isUserAdmin ? 'Admin' : 'User'}
                                            </Badge>
                                        </td>
                                        <td className="p-4">{formatDate(u.created_at)}</td>
                                        <td className="p-4">
                                            {u.user_id !== user.id && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => toggleAdminRole(u.user_id, isUserAdmin)}
                                                >
                                                    {isUserAdmin ? 'Remove Admin' : 'Make Admin'}
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
