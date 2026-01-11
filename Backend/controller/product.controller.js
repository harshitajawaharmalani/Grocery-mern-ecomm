import { uploadOnCloudinary } from "../config/cloudinary.js";
import Product from "../models/product.model.js";


// add product :/api/product/add
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category } = req.body;
    // const image = req.files?.map((file) => `/uploads/${file.filename}`);
    const image = req.files?.map((file) => file.filename);

    // 2. Loop through files and upload each to Cloudinary
    // This creates an array of Cloudinary URLs
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadOnCloudinary(file.path);
        return result?.secure_url; // Use the secure URL from Cloudinary
      })
    );
    
    if (
      !name ||
      !price ||
      !offerPrice ||
      !description ||
      !category ||
      !image ||
      image.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including images are required",
      });
    }


    const product = new Product({
      name,
      price,
      offerPrice,
      description,
      category,
      image,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error while adding product" });
  }
};

// get products :/api/product/get
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get single product :/api/product/id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// change stock  :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }

};

  // search products :/api/product/search?q=query
  export const searchProductsController = async (req, res) => {
    try {
        // 1. Get the search query 'q' from the URL query parameters (e.g., ?q=milk)
        const { q } = req.query; 

        if (!q) {
            // If no search term is provided, return all products or an empty list
            const products = await Product.find({});
            return res.status(200).json({ 
                success: true, 
                message: "No search query provided. Returning all products.",
                count: products.length,
                products 
            });
        }

        // 2. Create the search criteria using MongoDB's $regex
        // 'i' flag ensures the search is case-insensitive
        const searchRegex = new RegExp(q, 'i'); 

        // 3. Query the Product model using $or to search across 'name' and 'description'
        const products = await Product.find({
            $or: [
                { name: { $regex: searchRegex } }, 
                { description: { $regex: searchRegex } },
                { category: { $regex: searchRegex } } // Also search by category for completeness
            ]
        });

        // 4. Send the filtered results back to the frontend
        res.status(200).json({ 
            success: true, 
            message: products.length > 0 ? "Search successful" : "No products found matching your query",
            count: products.length,
            products 
        });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ success: false, message: "Internal server error during product search." });
    }
};

