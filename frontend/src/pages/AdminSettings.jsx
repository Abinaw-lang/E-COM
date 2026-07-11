import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Settings,
    Upload,
    X,
    Info,
    DollarSign,
    Percent,
    Mail,
    Phone,
    MapPin,
    Building
} from 'lucide-react';
import { adminService } from '../services';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);

    // Settings state
    const [storeName, setStoreName] = useState('');
    const [tagline, setTagline] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [shippingCharges, setShippingCharges] = useState('');
    const [taxPercentage, setTaxPercentage] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await adminService.getSettings();
            const s = res.data?.data || {};

            setStoreName(s.storeName || '');
            setTagline(s.tagline || '');
            setLogoUrl(s.logoUrl || '');
            setShippingCharges(s.shippingCharges ?? 100);
            setTaxPercentage(s.taxPercentage ?? 18);
            setCurrency(s.currency || 'INR');
            setContactEmail(s.contactEmail || '');
            setContactPhone(s.contactPhone || '');
            setAddress(s.address || '');
        } catch (err) {
            console.error(err);
            toast.error('Failed to load store settings metadata');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        setUploadProgress(0);

        try {
            const fileName = `${Date.now()}_logo_${file.name.replace(/\s+/g, '_')}`;
            const storageRef = ref(storage, `settings/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setUploadProgress(progress);
                    },
                    (error) => reject(error),
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setLogoUrl(downloadURL);
                        resolve();
                    }
                );
            });
            toast.success('Store logo uploaded successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload store logo');
        } finally {
            setUploadProgress(null);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!storeName.trim()) {
            toast.error('Store Name is required');
            return;
        }

        try {
            setSaving(true);
            const payload = {
                storeName: storeName.trim(),
                tagline: tagline.trim(),
                logoUrl,
                shippingCharges: Number(shippingCharges),
                taxPercentage: Number(taxPercentage),
                currency,
                contactEmail: contactEmail.trim(),
                contactPhone: contactPhone.trim(),
                address: address.trim()
            };

            await adminService.saveSettings(payload);
            toast.success('Store configurations saved successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save store configurations');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-extrabold tracking-tight">Store Preferences</h1>
                    <p className="text-[#9ba7c9] mt-1">Configure company branding metadata, base rates, and contact credentials.</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-96 w-full glass-card border border-[#aabcf5]/10 rounded-2xl loading-shimmer" />
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* BRANDING CONFIG */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* General details */}
                            <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-6 space-y-4">
                                <h3 className="text-lg font-bold font-display text-white border-b border-[#aabcf5]/10 pb-3 flex items-center gap-2">
                                    <Building size={18} className="text-blue-400" />
                                    <span>General Branding</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Store Display Name *</label>
                                        <input
                                            type="text"
                                            value={storeName}
                                            onChange={(e) => setStoreName(e.target.value)}
                                            placeholder="e.g. Retro Jersey Store"
                                            className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Store Slogan / Tagline</label>
                                        <input
                                            type="text"
                                            value={tagline}
                                            onChange={(e) => setTagline(e.target.value)}
                                            placeholder="e.g. Premium Sports Gear Collection"
                                            className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Logo Image Uploader */}
                                <div className="border border-white/5 bg-white/5 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="col-span-2">
                                        <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Store Brand Logo</label>
                                        <div
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                                            onClick={() => {
                                                const fileInput = document.createElement('input');
                                                fileInput.type = 'file';
                                                fileInput.accept = 'image/*';
                                                fileInput.onchange = (e) => handleFileUpload(e.target.files);
                                                fileInput.click();
                                            }}
                                            className="border-2 border-dashed border-[#aabcf5]/20 hover:border-blue-500/40 rounded-xl p-4 transition flex flex-col items-center justify-center gap-1 cursor-pointer bg-black/20"
                                        >
                                            <Upload size={18} className="text-[#9ba7c9]" />
                                            <p className="text-[11px] text-white font-semibold">Drag & Drop brand logo image</p>
                                            {uploadProgress !== null && (
                                                <div className="w-full max-w-[120px] bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
                                                    <div className="bg-blue-500 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-span-1 flex flex-col items-center justify-center p-2 border border-white/5 rounded-xl bg-black/40 min-h-[96px] relative">
                                        {logoUrl ? (
                                            <>
                                                <img src={logoUrl} alt="Store logo thumbnail" className="max-h-16 max-w-full object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={() => setLogoUrl('')}
                                                    className="absolute -top-1.5 -right-1.5 bg-black/90 p-1 border border-white/10 rounded-lg text-rose-450 hover:text-rose-400"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-[10px] text-[#9ba7c9] italic">No logo chosen</span>
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* Taxation & Charges details */}
                            <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-6 space-y-4">
                                <h3 className="text-lg font-bold font-display text-white border-b border-[#aabcf5]/10 pb-3 flex items-center gap-2">
                                    <DollarSign size={18} className="text-emerald-400" />
                                    <span>Logistics & Taxation Formulas</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Flat Shipping Charge (INR)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 text-[#9ba7c9]" size={16} />
                                            <input
                                                type="number"
                                                value={shippingCharges}
                                                onChange={(e) => setShippingCharges(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 bg-[#121827] border border-[#aabcf5]/10 rounded-xl text-sm text-white focus:outline-none"
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Default VAT / GST Rate (%)</label>
                                        <div className="relative">
                                            <Percent className="absolute left-3 top-3.5 text-[#9ba7c9]" size={14} />
                                            <input
                                                type="number"
                                                value={taxPercentage}
                                                onChange={(e) => setTaxPercentage(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 bg-[#121827] border border-[#aabcf5]/10 rounded-xl text-sm text-white focus:outline-none"
                                                required
                                                min="0"
                                                max="100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* COMMUNICATIONS SECTION */}
                        <div className="lg:col-span-1 space-y-6">

                            <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold font-display text-white border-b border-[#aabcf5]/10 pb-3 flex items-center gap-2">
                                        <Mail size={18} className="text-indigo-400" />
                                        <span>Support Credentials</span>
                                    </h3>

                                    <div className="space-y-4 mt-4">
                                        <div>
                                            <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Support Helpline Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3.5 text-[#9ba7c9]" size={14} />
                                                <input
                                                    type="email"
                                                    value={contactEmail}
                                                    onChange={(e) => setContactEmail(e.target.value)}
                                                    placeholder="billing@jerseystore.com"
                                                    className="w-full pl-9 pr-4 py-2.5 bg-[#121827] border border-[#aabcf5]/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Support Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3.5 text-[#9ba7c9]" size={14} />
                                                <input
                                                    type="text"
                                                    value={contactPhone}
                                                    onChange={(e) => setContactPhone(e.target.value)}
                                                    placeholder="+919999999999"
                                                    className="w-full pl-9 pr-4 py-2.5 bg-[#121827] border border-[#aabcf5]/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">HQ Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3.5 text-[#9ba7c9]" size={14} />
                                                <textarea
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    placeholder="Full logistics office address..."
                                                    className="w-full pl-9 pr-4 py-2.5 bg-[#121827] border border-[#aabcf5]/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none"
                                                    rows="4"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-[#aabcf5]/10 mt-6 space-y-3">
                                    <div className="bg-[#aabcf5]/5 border border-[#aabcf5]/10 rounded-xl p-3 flex gap-2 items-start text-[10px] text-[#9ba7c9] leading-relaxed">
                                        <Info size={14} className="text-[#aabcf5] shrink-0 mt-0.5" />
                                        <p>
                                            Changes made to general financial rates and shipping values apply automatically to checkout transactions.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                                    >
                                        <Save size={16} />
                                        <span>{saving ? 'Saving Configurations...' : 'Save Settings'}</span>
                                    </button>
                                </div>

                            </div>

                        </div>

                    </form>
                )}

            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
