class apiResponse {
    constructor(statusCode, message = "success", data = null) {
        this.message = message
        this.statusCode = statusCode
        this.success = statusCode < 400
        this.data=data
    }
}

export { apiResponse }