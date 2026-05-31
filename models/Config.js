import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
    siteName: { type: String, default: "10-MIN TRASHMAIL" },
    apiKeys: { type: [String], default: ["tk_ad30d1e1d46266c3bbb45b067c08e99ebe5392af8e8355591d7682feefcfaa77"] },
    maintenance: { type: Boolean, default: false },
    adTop: { type: String, default: "" },
    adBottom: { type: String, default: "" }
});

export default mongoose.models.Config || mongoose.model('Config', ConfigSchema);
