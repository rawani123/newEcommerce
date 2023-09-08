import Express  from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController } from "../controllers/productController.js";


const router = Express.Router();

router.post("/create-product",requireSignIn,isAdmin,createProductController)