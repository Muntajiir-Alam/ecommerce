import mongoose from "mongoose";
import AppResponse from "../utils/appResponse.js";

const getHealth = (req, res) => {
    const dbStatus =
        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    return new AppResponse(200, 'Server is healthy', {
        database: dbStatus,
        timestamp: new Date().toISOString(),
    }).send(res);
}

export default getHealth;