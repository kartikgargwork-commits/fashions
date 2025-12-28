import {Facebook, Twitter, Instagram, Youtube} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';

const footerLinks = {
    'Get to Know Us': ['Careers', 'About Us', 'Investor Relations', 'ShopHub Devices', 'ShopHub Science'],
    'Make Money with Us': ['Sell on ShopHub', 'Sell under ShopHub Accelerator', 'Protect & Build Your Brand', 'Become an Affiliate', 'Advertise Your Products'],
    'Payment Products': ['ShopHub Business Card', 'Shop with Points', 'Reload Your Balance', 'Currency Converter'],
    'Let Us Help You': ['Your Account', 'Your Orders', 'Shipping Rates & Policies', 'Returns & Replacements', 'Manage Your Content and Devices'],
};

export function Footer() {
    return (
        <footer className="bg-header text-header-foreground">
            {/* Back to top */}
            <button
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                className="w-full py-4 text-sm hover:bg-header-foreground/10 transition-colors"
            >
                Back to top
            </button>

            {/* Main Footer */}
            <div className="border-t border-header-foreground/10">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title}>
                                <h4 className="font-bold mb-4">{title}</h4>
                                <ul className="space-y-2">
                                    {links.map((link) => (
                                        <li key={link}>
                                            <a href="#"
                                               className="text-sm text-header-foreground/70 hover:text-header-foreground hover:underline transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-header-foreground/10 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="font-bold text-lg mb-1">Subscribe to our newsletter</h4>
                            <p className="text-sm text-header-foreground/70">Get the latest deals and promotions</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-header-foreground/10 border-header-foreground/20 text-header-foreground placeholder:text-header-foreground/50 w-full md:w-64"
                            />
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-header-foreground/10 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <a href="/" className="flex items-center gap-1">
                                <span className="text-xl font-bold text-primary">Shop</span>
                                <span className="text-xl font-bold">Hub</span>
                            </a>
                        </div>

                        <div className="flex items-center gap-4">
                            <a href="#"
                               className="text-header-foreground/70 hover:text-header-foreground transition-colors">
                                <Facebook className="w-5 h-5"/>
                            </a>
                            <a href="#"
                               className="text-header-foreground/70 hover:text-header-foreground transition-colors">
                                <Twitter className="w-5 h-5"/>
                            </a>
                            <a href="#"
                               className="text-header-foreground/70 hover:text-header-foreground transition-colors">
                                <Instagram className="w-5 h-5"/>
                            </a>
                            <a href="#"
                               className="text-header-foreground/70 hover:text-header-foreground transition-colors">
                                <Youtube className="w-5 h-5"/>
                            </a>
                        </div>

                        <p className="text-xs text-header-foreground/50">
                            © 2024 ShopHub, Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
