import dbConnect from '../../lib/db';
import Config from '../../models/Config';

export default async function handler(req, res) {
    await dbConnect();
    const { password, action, data } = req.body;
    
    // আপনার দেওয়া পাসওয়ার্ড
    const ADMIN_PASS = "1234ayon";

    if (password !== ADMIN_PASS) return res.status(401).json({ error: "Unauthorized" });

    if (action === 'get') {
        let config = await Config.findOne();
        if (!config) config = await Config.create({ siteName: "10-MIN TRASHMAIL" });
        return res.status(200).json(config);
    }

    if (action === 'update') {
        await Config.findOneAndUpdate({}, data, { upsert: true });
        return res.status(200).json({ success: true });
    }
}
