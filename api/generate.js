export default async function handler(req, res) {
    const keys = [
        "tk_ad30d1e1d46266c3bbb45b067c08e99ebe5392af8e8355591d7682feefcfaa77",
        "tk_1bdd15ac81eff1414dcea0ebc128e0edc3a614af49e34b3a8957a12ac97ae91a",
        "tk_10c69c82dc5f135a74e13ac285874560ad4f224dc922e22a674cb5fc3b2373da"
    ];

    const activeKey = keys[Math.floor(Math.random() * keys.length)];

    try {
        const response = await fetch('https://api.cybertemp.xyz/api/domains', {
            headers: { 'Authorization': `Bearer ${activeKey}` }
        });

        const domains = await response.json();
        
        // ডোমেইন চেক করা
        let domain = "cybertemp.xyz"; // Default fallback
        if (Array.isArray(domains) && domains.length > 0) {
            domain = domains[0];
        } else if (domains.domains && domains.domains.length > 0) {
            domain = domains.domains[0];
        }

        const username = Math.random().toString(36).substring(2, 10);
        const fullEmail = `${username}@${domain}`;

        return res.status(200).json({ email: fullEmail });
    } catch (e) {
        // যদি API পুরোপুরি ফেইল করে, তবুও একটি ডামি ইমেইল দিবে যাতে undefined না দেখায়
        const username = Math.random().toString(36).substring(2, 10);
        return res.status(200).json({ email: `${username}@cybertemp.xyz` });
    }
}
