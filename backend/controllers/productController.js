import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs';


 export const createProductController = async(req,res)=>{
    try {
        const {name,slug,description,price,category,quantity,shipping}= req.fields;
        const {photo}=req.files;
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is required"});
            case !description:
                return res.status(500).send({error:"Description is required"});
            case !price:
                return res.status(500).send({error:"Price is required"});
            case !category:
                return res.status(500).send({error:"Category is required"});
            case !quantity:
                return res.status(500).send({error:"Quantity is required"});
            case photo && photo.size > 1000000:
                return res.status(500).send({error:"Photo is required and should be less than 1Mb"});
        }
        const products = new productModel({...req.fields,slug:slugify(name)});
        if(photo){
            products.photo.data=fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(200).send({
            succes:true,
            message:"Product created succesfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes:false,
            message:"Error while creating product",
            error
        })
    }
}

export const getProductsController = async(req,res)=>{
    try {
        const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1});
        res.status(200).send({
            succes:true,
            totalCount: products.length,
            message:"All Products",
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes:false,
            message:"Something went Wrong",
            error
        })
    }
}

export const getSingleProductsController=async(req,res)=>{
    try {
        const product = await productModel.findOne({slug : req.params.slug}).select("-photo").populate("category");
        res.status(200).send({
            succes:true,
            message:"Product",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes:false,
            message:"Error while fetching product",
            error
        })
    }
}

export const productPhotoController = async(req,res)=>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set('Content-Type',product.photo.contentType);
            return res.status(200).send(product.photo.data)
        }
       
    } catch (error) {
       console.log(error);
       res.status(500).send({
        succes,
        message:"Error while fetching Photo",
        error
       }) 
    }
}

export const deleteProductController = async(req,res)=>{
    try {
        const product= await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            succes:true,
            message:"Product Deleted Succesfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes:true,
            message:"Error while deleting product",
            error
        })
        
    }
}


export const updateProductController = async(req,res)=>{
    try {
        const {name,slug,description,price,category,quantity,shipping}= req.fields;
        const {photo}=req.files;
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is required"});
            case !description:
                return res.status(500).send({error:"Description is required"});
            case !price:
                return res.status(500).send({error:"Price is required"});
            case !category:
                return res.status(500).send({error:"Category is required"});
            case !quantity:
                return res.status(500).send({error:"Quantity is required"});
            case photo && photo.size > 1000000:
                return res.status(500).send({error:"Photo is required and should be less than 1Mb"});
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields,slug:slugify(name)},
            {new:true});
        if(photo){
            products.photo.data=fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(200).send({
            succes:true,
            message:"Product updated succesfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes:false,
            message:"Error while updating product",
            error
        })
    }
}


export const productFilterController = async(req,res)=>{
    try {
        const {checked,radio}= req.body;
        let args = {};
        if(checked.length > 0) args.category=checked
        if(radio.length) args.price = { $gte:radio[0],$lte:radio[1]};
        const product = await productModel.find(args);
        res.status(200).send({
            succes:true,
            message:"product filtered Succesfully",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes:false,
            message:"Error while filtering the product",
            error
        })
    }
}


export const productCountController = async (req,res)=>{
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            succes:true,
            total
        })
    } catch (error) {
       console.log(error);
       res.status(500).send({
        succes:false,
        message:"Error while Counting Products",
        error
       }) 
    }
}

export const productListController = async(req,res)=>{
    try {
        const perpage=6;
        const page = req.param.page ? req.params.page:1;
        const products = await productModel.find({}).select("-photo").skip((page - 1)* perpage).limit(perpage).sort({createdAt :-1});
        res.status(200).send({
            succes:true,
            message:"Product listed succesfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes:false,
            message:"Error While listing Product",
            error
        })
    }
}

export const productSearchController = async(req,res)=>{
    try {
        const {keyword}=req.params;
        const results = await productModel.find({
            $or:[
                {name:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]
        }).select("-photo");
        res.json(results);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        succes:false,
        message:"Error While searching",
        error
      })  
    }
}