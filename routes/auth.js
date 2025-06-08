import express from 'express';
import { Register ,upload,signin, verify} from '../controllers/Register.js';
 
import verifyUser from '../middleware/verifyUser.js';
 
 
const router=express.Router();
router.post('/register',upload.single('image'),Register);
router.post('/login',signin)
router.post('/verify',verifyUser,verify)
 
 export default router;