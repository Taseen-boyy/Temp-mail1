import dbConnect from '../lib/db';
import Config from '../models/Config';

export default async function handler(req, res) {
    try {
        await dbConnect();
        // ডাটাবেস থেকে সেটিংস খোঁজা
        let config = await Config.findOne();
        
        // যদি ডাটাবেস একদম খালি থাকে তবে একটি ডিফল্ট অবজেক্ট তৈরি করবে
        if (!config) {
            config = {
                siteName: "10-MIN TRASHMAIL",
                description: "Premium Disposable Email Service",
                apiKeys: ["tk_ad30d1e1d46266c3bbb45b067c08e99ebe5392af8e8355591d7682feefcfaa77"]
            };
        }

        if (config.maintenance) {
            return res.status(200).json({ maintenance: true, siteName: config.siteName });
        }

        const keys = (config.apiKeys && config.apiKeys.length > 0) ? config.apiKeys : ["tk_ad30d1e1d46266c3bbb45b067c08e99ebe5392af8e8355591d7682feefcfaa77"];
        const activeKey = keys[Math.floor(Math.random() * keys.length)];

        const domainRes = await fetch('https://api.cybertemp.xyz/api/domains', {
            headers: { 'Authorization': `Bearer ${activeKey}` }
        });
        const domains = await domainRes.json();
        const domainList = Array.isArray(domains) ? domains : (domains.domains || ["cybertemp.xyz"]);
        const domain = domainList[0] || "cybertemp.xyz";

        return res.status(200).json({
            email: `${Math.random().toString(36).substring(2, 10)}@${domain}`,
            siteName: config.siteName || "10-MIN TRASHMAIL",
            description: config.description || "",
            logoUrl: config.logoUrl || "",
            adTop: config.adTop || "",
            adBottom: config.adBottom || "",
            footerText: config.footerText || "",
            announcement: config.announcement || "",
            showAnnouncement: config.showAnnouncement || false
        });
    } catch (e) {
        return res.status(200).json({ 
            email: "retry@cybertemp.xyz", 
            siteName: "TRASHMAIL", 
            description: "Temporary Email Service" 
        });
    }
}
