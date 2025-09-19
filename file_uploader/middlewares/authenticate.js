import { AuthError } from "../utils/errors.js";

export function checkAuthentication (req,res,next) {
    try{
        if(req.isAuthenticated && req.isAuthenticated()) {
            return next();
        }
        //if failed
        console.error("Authentication Error: User not authenticated");
        throw new AuthError("Failed Authentication", 401, "AUTH_FAILED", {
            detail: "You are not authenticated, please login!",
        });
    } catch(err){
        next(err); //proceed to error handling middleware
    }
}

export function checkAdminAccess (req,res,next) {
    try{
        if(req.isAuthenticated && req.isAuthenticated() && req.user.role === 'ADMIN') {
            return next();
        }
        //if failed
        console.error("Authentication Error: User does not have admin access");
        throw new AuthError("Failed Admin Access Authentication", 401, "ADMIN_AUTH_FAILED", {
            detail: "You are not recognized as an admin, please contact your admin!",
        });
    } catch(err){
        next(err); //proceed to error handling middleware
    }
}