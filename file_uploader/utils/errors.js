export class AppError extends Error {
  constructor(message, statusCode = 500, code="APP_ERROR", details=null) {
    super(message); //calls --> new Error(message)
    this.name = this.constructor.name; /*
    this.constructor refers to the class that was used to create this instance 
    this.statusCode = statusCode;
    Similar to: const err = new Error("Something went wrong");
    You're calling the constructor function of the Error class. It sets up:

    The .message property
    The .name (default is "Error")
    The .stack trace
    */
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor); //A stack trace shows the path your code took when an error occurred. It lists the sequence of function calls that led to the error — from top-level code down to the exact line that threw it
    this.details = details; //custom variable
  }
};
//For query related errors
export class PrismaError extends AppError {
  constructor(message = "Database Error", statusCode = 500, code = "DB_ERROR", details=null) {
    super(message, statusCode, code, details);
  }
};
//For authentication errors
export class AuthError extends AppError {
  constructor(message = "Authentication Error", statusCode = 500, code = "AUTH_ERROR", details=null){
    super(message, statusCode, code, details);
  }
}
//For express validator errors
export class ExpressValError extends AppError {
  constructor(message = "Express Validator Error", statusCode = 400, code = "EXPRESS_VAL_ERROR", details=null){
    super(message, statusCode, code, details);
  }
}
//For multer file upload errors
export class FileUploadError extends AppError {
  constructor(message = "File Upload Error", statusCode = 400, code = "MULTER_FILE_UPLOAD_ERROR", details=null){
    super(message, statusCode, code, details);
  }
}