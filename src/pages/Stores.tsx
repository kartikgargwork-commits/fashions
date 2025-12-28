import {Link} from 'react-router-dom';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {ChevronRight} from 'lucide-react';
import StoreLocator from '@/components/StoreLocator';

export default function Stores() {
    return (
        <div className="min-h-screen bg-background">
            <Header/>

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <ChevronRight className="w-4 h-4"/>
                    <span className="text-foreground">Store Locator</span>
                </nav>

                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        Find a Store
                    </h1>
                    <p className="text-muted-foreground">
                        Locate our stores and pickup points near you for in-store shopping or order pickup.
                    </p>
                </div>

                <StoreLocator/>
            </main>

            <Footer/>
        </div>
    );
}
