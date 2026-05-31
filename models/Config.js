import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
    siteName: { type: String, default: "10-MIN TRASHMAIL" },
    description: { type: String, default: "Premium Disposable Email Service" },
    logoUrl: { type: String, default: "" },
    apiKeys: { type: [String], default: [] },
    maintenance: { type: Boolean, default: false },
    adTop: { type: String, default: "" },
    adBottom: { type: String, default: "" },
    footerText: { type: String, default: "© 2024 Premium TrashMail" },
    announcement: { type: String, default: "" },
    showAnnouncement: { type: Boolean, default: false },
    // নতুন স্ট্যাটস ফিল্ড
    totalEmailsGenerated: { type: Number, default: 0 }
});

export default mongoose.models.Config || mongoose.model('Config', ConfigSchema);
