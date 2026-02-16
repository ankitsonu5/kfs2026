import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Menu } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/redesign" className="text-2xl font-bold text-green-600">
                    XStore
                </Link>

                {/* Search Bar - Hidden on mobile, visible on md+ */}
                <div className="hidden md:flex items-center flex-1 max-w-lg mx-8 relative">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
                    />
                    <button className="absolute right-2 text-gray-500 hover:text-green-600">
                        <Search size={20} />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    <Link href="#" className="flex items-center gap-1 text-gray-700 hover:text-green-600">
                        <User size={20} />
                        <span className="hidden sm:inline text-sm font-medium">Sign In</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-1 text-gray-700 hover:text-green-600">
                        <Heart size={20} />
                        <span className="hidden sm:inline text-sm font-medium">Wishlist</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-1 text-gray-700 hover:text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                        <ShoppingCart size={20} />
                        <span className="text-sm font-bold">$0.00</span>
                    </Link>
                    <button className="md:hidden text-gray-700">
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="border-t border-gray-100 hidden md:block">
                <div className="container mx-auto px-4">
                    <ul className="flex items-center gap-8 py-3 text-sm font-medium text-gray-600">
                        <li><Link href="#" className="text-green-600">ALL DEPARTMENTS</Link></li>
                        <li><Link href="#" className="hover:text-green-600">HOME</Link></li>
                        <li><Link href="#" className="hover:text-green-600">ABOUT US</Link></li>
                        <li><Link href="#" className="hover:text-green-600">COLLECTION</Link></li>
                        <li><Link href="#" className="hover:text-green-600">SHOP</Link></li>
                        <li><Link href="#" className="hover:text-green-600">CONTACT</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
