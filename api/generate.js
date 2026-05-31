import dbConnect from '../lib/db';
import Config from '../models/Config';

export default async function handler(req, res) {
    try {
        await dbConnect();
        let config = await Config.findOne();
        
        const siteName = config?.siteName || "10-MIN TRASHMAIL";
        // ডাটাবেসে না থাকলে এই নতুন ৩টি কি ব্যবহার করবে
        const keys = (config?.apiKeys && config.apiKeys.length > 0) 
                     ? config.apiKeys 
                     : [
                        "tk_184f7389c354566088aab768da2e663f7ddd0bc853fea78143e33ab623e45406",
                        "tk_960ab5108eca73e6140ffb8ce3b624d493479de16249e5794ffb757486f93324",
                        "tk_bc1a66a599e5af21c8b79cebf0dfa4434e2d7f99f5201962449126c5b997d17a"
                       ];

        const activeKey = keys[Math.floor(Math.random() * keys.length)];

        const response = await fetch('https://api.cybertemp.xyz/api/domains', {
            headers: { 'Authorization': `Bearer ${activeKey}` }
        });

        let domain = "cybertemp.xyz";
        if (response.ok) {
            const data = await response.json();
            const domainList = Array.isArray(data) ? data : (data.domains || []);
            if (domainList.length > 0) domain = domainList[0];
        }

        const username = Math.random().toString(36).substring(2, 10);
        return res.status(200).json({
            email: `${username}@${domain}`,
            siteName: siteName,
            description: config?.description || "",
            logoUrl: config?.logoUrl || "",
            adTop: config?.adTop || "",
            adBottom: config?.adBottom || "",
            footerText: config?.footerText || "",
            announcement: config?.announcement || "",
            showAnnouncement: config?.showAnnouncement || false
        });
    } catch (e) {
        const u = Math.random().toString(36).substring(2, 10);
        return res.status(200).json({ email: `${u}@cybertemp.xyz`, siteName: "TRASHMAIL" });
    }
}
