import mongoose  from "mongoose";

const connectDb = async()=>{
    try {
        const connect =await mongoose.connect("mongodb+srv://ASP:ASP123@spyzy.cr7opeb.mongodb.net/nodejs")
        console.log("connected db".bgMagenta.green);
    } catch (error) {
        console.log("mongodb connection fail".bgBlue.red);
    }

}
export default connectDb;