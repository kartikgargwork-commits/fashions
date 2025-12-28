import {Product, Category} from '@/types/product';

export const categories: Category[] = [
    {
        id: '1',
        name: 'Electronics',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        productCount: 2450
    },
    {
        id: '2',
        name: 'Fashion',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
        productCount: 5230
    },
    {
        id: '3',
        name: 'Home & Kitchen',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        productCount: 3120
    },
    {
        id: '4',
        name: 'Sports',
        image: 'https://images.unsplash.com/photo-1461896836934- voices?w=400',
        productCount: 1890
    },
    {
        id: '5',
        name: 'Books',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
        productCount: 8900
    },
    {
        id: '6',
        name: 'Toys & Games',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400',
        productCount: 2100
    },
];

export const products: Product[] = [
    {
        id: '1',
        name: 'Apple MacBook Pro 14" M3 Pro',
        description: 'Supercharged by M3 Pro chip for exceptional performance',
        price: 1999.00,
        originalPrice: 2199.00,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        rating: 4.8,
        reviewCount: 2847,
        category: 'Electronics',
        isPrime: true,
        inStock: true,
        badge: 'Best Seller'
    },
    {
        id: '2',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise cancellation with exceptional sound',
        price: 348.00,
        originalPrice: 399.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        rating: 4.7,
        reviewCount: 15234,
        category: 'Electronics',
        isPrime: true,
        inStock: true,
        badge: 'Deal'
    },
    {
        id: '3',
        name: 'Apple Watch Series 9 GPS 45mm',
        description: 'Advanced health features and the brightest display ever',
        price: 429.00,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
        rating: 4.6,
        reviewCount: 8923,
        category: 'Electronics',
        isPrime: true,
        inStock: true
    },
    {
        id: '4',
        name: 'Samsung 65" OLED 4K Smart TV',
        description: 'Quantum HDR OLED+ with Neural Quantum Processor',
        price: 1797.99,
        originalPrice: 2199.99,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
        rating: 4.5,
        reviewCount: 3421,
        category: 'Electronics',
        isPrime: true,
        inStock: true,
        badge: 'Limited Deal'
    },
    {
        id: '5',
        name: 'Nike Air Max 270 Running Shoes',
        description: 'Maximum cushioning for your running adventures',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        rating: 4.4,
        reviewCount: 12456,
        category: 'Fashion',
        isPrime: true,
        inStock: true
    },
    {
        id: '6',
        name: 'Instant Pot Duo 7-in-1 Electric Cooker',
        description: 'Pressure cooker, slow cooker, rice cooker and more',
        price: 89.95,
        originalPrice: 119.95,
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
        rating: 4.7,
        reviewCount: 45678,
        category: 'Home & Kitchen',
        isPrime: true,
        inStock: true,
        badge: 'Best Seller'
    },
    {
        id: '7',
        name: 'Kindle Paperwhite 11th Gen',
        description: '6.8" display, adjustable warm light, 16GB',
        price: 139.99,
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500',
        rating: 4.6,
        reviewCount: 28934,
        category: 'Electronics',
        isPrime: true,
        inStock: true
    },
    {
        id: '8',
        name: 'Dyson V15 Detect Cordless Vacuum',
        description: 'Laser reveals microscopic dust. LCD shows what\'s been sucked up.',
        price: 749.99,
        originalPrice: 849.99,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        rating: 4.5,
        reviewCount: 5678,
        category: 'Home & Kitchen',
        isPrime: true,
        inStock: true,
        badge: 'Deal'
    },
];

export const dealProducts = products.filter(p => p.badge === 'Deal' || p.badge === 'Limited Deal');
export const bestSellers = products.filter(p => p.badge === 'Best Seller');
