class AppResponse {
    constructor(statusCode = 200, message = 'Success', data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = true;
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
        });
    }

    static success(res, message = 'Success', data = null, statusCode = 200) {
        return new AppResponse(statusCode, message, data).send(res);
    }
}

export default AppResponse;