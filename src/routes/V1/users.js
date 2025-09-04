import express, { json, response } from 'express'

const router=express.Router()
router.get('/',(req,res)=>{
     return res.status(200).json({Message:"Rohit Chaudhary"})
})
export default router;