import UserModel from "../models/User.js";

const users = async (req, res) => {
  try {
    const loginUser = req.user._id; 
    const searchQuery = req.query.search || ""; // Get search input from query params
 
    const allUsers = await UserModel.find({
      _id: { $ne: loginUser }, // Exclude logged-in user
      username: { $regex: `^${searchQuery}`, $options: "i" }, // Search by starting letter (case-insensitive)
    }).select("-password");

    return res.status(200).json({ msg: "success", users: allUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

export default users;
