import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
    siteName: { type: String, default: "10-MIN TRASHMAIL" },
    description: { type: String, default: "Premium Disposable Email Service" },
    logoUrl: { type: String, default: "" },
    // নতুন ৩টি কি এখানে ডিফল্ট হিসেবে দেওয়া হলো
    apiKeys: { 
        type: [String], 
        default: [
            "tk_184f7389c354566088aab768da2e663f7ddd0bc853fea78143e33ab623e45406",
            "tk_960ab5108eca73e6140ffb8ce3b624d493479de16249e5794ffb757486f93324",
            "tk_bc1a66a599e5af21c8b79cebf0dfa4434e2d7f99f5201962449126c5b997d17a"
        ] 
    },
    maintenance: { type: Boolean, default: false },
    adTop: { type: String, default: "" },
    adBottom: { type: String, default: "" },
    footerText: { type: String, default: "© 2024 Premium TrashMail" },
    announcement: { type: String, default: "" },
    showAnnouncement: { type: Boolean, default: false }
});

export default mongoose.models.Config || mongoose.model('Config', ConfigSchema);
