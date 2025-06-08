import express from 'express'
import verifyUser from '../middleware/verifyUser.js'
import users from '../controllers/usercontroller.js'
import User from '../models/User.js'
const router=express.Router()
router.get('/',verifyUser,users)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error("Failed to fetch user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router