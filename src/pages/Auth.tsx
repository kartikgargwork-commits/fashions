import {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useAuth} from '@/context/AuthContext';
import {toast} from 'sonner';
import {Eye, EyeOff, Mail, Lock, User, ShoppingBag} from 'lucide-react';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {signIn, signUp, user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLogin) {
                const {error} = await signIn(email, password);
                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        toast.error('Invalid email or password');
                    } else {
                        toast.error(error.message);
                    }
                } else {
                    toast.success('Welcome back!');
                    navigate('/');
                }
            } else {
                if (password.length < 6) {
                    toast.error('Password must be at least 6 characters');
                    setIsLoading(false);
                    return;
                }

                const {error} = await signUp(email, password, fullName);
                if (error) {
                    if (error.message.includes('already registered')) {
                        toast.error('This email is already registered. Please sign in.');
                    } else {
                        toast.error(error.message);
                    }
                } else {
                    toast.success('Account created successfully!');
                    navigate('/');
                }
            }
        } catch (error: any) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <ShoppingBag className="w-10 h-10 text-primary"/>
                    <span className="text-3xl font-bold">
            <span className="text-primary">Shop</span>Hub
          </span>
                </Link>

                {/* Auth Card */}
                <div className="bg-card border border-border rounded-2xl shadow-elegant p-8">
                    <h1 className="text-2xl font-bold text-center mb-2">
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-muted-foreground text-center mb-8">
                        {isLogin
                            ? 'Sign in to access your account'
                            : 'Sign up to start shopping'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <div className="relative">
                                    <User
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                            {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary font-medium hover:underline"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Back to store */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-muted-foreground hover:text-foreground text-sm">
                        ← Back to store
                    </Link>
                </div>
            </div>
        </div>
    );
}
