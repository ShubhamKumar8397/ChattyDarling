class ApiResponse{
    public message : string
    public data : any = ""
    public statusCode : number
    public success : true
    constructor(
        message : string = "Data Fetched Successfully",
        data : any ,
        statusCode : number
    ){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = true
    }
}

export {ApiResponse}