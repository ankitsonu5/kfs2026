import Link from 'next/link';

export default function FeatureCard({ title, description, linkText, color = "green" }) {
    return (
        <div className={`group bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">{title}</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">{description}</p>
            <Link href="#" className="text-sm font-bold uppercase tracking-wider text-green-600 hover:text-green-700 border-b-2 border-transparent hover:border-green-600 transition-all inline-block pb-1">
                {linkText}
            </Link>
        </div>
    );
}
