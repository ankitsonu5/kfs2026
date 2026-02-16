import Link from 'next/link';
import { ShoppingCart, Menu, Search, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                            <span className="font-bold">G</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">GroceryApp</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
                        Home
                    </Link>
                    <Link href="/bulk-order" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
                        Bulk Orders
                    </Link>
                    <Link href="/about-us" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
                        About Us
                    </Link>
                    <Link href="/contact" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
                        Contact
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-[var(--muted)]/10 rounded-full transition-colors">
                        <Search className="h-5 w-5" />
                    </button>
                    <Link href="/profile" className="p-2 hover:bg-[var(--muted)]/10 rounded-full transition-colors">
                        <User className="h-5 w-5" />
                    </Link>
                    <Link href="/cart" className="relative p-2 hover:bg-[var(--muted)]/10 rounded-full transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">0</span>
                    </Link>
                    <button className="md:hidden p-2 hover:bg-[var(--muted)]/10 rounded-full transition-colors">
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
