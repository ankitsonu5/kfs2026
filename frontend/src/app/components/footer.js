import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-[var(--border)] bg-[var(--background)] py-12">
            <div className="container mx-auto px-4">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                                <span className="font-bold">G</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">GroceryApp</span>
                        </div>
                        <p className="text-sm text-[var(--muted)]">
                            Fresh groceries delivered to your doorstep. Quality you can trust.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2 text-sm text-[var(--muted)]">
                            <li><Link href="/about-us" className="hover:text-[var(--foreground)] transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-[var(--foreground)] transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-[var(--foreground)] transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Support</h3>
                        <ul className="space-y-2 text-sm text-[var(--muted)]">
                            <li><Link href="#" className="hover:text-[var(--foreground)] transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-[var(--foreground)] transition-colors">FAQs</Link></li>
                            <li><Link href="/bulk-order" className="hover:text-[var(--foreground)] transition-colors">Bulk Orders</Link></li>
                            <li><Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>


                    {/* Newsletter / Social */}
                    <div className="space-y-4">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Stay Connected</h3>
                        <div className="flex gap-4">
                            <a href="#" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"><Linkedin className="h-5 w-5" /></a>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-[var(--muted)] mb-2">Subscribe to our newsletter</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Enter your email" className="flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                                <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--muted)]">
                    &copy; {new Date().getFullYear()} GroceryApp. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
