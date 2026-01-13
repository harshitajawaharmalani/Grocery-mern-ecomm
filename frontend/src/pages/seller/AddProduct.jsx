import { assets, categories } from "../../assets/assets";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
const AddProduct = () => {
  const { axios } = useContext(AppContext);
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data } = await axios.post("/api/product/product-info", { id });
        if (data.success) {
          const p = data.product;
          setName(p.name);
          setDescription(p.description);
          setCategory(p.category);
          setPrice(p.price);
          setOfferPrice(p.offerPrice);
          
          // FIX 2: Store the product images from database
          // Ensure your backend returns the image array (e.g., p.image or p.images)
          setExistingImages(p.image || []); 
        }
      } catch (error) {
        toast.error("Failed to load product data");
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id, axios]);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      if (id) formData.append("id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);

      for (let i = 0; i < files.length; i++) {
        formData.append("image", files[i]);
      }

      const url = id ? "/api/product/update-product" : "/api/product/add-product";
      const { data } = await axios.post(url, formData);
      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                  className="max-w-24 cursor-pointer border rounded-md"
                  src={
                  files[index]
                  ? URL.createObjectURL(files[index]) // Show new upload preview
                  : existingImages[index] 
                  ? `http://localhost:5000/images/${existingImages[index]}` // Show existing product image
                  : assets.upload_area // Show default placeholder
                  }
                  alt="uploadArea"
                  />
                </label>
              ))}
          </div>
          {id && <p className="text-xs text-gray-400 mt-1">* Uploading new images will replace old ones</p>}
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          ></textarea>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option value={category.path} key={index}>
                {category.path}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        <button className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded">
          ADD
        </button>
        <button className="w-full px-8 py-2.5 bg-indigo-500 text-white font-medium rounded hover:bg-indigo-600 transition-colors">
          {id ? "UPDATE PRODUCT" : "ADD PRODUCT"}
        </button>
      </form>
    </div>
  );
};
export default AddProduct;