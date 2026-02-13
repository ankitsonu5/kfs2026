export default function StatCard({ number, label, suffix = "+" }) {
    return (
        <div className="text-center text-white py-8">
            <div className="text-5xl lg:text-6xl font-black mb-2 flex items-center justify-center gap-1">
                {number}<span className="text-orange-400">{suffix}</span>
            </div>
            <p className="text-lg text-gray-200 font-medium uppercase tracking-wider">{label}</p>
        </div>
    );
}
