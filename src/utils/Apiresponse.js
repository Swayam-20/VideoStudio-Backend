class Apiresponse{
    constructor(statuscode,data,message="success"){
        this.statuscode = statuscode;
        this.data = data || null;
        this.message = message;
        this.success = statuscode<400;
    }
}
export default Apiresponse;