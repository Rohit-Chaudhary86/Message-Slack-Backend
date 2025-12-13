import express from 'express'

import { signIn,signUp } from '../../controllers/userController.js';
import { userSignInSchema, userSignupSchema } from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router=express.Router()
router.post('/signup',validate(userSignupSchema),signUp)
router.post('/signin',validate(userSignInSchema),signIn)
router.get('/',(req,res)=>{
   return res.status(200).json({message:'GET'})
});
export default router;