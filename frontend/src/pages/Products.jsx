import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const Products = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data } = await axios.post("/api/product/productinfo", { id });
        if (data.success) {
          const p = data.product;
          setName(p.name);
          setDescription(p.description);
          setCategory(p.category);
          setPrice(p.price);
          setOfferPrice(p.offerPrice);
          setExistingImages(p.image || []); // Save the old image URLs here
        }
      } catch (error) {
        toast.error("Failed to load product data");
      }
    };
    if (id) fetchProductData();
}, [id, axios]);
  return (
    <div className="mt-16">
      <h1 className="text-3xl lg:text-4xl font-medium">All Products</h1>
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};
export default Products;