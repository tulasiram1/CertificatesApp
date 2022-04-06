class AppError extends Error {
    constructor(statusCode, status, message) {
        super(message);
        this.statusCode = statusCode
        this.stack = status

        this.isOperational
    }
}

module.exports = AppError;