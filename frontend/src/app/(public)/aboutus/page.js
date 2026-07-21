"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../../components/redesign/Navbar';
import Hero from '../../components/redesign/Hero';
import FeatureCard from '../../components/redesign/FeatureCard';
import SpecialOffer from '../../components/redesign/SpecialOffer';
import FarmerCard from '../../components/redesign/FarmerCard';
import StatCard from '../../components/redesign/StatCard';
import Footer from '../../components/redesign/Footer';
import Header from "../../components/header";

export default function AboutUsPage() {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/aboutus`);
                if (res.data.success) {
                    setAboutData(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching about us data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutData();
    }, []);

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

    const data = aboutData || {};

    const features = data.features || [
      { title: "Best Discounts", description: "There are many variations of passages...", linkText: "Shop Now", linkUrl: "/shop" },
      { title: "Great Daily Deal", description: "And is completely undo sent...", linkText: "Read More", linkUrl: "/shop" },
      { title: "Free Delivery", description: "There are many variations of passages...", linkText: "Contact", linkUrl: "/contact" }
    ];

    const team = data.team?.members?.length > 0 ? data.team.members : [
      { name: "Alex Maxwell", role: "CEO & Founder", email: "support@xstore.com" },
      { name: "Justin Roberto", role: "Manager", email: "support@xstore.com" },
      { name: "Louis Agassiz", role: "Organic Farmer", email: "support@xstore.com" },
      { name: "Carl Anderson", role: "Agricultural", email: "support@xstore.com" }
    ];

    const stats = data.stats?.items?.length > 0 ? data.stats.items : [
      { number: "5", suffix: "+", label: "Glorious Years" },
      { number: "35", suffix: "+", label: "Happy Clients" },
      { number: "25", suffix: "+", label: "Projects Complete" },
      { number: "10", suffix: "+", label: "Team Advisor" }
    ];
    
    const bgImage = data.stats?.backgroundImage ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/aboutus/${data.stats.backgroundImage}` : 'url("/aboutus/factsbg.webp")';

    return (
        <div className="font-sans antialiased text-gray-900 bg-white">
            <Header />
            <Navbar />
            <Hero data={data.hero} />

            {/* Features Section */}
            <section className="container mx-auto px-4 -mt-32 lg:-mt-16 relative z-20 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <FeatureCard
                            key={i}
                            title={f.title}
                            description={f.description}
                            linkText={f.linkText}
                            linkUrl={f.linkUrl}
                        />
                    ))}
                </div>
            </section>

            <SpecialOffer data={data.specialOffer} />

            {/* Farmers / Team Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-orange-500 font-semibold uppercase tracking-wide text-sm">{data.team?.subtitle || "Our Team"}</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2">{data.team?.title || "Our Farm Land Farmers"}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((m, i) => (
                            <FarmerCard 
                                key={i} 
                                name={m.name} 
                                role={m.role} 
                                email={m.email} 
                                image={m.image} 
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section with Parallax/Background */}
            <section className="relative py-24 bg-fixed bg-cover bg-center" style={{ backgroundImage: bgImage.includes('url') ? bgImage : `url('${bgImage}')` }}>
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="text-green-400 font-semibold uppercase tracking-wide text-sm mb-2 block">{data.stats?.subtitle || "Our Numbers"}</span>
                    <h2 className="text-4xl font-bold text-white mb-16">{data.stats?.title || "Convincing Facts"}</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((s, i) => (
                            <StatCard 
                                key={i} 
                                number={s.number} 
                                suffix={s.suffix} 
                                label={s.label} 
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
