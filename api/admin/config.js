import dbConnect from '../../lib/db';
import Config from '../../models/Config';

export default async function handler(req, res) {
    await dbConnect();
    const { password, action, data } = req.body;
    
    if (password !== "1234ayon") return res.status(401).json({ error: "Unauthorized" });

    if (action === 'get') {
        let config = await Config.findOne();
        if (!config) config = await Config.create({});
        return res.status(200).json(config);
    }

    if (action === 'update') {
        // এই লাইনটি ডাটাবেসে সব ডাটা আপডেট নিশ্চিত করবে
        await Config.findOneAndUpdate({}, data, { upsert: true, new: true });
        return res.status(200).json({ success: true });
    }
}
