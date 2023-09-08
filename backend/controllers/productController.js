import productModel from "../models/productModel.js";
import fs from 'fs';

 export const createProductController = async(req,res)=>{
    try {
        const {name,slug,description,price,category,quantity,shipping}= req.fields;
        const {photo}=req.files;
        const product = await productModel
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes:false,
            message:"Error while creating product",
            error
        })
    }
}