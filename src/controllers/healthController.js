import mongoose from "mongoose";

const getHealth = (req, res) => {
    const dbStatus =
        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        database: dbStatus,
        timestamp: new Date().toISOString(),
    })
}

export default getHealth;