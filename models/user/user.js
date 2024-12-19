import mongoose from "mongoose";
import bcrypt from "bcrypt"

const  userSchema= new mongoose.Schema({
    name:{ type:String,required:[true,"name is required"],},
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/^\S+@\S+\.\S+$/,"please enter valid email"],
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone number is required"],
        unique: true,
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
      },
      
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"password must be  6 characters"],

    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    
})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})


userSchema.methods.matchPassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

const User = mongoose.model("User",userSchema);
export default User
