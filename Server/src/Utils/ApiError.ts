class ApiError extends Error {
    public statusCode: number;
    public message: string;
    public success: false;
    public errors: unknown[]

    constructor(
        statusCode: number,
        message: string = "Something went Wrong",
        errors: unknown[] = [],
        stack?: string

    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export{ApiError}