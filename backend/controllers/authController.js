import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController =async(req,res)=>{
    try {
        const {name,email,password,phone,address,answer} = req.body;
        //validation
        if(!name){
            return res.send({message:'Name is required'});
        }
        if(!email){
            return res.send({message:'Email is required'});
        }if(!password){
            return res.send({message:'Password is required'});
        }if(!address){
            return res.send({message:'Address is required'});
        }if(!phone){
            return res.send({message:'Phone is required'});
        }if(!answer){
            return res.send({message:'Answer is required'});
        }

        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"User Already Register Please Login"
            })
        }

        const hashedPassword = await hashPassword(password);

        const user = await new userModel({name,email,address,phone,password:hashedPassword,answer}).save();

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


export const forgetPasswordController= async (req,res)=>{
    try {
        const {email,answer,newpassword}= req.body;
        if(!email){
            res.status(404).send({message:"Email is required"})
        }
        if(!answer){
            res.status(404).send({message:"Question is required"})
        }
        if(!newpassword){
            res.status(404).send({message:"New password is required"})
        }

        const user = await userModel.findOne({email,answer});
        if(!user){
            return res.status(404).send({
                message:"Wrong email or password",
                success:false
            })
        }

        const hashed = await hashPassword(newpassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"Password Reset Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            message:"something went wrong",
            success:false,
            error
        })
    }
}