import dbConnect from '../lib/db';
import Config from '../models/Config';

export default async function handler(req, res) {
    const { email } = req.query;
    await dbConnect();
    const config = await Config.findOne();
    const keys = config?.apiKeys || ["tk_ad30d1e1d46266c3bbb45b067c08e99ebe5392af8e8355591d7682feefcfaa77"];

    for (let key of keys) {
        try {
            const response = await fetch(`https://api.cybertemp.xyz/api/emails?email=${encodeURIComponent(email)}`, {
                headers: { 'Authorization': `Bearer ${key}` }
            });
            if (response.ok) {
                const data = await response.json();
                return res.status(200).json(Array.isArray(data) ? data : (data.emails || []));
            }
        } catch (e) { continue; }
    }
    return res.status(200).json([]);
}
