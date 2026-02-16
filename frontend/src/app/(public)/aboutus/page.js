export default function AboutUs() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">About Us</h1>

            <div className="grid gap-12 md:grid-cols-2">
                <div className="space-y-6">
                    <p className="text-[var(--muted)] leading-relaxed">
                        Welcome to <strong className="text-[var(--foreground)]">GroceryApp</strong> — your trusted destination for fresh, high-quality groceries delivered right to your doorstep.
                    </p>
                    <p className="text-[var(--muted)] leading-relaxed">
                        We work directly with local farmers and trusted suppliers to bring you the freshest produce, dairy, and pantry essentials at competitive prices. Our mission is to make grocery shopping convenient, affordable, and enjoyable for everyone.
                    </p>
                    <p className="text-[var(--muted)] leading-relaxed">
                        Founded in 2021, we have grown from a small local delivery service to serving thousands of happy customers. We believe in quality, transparency, and exceptional customer service.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
                            <p className="text-3xl font-bold text-[var(--primary)]">5+</p>
                            <p className="text-sm text-[var(--muted)] mt-1">Years of Service</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
                            <p className="text-3xl font-bold text-[var(--primary)]">10K+</p>
                            <p className="text-sm text-[var(--muted)] mt-1">Happy Customers</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
                            <p className="text-3xl font-bold text-[var(--primary)]">500+</p>
                            <p className="text-sm text-[var(--muted)] mt-1">Products</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
                            <p className="text-3xl font-bold text-[var(--primary)]">50+</p>
                            <p className="text-sm text-[var(--muted)] mt-1">Local Farmers</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border border-[var(--border)] bg-gray-50 p-6">
                        <h3 className="mb-4 text-xl font-semibold text-[var(--foreground)]">Our Mission</h3>
                        <p className="text-[var(--muted)] leading-relaxed">
                            To provide fresh, healthy, and affordable groceries to every household while supporting local farmers and sustainable farming practices.
                        </p>
                    </div>

                    <div className="rounded-lg border border-[var(--border)] bg-gray-50 p-6">
                        <h3 className="mb-4 text-xl font-semibold text-[var(--foreground)]">Our Vision</h3>
                        <p className="text-[var(--muted)] leading-relaxed">
                            To become India&apos;s most trusted online grocery platform, known for quality, freshness, and customer satisfaction.
                        </p>
                    </div>

                    <div className="rounded-lg border border-[var(--border)] bg-gray-50 p-6">
                        <h3 className="mb-4 text-xl font-semibold text-[var(--foreground)]">Why Choose Us?</h3>
                        <ul className="space-y-2 text-[var(--muted)]">
                            <li className="flex items-center gap-2">
                                <span className="text-[var(--primary)]">✓</span> Farm-fresh produce delivered daily
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[var(--primary)]">✓</span> Best prices with exciting offers
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[var(--primary)]">✓</span> Free delivery on orders above ₹500
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[var(--primary)]">✓</span> 100% quality guarantee
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
