import Navbar from '../../components/redesign/Navbar';
import Hero from '../../components/redesign/Hero';
import FeatureCard from '../../components/redesign/FeatureCard';
import SpecialOffer from '../../components/redesign/SpecialOffer';
import FarmerCard from '../../components/redesign/FarmerCard';
import StatCard from '../../components/redesign/StatCard';
import Footer from '../../components/redesign/Footer';

export default function RedesignPage() {
    return (
        <div className="font-sans antialiased text-gray-900 bg-white">
            <Navbar />
            <Hero />

            {/* Features Section */}
            <section className="container mx-auto px-4 -mt-32 lg:-mt-16 relative z-20 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Best Discounts"
                        description="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form."
                        linkText="Shop Now"
                    />
                    <FeatureCard
                        title="Great Daily Deal"
                        description="And is completely undo sent. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                        linkText="Read More"
                    />
                    <FeatureCard
                        title="Free Delivery"
                        description="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form."
                        linkText="Contact"
                    />
                </div>
            </section>

            <SpecialOffer />

            {/* Farmers Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-orange-500 font-semibold uppercase tracking-wide text-sm">Our Team</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2">Our Farm Land Farmers</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FarmerCard name="Alex Maxwell" role="CEO & Founder" email="support@xstore.com" />
                        <FarmerCard name="Justin Roberto" role="Manager" email="support@xstore.com" />
                        <FarmerCard name="Louis Agassiz" role="Organic Farmer" email="support@xstore.com" />
                        <FarmerCard name="Carl Anderson" role="Agricultural" email="support@xstore.com" />
                    </div>
                </div>
            </section>

            {/* Stats Section with Parallax/Background */}
            <section className="relative py-24 bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url("https://placehold.co/1920x600/111827/1f2937?text=Farm+Background")' }}>
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="text-green-400 font-semibold uppercase tracking-wide text-sm mb-2 block">Our Numbers</span>
                    <h2 className="text-4xl font-bold text-white mb-16">Convincing Facts</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatCard number="5" suffix="+" label="Glorious Years" />
                        <StatCard number="35" suffix="+" label="Happy Clients" />
                        <StatCard number="25" suffix="+" label="Projects Complete" />
                        <StatCard number="10" suffix="+" label="Team Advisor" />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
