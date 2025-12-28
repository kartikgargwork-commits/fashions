import React, {createContext, useContext, useEffect, useState} from "react";

interface AppUser {
    id: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "USER";
}

interface AuthContextType {
    user: AppUser | null;
    isLoading: boolean;
    isAdmin: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("token");

    // Load logged-in user on refresh
    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        fetch(`${API_URL}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => (res.ok ? res.json() : null))
            .then(data => {
                if (data) {
                    setUser(data);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const signUp = async (email: string, password: string, fullName: string) => {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password, fullName}),
        });

        if (!res.ok) {
            return {error: await res.json()};
        }

        return {error: null};
    };

    const signIn = async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });

        if (!res.ok) {
            return {error: await res.json()};
        }

        const data = await res.json();
        localStorage.setItem("token", data.token);
        setUser(data.user);

        return {error: null};
    };

    const signOut = async () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAdmin: user?.role === "ADMIN",
                signUp,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
 