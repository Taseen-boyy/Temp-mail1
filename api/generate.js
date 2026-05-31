import dbConnect from '../lib/db';
import Config from '../models/Config';

export default async function handler(req, res) {
    try {
        await dbConnect();
        let config = await Config.findOne();
        
        // ১. ডিফল্ট সেটিংস যদি ডাটাবেস কানেক্ট না হয়
        const siteName = config?.siteName || "10-MIN TRASHMAIL";
        const keys = (config?.apiKeys && config.apiKeys.length > 0) 
                     ? config.apiKeys 
                     : ["tk_ad30d1e1d46266c3bbb45b067c08e99ebe5392af8e8355591d7682feefcfaa77"];

        const activeKey = keys[Math.floor(Math.random() * keys.length)];

        // ২. CyberTemp API থেকে ডোমেইন আনা
        const response = await fetch('https://api.cybertemp.xyz/api/domains', {
            headers: { 'Authorization': `Bearer ${activeKey}` },
            method: 'GET'
        });

        let domain = "cybertemp.xyz"; // Default domain

        if (response.ok) {
            const data = await response.json();
            // ডাটা ফরম্যাট চেক করা (Array না কি Object)
            const domainList = Array.isArray(data) ? data : (data.domains || []);
            if (domainList.length > 0) {
                domain = domainList[0];
            }
        }

        const username = Math.random().toString(36).substring(2, 10);
        const email = `${username}@${domain}`;

        return res.status(200).json({
            email: email,
            siteName: siteName,
            description: config?.description || "Premium Disposable Email Service",
            logoUrl: config?.logoUrl || "",
            adTop: config?.adTop || "",
            adBottom: config?.adBottom || "",
            footerText: config?.footerText || "© 2024 Premium TrashMail",
            announcement: config?.announcement || "",
            showAnnouncement: config?.showAnnouncement || false
        });

    } catch (e) {
        console.error("Generate Error:", e);
        // যদি সব ফেইল করে তবুও কাজ করবে এই নিচের কোডটি
        const fallbackUser = Math.random().toString(36).substring(2, 10);
        return res.status(200).json({ 
            email: `${fallbackUser}@cybertemp.xyz`, 
            siteName: "TRASHMAIL",
            description: "Temporary Email Service"
        });
    }
}
