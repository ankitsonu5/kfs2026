import Image from 'next/image';
import { Plus } from 'lucide-react';

export default function ProductCard({ product }) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            {product.discount && (
                <span className="absolute left-3 top-3 z-10 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
                    {product.discount}
                </span>
            )}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {/* Fallback image logic or real image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <span>No Image</span>
                    )}
                </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-1 text-sm font-semibold text-[var(--foreground)] line-clamp-2">
                    <a href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                    </a>
                </h3>
                <p className="text-xs text-[var(--muted)] mb-3">Grocery</p>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-[var(--foreground)]">₹{product.price}</span>
                        {product.originalPrice && (
                            <span className="text-xs text-[var(--muted)] line-through">₹{product.originalPrice}</span>
                        )}
                    </div>

                    <button className="relative z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-md hover:bg-green-600 hover:scale-105 transition-all">
                        <Plus className="h-5 w-5" />
                        <span className="sr-only">Add to cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
