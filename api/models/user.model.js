import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
username:{
    type:String,
    required:true,
    unique:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true,
    
}, 
avatar:{
    type:String,
    default:"https://wallpapers.com/images/file/cute-profile-picture-diw8fgkjdz6fq6k7.jpg"
}

},
{timestamps:true});

const User =mongoose.model("User",userSchema);

export default User;