import express from "express";
import {registerController,loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register',registerController);

router.post('/login', loginController);

//forget password

router.post("/forget-password",forgotPasswordController)

//for testing

router.get('/test',requireSignIn,isAdmin,testController);

//protected auth route
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});

//protected admin route
router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});


router.put("/profile",requireSignIn,updateProfileController);

router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;