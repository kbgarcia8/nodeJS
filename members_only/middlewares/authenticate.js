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