const fetch = require('node-fetch');

export default async function handler(req, res) {
    const keys = [
        process.env.CYBERTEMP_KEY_1,
        process.env.CYBERTEMP_KEY_2,
        process.env.CYBERTEMP_KEY_3
    ];

    // Try keys in random order for load balancing
    const shuffledKeys = keys.sort(() => 0.5 - Math.random());

    for (let key of shuffledKeys) {
        try {
            const domainRes = await fetch('https://api.cybertemp.xyz/api/domains', {
                headers: { 'Authorization': `Bearer ${key}` }
            });

            if (domainRes.status === 200) {
                const domains = await domainRes.json();
                const domain = Array.isArray(domains) ? domains[0] : domains.domains[0];
                const prefix = Math.random().toString(36).substring(2, 10);
                return res.status(200).json({ email: `${prefix}@${domain}` });
            }
        } catch (e) { continue; }
    }
    res.status(503).json({ error: "All keys throttled" });
          }
