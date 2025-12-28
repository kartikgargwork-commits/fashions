import {Button} from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';

export function HeroBanner() {
    return (
        <section className="relative overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                <img
                    src={heroBanner}
                    alt="Shop the latest tech deals"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-transparent"/>

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-xl space-y-6 animate-slide-up">
                            <div className="space-y-2">
                <span
                    className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                  Holiday Sale
                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                                    Shop the Best
                                    <span className="block text-primary">Tech Deals</span>
                                </h1>
                            </div>
                            <p className="text-lg text-primary-foreground/80 max-w-md">
                                Discover incredible savings on top electronics, fashion, home goods, and more. Free
                                shipping on orders over $35.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="hero" size="xl">
                                    Shop Now
                                </Button>
                                <Button variant="header" size="xl">
                                    View Deals
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
