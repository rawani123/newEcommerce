import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController =async(req,res)=>{
    try {
        const {name,email,password,phone,address,} = req.body;
        //validation
        if(!name){
            return res.send({error:'Name is required'});
        }
        if(!email){
            return res.send({error:'Email is required'});
        }if(!password){
            return res.send({error:'Password is required'});
        }if(!address){
            return res.send({error:'Address is required'});
        }if(!phone){
            return res.send({error:'Phone is required'});
        }

        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.status(200).send({
                success:true,
                message:"User Already Register Please Login"
            })
        }

        const hashedPassword = await hashPassword(password);

        const user = await new userModel({name,email,address,phone,password:hashedPassword}).save();

        res.status(200).send({
            success:true,
            message:"user regieter succesfully",
            user,
        })
    } catch (error) {
    console.log(error);
        res.status(500).send({
            success:false,
            message:'error in resistration',
            error
        })
    }
}


export const loginController = async(req,res) =>{
    try {
        const {password,email}= req.body;
        if (!email || !password){
            res.status(404).send({
                success:false,
                message:"Invalid email or password"
            });
        }

        const user = await userModel.findOne({email});
        if(!user){
            res.status(404).send({
                success:false,
                message:'Email is not registered'
            })
        }

        const match = await comparePassword(password,user.password);
        if(!match){
            res.status(200).send({
                success:false,
                message:"Invalid password",
            })
        }

        const token =  JWT.sign({_id:user._id},process.env.JWT_Secret,{expiresIn :"7d",});
        res.status(200).send({
            success:true,
            message:'login succesfully',
            user:{
                name:user.name,
                email:user.email,
                address:user.address,
                phone:user.phone,
            },
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })
    }
}

export const testController=(req,res)=>{
    console.log("protectes rout");
    res.status(200).send({
        message:"Protected Route",
    })
}
