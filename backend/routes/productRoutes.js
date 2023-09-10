import Express  from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getProductsController, getSingleProductsController, productCountController, productFilterController, productListController, productPhotoController, productSearchController, updateProductController } from "../controllers/productController.js";
import formidable from "express-formidable";


const router = Express.Router();

router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController);

router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController);

router.get("/get-product",getProductsController);

router.get("/get-product/:slug",getSingleProductsController);

router.get("/product-photo/:pid",productPhotoController);

router.delete("/delete-product/:pid",deleteProductController);

router.post("/product-filter",productFilterController)

router.get("/product-count",productCountController)

router.get("/product-list/:page",productListController);

router.get("/search/:keyword",productSearchController)

export default router;