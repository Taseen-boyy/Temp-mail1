const fetch = require('node-fetch');

export default async function handler(req, res) {
    // সরাসরি আপনার API Key গুলো এখানে দেওয়া হলো
    const keys = [
        "tk_ad30d1e1d46266c3bbb45b067c08e99ebe5392af8e8355591d7682feefcfaa77",
        "tk_1bdd15ac81eff1414dcea0ebc128e0edc3a614af49e34b3a8957a12ac97ae91a",
        "tk_10c69c82dc5f135a74e13ac285874560ad4f224dc922e22a674cb5fc3b2373da"
    ];

    // রেন্ডমলি একটি কি সিলেক্ট করা যাতে লিমিট শেষ না হয়
    const activeKey = keys[Math.floor(Math.random() * keys.length)];

    try {
        const domainRes = await fetch('https://api.cybertemp.xyz/api/domains', {
            headers: { 'Authorization': `Bearer ${activeKey}` }
        });

        const domains = await domainRes.json();
        
        // ডোমেইন লিস্ট থেকে প্রথমটি নেওয়া
        const domainList = Array.isArray(domains) ? domains : domains.domains;
        const selectedDomain = domainList[0];
        
        // রেন্ডম ইউজারনেম তৈরি
        const username = Math.random().toString(36).substring(2, 10);
        const fullEmail = `${username}@${selectedDomain}`;

        return res.status(200).json({ email: fullEmail });
    } catch (e) {
        return res.status(500).json({ error: "API connection failed", details: e.message });
    }
}
