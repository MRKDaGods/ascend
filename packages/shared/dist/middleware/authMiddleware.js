"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
/**
 * Authentices JWT token from bearer token in Authorization header
 *
 * @returns HTTP response
 * - 401 if no token provided
 * - 403 if token is invalid
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token required" });
    }
    try {
        // Verify token and assign to Req::user
        req.user = (0, jwt_1.verifyToken)(token);
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
};
exports.default = authenticateToken;
