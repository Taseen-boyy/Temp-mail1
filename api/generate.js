import dbConnect from '../lib/db';
import Config from '../models/Config';

export default async function handler(req, res) {
    await dbConnect();
    // কাউন্টার আপডেট করা
    const config = await Config.findOneAndUpdate({}, { $inc: { totalEmailsGenerated: 1 } }, { upsert: true, new: true });

    if (config.maintenance) return res.status(503).json({ maintenance: true });

    const keys = config.apiKeys.length > 0 ? config.apiKeys : ["tk_184f7389c354566088aab768da2e663f7ddd0bc853fea78143e33ab623e45406"];
    const activeKey = keys[Math.floor(Math.random() * keys.length)];

    try {
        const response = await fetch('https://api.cybertemp.xyz/api/domains', {
            headers: { 'Authorization': `Bearer ${activeKey}` }
        });
        const domains = await response.json();
        const domain = Array.isArray(domains) ? domains[0] : (domains.domains[0] || "cybertemp.xyz");
        
        return res.status(200).json({ 
            email: `${Math.random().toString(36).substring(2, 10)}@${domain}`,
            siteData: config 
        });
    } catch (e) {
        return res.status(200).json({ email: "error@cybertemp.xyz" });
    }
}
