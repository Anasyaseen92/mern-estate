export const errorHandler =(statusCode,message)=>{
const error = error();
error.statusCode= statusCode;
error.message=message;
return error;
};