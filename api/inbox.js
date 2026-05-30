const fetch = require('node-fetch');

export default async function handler(req, res) {
    const { email } = req.query;
    
    const keys = [
        "tk_ad30d1e1d46266c3bbb45b067c08e99ebe5392af8e8355591d7682feefcfaa77",
        "tk_1bdd15ac81eff1414dcea0ebc128e0edc3a614af49e34b3a8957a12ac97ae91a",
        "tk_10c69c82dc5f135a74e13ac285874560ad4f224dc922e22a674cb5fc3b2373da"
    ];

    const activeKey = keys[Math.floor(Math.random() * keys.length)];

    try {
        const response = await fetch(`https://api.cybertemp.xyz/api/emails?email=${encodeURIComponent(email)}`, {
            headers: { 'Authorization': `Bearer ${activeKey}` }
        });

        const data = await response.json();
        // মেসেজ থাকলে লিস্ট পাঠাবে, না থাকলে খালি এরে []
        return res.status(200).json(data.emails || data);
    } catch (e) {
        return res.status(500).json({ error: "Inbox fetch failed" });
    }
}
