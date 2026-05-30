const fetch = require('node-fetch');

export default async function handler(req, res) {
    const { email } = req.query;
    const keys = [process.env.CYBERTEMP_KEY_1, process.env.CYBERTEMP_KEY_2, process.env.CYBERTEMP_KEY_3];
    const shuffledKeys = keys.sort(() => 0.5 - Math.random());

    for (let key of shuffledKeys) {
        try {
            const response = await fetch(`https://api.cybertemp.xyz/api/emails?email=${encodeURIComponent(email)}`, {
                headers: { 'Authorization': `Bearer ${key}` }
            });

            if (response.status === 200) {
                const data = await response.json();
                return res.status(200).json(data);
            }
            if (response.status === 429) continue;
        } catch (e) { continue; }
    }
    res.status(503).json({ error: "Throttled" });
}
