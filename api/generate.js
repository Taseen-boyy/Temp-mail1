import dbConnect from '../lib/db';
import Config from '../models/Config';

export default async function handler(req, res) {
    try {
        await dbConnect();
        // ডাটাবেস থেকে সেটিংস আনা
        let config = await Config.findOne();
        
        // যদি ডাটাবেসে কিছু না থাকে তবে ডিফল্ট সেটিংস
        const siteName = config?.siteName || "10-MIN TRASHMAIL";
        const keys = (config?.apiKeys && config.apiKeys.length > 0) 
                     ? config.apiKeys 
                     : ["tk_ad30d1e1d46266c3bbb45b067c08e99ebe5392af8e8355591d7682feefcfaa77"];
        
        if (config?.maintenance) {
            return res.status(503).json({ error: "Maintenance Mode", siteName });
        }

        const activeKey = keys[Math.floor(Math.random() * keys.length)];

        const response = await fetch('https://api.cybertemp.xyz/api/domains', {
            headers: { 'Authorization': `Bearer ${activeKey}` }
        });
        
        const domains = await response.json();
        // ডোমেইন চেক করার নিরাপদ পদ্ধতি
        const domainList = Array.isArray(domains) ? domains : (domains.domains || ["cybertemp.xyz"]);
        const domain = domainList[0] || "cybertemp.xyz";
        
        const email = `${Math.random().toString(36).substring(2, 10)}@${domain}`;
        
        return res.status(200).json({ 
            email, 
            siteName: siteName,
            adTop: config?.adTop || "",
            adBottom: config?.adBottom || ""
        });
    } catch (e) {
        console.error(e);
        // একদম ফেইল করলে এই ডাটা পাঠাবে
        return res.status(200).json({ 
            email: `${Math.random().toString(36).substring(2, 10)}@cybertemp.xyz`, 
            siteName: "10-MIN TRASHMAIL" 
        });
    }
}
