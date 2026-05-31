import dbConnect from '../lib/db';
import Config from '../models/Config';

export default async function handler(req, res) {
    const { email } = req.query;
    await dbConnect();
    const config = await Config.findOne();
    const keys = (config?.apiKeys && config.apiKeys.length > 0) ? config.apiKeys : [
        "tk_184f7389c354566088aab768da2e663f7ddd0bc853fea78143e33ab623e45406",
        "tk_960ab5108eca73e6140ffb8ce3b624d493479de16249e5794ffb757486f93324",
        "tk_bc1a66a599e5af21c8b79cebf0dfa4434e2d7f99f5201962449126c5b997d17a"
    ];

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
