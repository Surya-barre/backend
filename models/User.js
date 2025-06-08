import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Make email unique
  password: { type: String, required: true },
  image: { type: String },
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
