"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import axios from "axios";

export default function AboutCMS() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    hero: { title: "", subtitle: "", description: "", image: "" },
    features: [],
    specialOffer: { title: "", subtitle: "", description: "", image1: "", image2: "", buttonText: "", buttonLink: "", features: [] },
    team: { title: "", subtitle: "", members: [] },
    stats: { title: "", subtitle: "", items: [], backgroundImage: "" },
  });
  const [files, setFiles] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/aboutus`);
      if (res.data.success && res.data.data) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching about us:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, key) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [key]: e.target.files[0] });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      
      formData.append("hero", JSON.stringify(data.hero));
      formData.append("features", JSON.stringify(data.features));
      formData.append("specialOffer", JSON.stringify(data.specialOffer));
      formData.append("team", JSON.stringify(data.team));
      formData.append("stats", JSON.stringify(data.stats));

      if (files.heroImage) formData.append("heroImage", files.heroImage);
      if (files.offerImage1) formData.append("offerImage1", files.offerImage1);
      if (files.offerImage2) formData.append("offerImage2", files.offerImage2);
      if (files.statsBgImage) formData.append("statsBgImage", files.statsBgImage);
      
      data.team.members.forEach((m, i) => {
        if (files[`teamImage_${i}`]) {
          formData.append(`teamImage_${i}`, files[`teamImage_${i}`]);
        }
      });

      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/aboutus`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data.success) {
        alert("Saved successfully!");
        setFiles({});
        fetchData();
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (key, val) => setData(p => ({ ...p, hero: { ...p.hero, [key]: val } }));
  const updateOffer = (key, val) => setData(p => ({ ...p, specialOffer: { ...p.specialOffer, [key]: val } }));
  const addOfferFeature = () => setData(p => ({ ...p, specialOffer: { ...p.specialOffer, features: [...(p.specialOffer.features || []), { title: "", description: "" }] } }));
  const removeOfferFeature = (idx) => setData(p => ({ ...p, specialOffer: { ...p.specialOffer, features: p.specialOffer.features.filter((_, i) => i !== idx) } }));
  const updateOfferFeature = (idx, key, val) => {
    const f = [...(data.specialOffer.features || [])];
    f[idx][key] = val;
    setData(p => ({ ...p, specialOffer: { ...p.specialOffer, features: f } }));
  };
  const updateTeamTitle = (key, val) => setData(p => ({ ...p, team: { ...p.team, [key]: val } }));
  const updateStatsTitle = (key, val) => setData(p => ({ ...p, stats: { ...p.stats, [key]: val } }));

  const addFeature = () => setData(p => ({ ...p, features: [...p.features, { title: "", description: "", linkText: "" }] }));
  const removeFeature = (idx) => setData(p => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));
  const updateFeature = (idx, key, val) => {
    const f = [...data.features];
    f[idx][key] = val;
    setData(p => ({ ...p, features: f }));
  };

  const addTeamMember = () => setData(p => ({ ...p, team: { ...p.team, members: [...p.team.members, { name: "", role: "", email: "", image: "" }] } }));
  const removeTeamMember = (idx) => setData(p => ({ ...p, team: { ...p.team, members: p.team.members.filter((_, i) => i !== idx) } }));
  const updateTeamMember = (idx, key, val) => {
    const m = [...data.team.members];
    m[idx][key] = val;
    setData(p => ({ ...p, team: { ...p.team, members: m } }));
  };

  const addStat = () => setData(p => ({ ...p, stats: { ...p.stats, items: [...p.stats.items, { number: "", suffix: "", label: "" }] } }));
  const removeStat = (idx) => setData(p => ({ ...p, stats: { ...p.stats, items: p.stats.items.filter((_, i) => i !== idx) } }));
  const updateStat = (idx, key, val) => {
    const i = [...data.stats.items];
    i[idx][key] = val;
    setData(p => ({ ...p, stats: { ...p.stats, items: i } }));
  };

  if (loading) return <div className="min-h-screen bg-[#0b1a2b] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0b1a2b] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push("/admindashboard")}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-2 font-medium">
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">About Us CMS</h1>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <Save size={20} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <div className="bg-[#111827] p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Hero Section</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                <input value={data.hero?.subtitle || ""} onChange={e => updateHero("subtitle", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input value={data.hero?.title || ""} onChange={e => updateHero("title", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea rows={3} value={data.hero?.description || ""} onChange={e => updateHero("description", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Button Text</label>
                <input value={data.hero?.buttonText || ""} onChange={e => updateHero("buttonText", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Button Link</label>
                <input value={data.hero?.buttonLink || ""} onChange={e => updateHero("buttonLink", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Hero Image</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, "heroImage")} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
                {data.hero?.image && !files.heroImage && (
                  <div className="mt-2">
                    <span className="text-xs text-green-400 block mb-1">Current image: {data.hero.image}</span>
                    <img src={data.hero.image.startsWith("/") ? data.hero.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/aboutus/${data.hero.image}`} alt="Preview" className="h-20 object-contain rounded bg-gray-800 p-1" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-[#111827] p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-400">Features Section</h2>
              <button onClick={addFeature} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-sm flex items-center gap-2"><Plus size={16}/> Add Feature</button>
            </div>
            <div className="space-y-4">
              {data.features?.map((f, i) => (
                <div key={i} className="p-4 border border-gray-700 rounded-lg bg-[#0b1a2b] relative">
                  <button onClick={() => removeFeature(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400"><Trash2 size={18}/></button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Title</label>
                      <input value={f.title || ""} onChange={e => updateFeature(i, "title", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Button Text</label>
                      <input value={f.linkText || ""} onChange={e => updateFeature(i, "linkText", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Button Link (URL)</label>
                      <input value={f.linkUrl || ""} onChange={e => updateFeature(i, "linkUrl", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Description</label>
                      <textarea value={f.description || ""} onChange={e => updateFeature(i, "description", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Offer */}
          <div className="bg-[#111827] p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Special Offer Section</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                <input value={data.specialOffer?.subtitle || ""} onChange={e => updateOffer("subtitle", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input value={data.specialOffer?.title || ""} onChange={e => updateOffer("title", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea rows={2} value={data.specialOffer?.description || ""} onChange={e => updateOffer("description", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Offer Image 1 (Left)</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, "offerImage1")} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
                {data.specialOffer?.image1 && !files.offerImage1 && (
                  <div className="mt-2">
                    <span className="text-xs text-green-400 block mb-1">Current image: {data.specialOffer.image1}</span>
                    <img src={data.specialOffer.image1.startsWith("/") ? data.specialOffer.image1 : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/aboutus/${data.specialOffer.image1}`} alt="Preview" className="h-20 object-contain rounded bg-gray-800 p-1" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Offer Image 2 (Right)</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, "offerImage2")} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
                {data.specialOffer?.image2 && !files.offerImage2 && (
                  <div className="mt-2">
                    <span className="text-xs text-green-400 block mb-1">Current image: {data.specialOffer.image2}</span>
                    <img src={data.specialOffer.image2.startsWith("/") ? data.specialOffer.image2 : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/aboutus/${data.specialOffer.image2}`} alt="Preview" className="h-20 object-contain rounded bg-gray-800 p-1" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Button Text</label>
                <input value={data.specialOffer?.buttonText || ""} onChange={e => updateOffer("buttonText", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Button Link</label>
                <input value={data.specialOffer?.buttonLink || ""} onChange={e => updateOffer("buttonLink", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 mt-8">
              <h3 className="text-lg font-medium text-gray-300">Tick Items (Features)</h3>
              <button onClick={addOfferFeature} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-sm flex items-center gap-2"><Plus size={16}/> Add Tick Item</button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {data.specialOffer?.features?.map((f, i) => (
                <div key={i} className="p-4 border border-gray-700 rounded-lg bg-[#0b1a2b] relative">
                  <button onClick={() => removeOfferFeature(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                  <div className="space-y-3 mt-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Title</label>
                      <input value={f.title || ""} onChange={e => updateOfferFeature(i, "title", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Description</label>
                      <textarea value={f.description || ""} onChange={e => updateOfferFeature(i, "description", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-[#111827] p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Team Section</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                <input value={data.team?.subtitle || ""} onChange={e => updateTeamTitle("subtitle", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input value={data.team?.title || ""} onChange={e => updateTeamTitle("title", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4 mt-6">
              <h3 className="text-lg font-medium text-gray-300">Team Members</h3>
              <button onClick={addTeamMember} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-sm flex items-center gap-2"><Plus size={16}/> Add Member</button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {data.team?.members?.map((m, i) => (
                <div key={i} className="p-4 border border-gray-700 rounded-lg bg-[#0b1a2b] relative">
                  <button onClick={() => removeTeamMember(i)} className="absolute top-4 right-4 text-red-500 hover:text-red-400"><Trash2 size={18}/></button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Name</label>
                      <input value={m.name || ""} onChange={e => updateTeamMember(i, "name", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Role</label>
                      <input value={m.role || ""} onChange={e => updateTeamMember(i, "role", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <input value={m.email || ""} onChange={e => updateTeamMember(i, "email", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Image</label>
                      <input type="file" accept="image/*" onChange={e => handleFileChange(e, `teamImage_${i}`)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white text-sm" />
                      {m.image && !files[`teamImage_${i}`] && (
                        <div className="mt-2">
                          <span className="text-xs text-green-400 block mb-1">Current image: {m.image}</span>
                          <img src={m.image.startsWith("/") ? m.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/aboutus/${m.image}`} alt="Preview" className="h-16 object-cover rounded bg-gray-800 p-1" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-[#111827] p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Stats Section</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                <input value={data.stats?.subtitle || ""} onChange={e => updateStatsTitle("subtitle", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input value={data.stats?.title || ""} onChange={e => updateStatsTitle("title", e.target.value)} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Background Image</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, "statsBgImage")} className="w-full bg-[#0b1a2b] border border-gray-700 rounded-lg p-2 text-white text-sm" />
                {data.stats?.backgroundImage && !files.statsBgImage && (
                  <div className="mt-2">
                    <span className="text-xs text-green-400 block mb-1">Current image: {data.stats.backgroundImage}</span>
                    <img src={data.stats.backgroundImage.startsWith("/") ? data.stats.backgroundImage : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/aboutus/${data.stats.backgroundImage}`} alt="Preview" className="h-20 object-cover w-full rounded bg-gray-800 p-1" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 mt-6">
              <h3 className="text-lg font-medium text-gray-300">Stat Items</h3>
              <button onClick={addStat} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-sm flex items-center gap-2"><Plus size={16}/> Add Stat</button>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              {data.stats?.items?.map((s, i) => (
                <div key={i} className="p-4 border border-gray-700 rounded-lg bg-[#0b1a2b] relative">
                  <button onClick={() => removeStat(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><Trash2 size={14}/></button>
                  <div className="space-y-3 mt-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Number</label>
                      <input value={s.number || ""} onChange={e => updateStat(i, "number", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Suffix (e.g. +)</label>
                      <input value={s.suffix || ""} onChange={e => updateStat(i, "suffix", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Label</label>
                      <input value={s.label || ""} onChange={e => updateStat(i, "label", e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
