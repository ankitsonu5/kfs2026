import { Mail } from 'lucide-react';

export default function FarmerCard({ name, role, email }) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                <img
                    src={`https://placehold.co/400x300/e2e8f0/475569?text=${name.replace(' ', '+')}`}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {/* Social Icons could go here */}
                </div>
            </div>
            <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
                <span className="text-orange-500 font-medium text-sm block mb-4">{role}</span>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm pt-4 border-t border-gray-100">
                    <Mail size={16} />
                    <span>{email}</span>
                </div>
            </div>
        </div>
    );
}
