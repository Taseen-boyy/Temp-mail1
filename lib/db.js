import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://l5afjd:h2r7qd@cluster0.tpa872p.mongodb.net/?retryWrites=true&w=majority";

let cached = global.mongoose || { conn: null, promise: null };

export default async function dbConnect() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then(m => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
