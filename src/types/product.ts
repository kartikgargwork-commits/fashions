export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviewCount: number;
    category: string;
    isPrime?: boolean;
    inStock: boolean;
    badge?: string;
}

export interface Category {
    id: string;
    name: string;
    image: string;
    productCount: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
