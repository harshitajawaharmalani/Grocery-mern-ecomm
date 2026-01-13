import express from "express";
import { deleteProduct } from '../controller/product.controller.js';

import { authSeller } from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  getProductById,
  getProducts,
  searchProductsController,
  updateProduct
} from "../controller/product.controller.js";
import { upload } from "../config/multer.js";
const router = express.Router();

router.post("/add-product", authSeller, upload.array("image", 4), addProduct);

router.post('/update-product', authSeller, upload.array("image", 4), updateProduct);
router.get("/list", getProducts);
router.get("/id", getProductById);
router.post("/stock", authSeller, changeStock);
router.get('/search', searchProductsController);
router.post('/delete', deleteProduct);

// backend/routes/productRoute.js

// ... other imports like express and your Product model ...

// Update Product Route
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // findByIdAndUpdate takes the ID, the new data (req.body), 
    // and { new: true } to return the modified document
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/product-info', async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


export default router;