import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';

const CATEGORIES = [
    "All Products", "Beverages", "Bread & Pastry", "Bread & Snack",
    "Breakfast & Dairy", "Bulk Order", "Canned Food", "Cold Drinks",
    "Deals of the Day", "Diet Nutrition", "Fast Food Items",
    "Fresh Vegetables", "Fruit & Veggies", "Gluten Free", "Groceries",
    "Meat & Seafood", "Organic", "Quality Milk"
];

const PRODUCTS = [
    {
        id: 1,
        name: "FORTUNE KING'S SOYABEAN OIL - 15 LTR",
        tags: "Bulk Order, Groceries, Oil & Ghee",
        price: 1935,
        originalPrice: null,
        discount: null,
        image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
        id: 2,
        name: "NATUROZ FESTIVE CELEBRATIONS GIFT PACK",
        tags: "Bulk Order, Groceries, Grocery",
        price: 331,
        originalPrice: 649,
        discount: "YOU SAVE 49%",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
        id: 3,
        name: "R-U NUTZ! PREMIUM ALMONDS - 1 KG",
        tags: "Bulk Order, Dry Fruits, Groceries",
        price: 900,
        originalPrice: 1160,
        discount: "YOU SAVE 22%",
        image: "https://images.unsplash.com/photo-1508061461508-a0d1f6d85d83?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
        id: 4,
        name: "INDIA GATE BASMATI RICE - 5 KG",
        tags: "Rice, Bulk Order, Pantry",
        price: 850,
        originalPrice: 1050,
        discount: "YOU SAVE 19%",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
        id: 5,
        name: "TATA SALT - 10 KG BULK PACK",
        tags: "Salt, Spices, Essentials",
        price: 220,
        originalPrice: 250,
        discount: "YOU SAVE 12%",
        image: "https://images.unsplash.com/photo-1626139576127-164e222d4f8f?auto=format&fit=crop&q=80&w=400&h=400",
    },
    {
        id: 6,
        name: "FRESH ONIONS - 25 KG SACK",
        tags: "Fresh Vegetables, Bulk",
        price: 600,
        originalPrice: 800,
        discount: "YOU SAVE 25%",
        image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=400&h=400",
    },
];

export default function BulkOrderPage() {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Breadcrumb + Title */}
            <div className="bg-white border-b border-gray-200 py-10 text-center">
                <div className="flex justify-center items-center gap-2 text-sm text-gray-400 mb-3">
                    <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-600 font-medium">Shop</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-gray-900">
                    Bulk Order
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ===== SIDEBAR ===== */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">

                        {/* Categories */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-base mb-4 uppercase tracking-wide text-gray-900">All Categories</h3>
                            <ul className="space-y-2.5 text-sm">
                                {CATEGORIES.map((cat, idx) => (
                                    <li key={idx}>
                                        <button
                                            className={`w-full text-left transition-colors hover:text-[var(--primary)] ${cat === "Bulk Order"
                                                    ? "text-[var(--primary)] font-semibold"
                                                    : "text-gray-500"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Filter */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-base mb-4 uppercase tracking-wide text-gray-900">Filter By Price</h3>
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                defaultValue="4850"
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                            />
                            <div className="flex justify-between items-center text-xs mt-3">
                                <span className="text-gray-500">Price: ₹50 — ₹4,850</span>
                                <button className="text-[var(--primary)] font-bold uppercase text-xs hover:underline">Filter</button>
                            </div>
                        </div>

                        {/* Product Status */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-base mb-4 uppercase tracking-wide text-gray-900">Product Status</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] accent-[var(--primary)]" />
                                    In Stock
                                </label>
                                <label className="flex items-center gap-3 text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] accent-[var(--primary)]" />
                                    On Sale
                                </label>
                            </div>
                        </div>

                        {/* Promo Banner */}
                        <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-orange-50 to-orange-100 border border-orange-200/50">
                            <div className="p-5 text-center">
                                <p className="text-[var(--primary)] font-bold text-sm mb-1">SAVE</p>
                                <p className="text-4xl font-black text-orange-500 mb-1">15% <span className="text-lg">ON</span></p>
                                <div className="my-4 flex justify-center">
                                    <div className="w-28 h-28 rounded-full bg-orange-200/50 flex items-center justify-center">
                                        <span className="text-5xl">🍊</span>
                                    </div>
                                </div>
                                <h4 className="text-lg font-black text-gray-900 uppercase mb-3">Orange Juice</h4>
                                <button className="bg-[var(--primary)] text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-green-600 transition-colors shadow-md">
                                    Shop Now
                                </button>
                            </div>
                        </div>

                    </aside>

                    {/* ===== MAIN CONTENT ===== */}
                    <main className="flex-1 min-w-0">

                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-3">
                            <p className="text-sm text-gray-400">
                                Showing 1–{PRODUCTS.length} of {PRODUCTS.length} results
                            </p>
                            <select className="bg-gray-50 border border-gray-200 text-sm text-gray-600 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30">
                                <option>Default sorting</option>
                                <option>Sort by popularity</option>
                                <option>Sort by price: low to high</option>
                                <option>Sort by price: high to low</option>
                            </select>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {PRODUCTS.map((product) => (
                                <div
                                    key={product.id}
                                    className="group relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Discount Badge */}
                                    {product.discount && (
                                        <span className="absolute left-3 top-3 z-10 rounded-md bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                                            {product.discount}
                                        </span>
                                    )}

                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <p className="text-[11px] text-gray-400 mb-1.5 line-clamp-1">{product.tags}</p>
                                        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3 line-clamp-2 min-h-[2.5rem]">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-end justify-between">
                                            <div className="flex items-baseline gap-2">
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                                )}
                                                <span className="text-lg font-extrabold text-[var(--primary)]">₹{product.price.toLocaleString()}</span>
                                            </div>

                                            {/* Add to Cart */}
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                <button className="px-2.5 py-1.5 text-gray-400 hover:text-gray-700 text-sm font-bold transition-colors">−</button>
                                                <span className="px-2 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 min-w-[2rem] text-center">0</span>
                                                <button className="px-2.5 py-1.5 bg-[var(--primary)] text-white hover:bg-green-600 transition-colors">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-10 flex justify-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)] text-white font-bold text-sm shadow-md">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors text-sm">2</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors text-sm">→</button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
