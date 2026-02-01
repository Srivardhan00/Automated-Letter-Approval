import { ApiError } from "../Utils/ApiError.js";

export const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, "Unauthorized: User not found"));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, "Access denied: Insufficient permissions"));
        }
        next();
    };
};
