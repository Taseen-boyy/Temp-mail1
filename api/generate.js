import dbConnect from '../lib/db';
import Config from '../models/Config';

export default async function handler(req, res) {
    await dbConnect();
    let config = await Config.findOne();
    if (!config) config = await Config.create({ siteName: "10-MIN TRASHMAIL" });

    if (config.maintenance) return res.status(503).json({ error: "Maintenance Mode" });

    const keys = config.apiKeys.length > 0 ? config.apiKeys : ["tk_ad30d1e1d46266c3bbb45b067c08e99ebe5392af8e8355591d7682feefcfaa77"];
    const activeKey = keys[Math.floor(Math.random() * keys.length)];

    try {
        const response = await fetch('https://api.cybertemp.xyz/api/domains', {
            headers: { 'Authorization': `Bearer ${activeKey}` }
        });
        const domains = await response.json();
        const domain = Array.isArray(domains) ? domains[0] : (domains.domains[0] || "cybertemp.xyz");
        const email = `${Math.random().toString(36).substring(2, 10)}@${domain}`;
        
        return res.status(200).json({ 
            email, 
            siteName: config.siteName,
            adTop: config.adTop,
            adBottom: config.adBottom
        });
    } catch (e) {
        return res.status(500).json({ error: "Failed" });
    }
}
