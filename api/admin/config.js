import dbConnect from '../../lib/db';
import Config from '../../models/Config';

export default async function handler(req, res) {
    await dbConnect();
    const { password, action, data } = req.body;
    
    if (password !== "1234ayon") return res.status(401).json({ error: "Unauthorized" });

    if (action === 'get') {
        const config = await Config.findOne() || await Config.create({});
        return res.status(200).json(config);
    }
    if (action === 'update') {
        await Config.findOneAndUpdate({}, data, { upsert: true });
        return res.status(200).json({ success: true });
    }
}
