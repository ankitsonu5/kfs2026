export default function Contact() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">Contact Us</h1>
            <div className="grid gap-12 md:grid-cols-2">
                <div>
                    <p className="mb-6 text-[var(--muted)]">
                        Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="mb-1 block text-sm font-medium text-[var(--foreground)]">Name</label>
                            <input type="text" id="name" className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder="Your Name" />
                        </div>
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--foreground)]">Email</label>
                            <input type="email" id="email" className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label htmlFor="message" className="mb-1 block text-sm font-medium text-[var(--foreground)]">Message</label>
                            <textarea id="message" rows={4} className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder="How can we help?" />
                        </div>
                        <button type="submit" className="rounded-md bg-[var(--primary)] px-6 py-2 font-medium text-white hover:bg-green-600 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
                <div>
                    <div className="rounded-lg border border-[var(--border)] bg-gray-50 p-6">
                        <h3 className="mb-4 text-xl font-semibold">Get in Touch</h3>
                        <div className="space-y-4 text-sm text-[var(--muted)]">
                            <p>
                                <strong className="block text-[var(--foreground)]">Address:</strong>
                                123 Grocery Lane, Market City, MC 12345
                            </p>
                            <p>
                                <strong className="block text-[var(--foreground)]">Email:</strong>
                                support@groceryapp.com
                            </p>
                            <p>
                                <strong className="block text-[var(--foreground)]">Phone:</strong>
                                +1 (555) 123-4567
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
