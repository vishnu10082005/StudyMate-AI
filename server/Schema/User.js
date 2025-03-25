import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    googleId: String
});
const User = mongoose.model("User", UserSchema);
export default User ;