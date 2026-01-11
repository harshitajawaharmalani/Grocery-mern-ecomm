import { useContext, useEffect, useState } from "react";
import { AppContext, useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const boxIcon =
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";

  const [orders, setOrders] = useState([]);
  const { axios } = useContext(AppContext);
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

const statusHandler = async (event, orderId) => {
  const newStatus = event.target.value;

  try {
    const { data } = await axios.post("/api/order/status", {
      orderId,
      status: newStatus,
    });

    if (data.success) {
      toast.success(data.message);
      // Refresh the orders list so the 'value={order.status}' updates to the new one
      await fetchOrders(); 
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>
      {orders.map((order, index) => (
        <div
          key={index}
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800"
        >
          <div className="flex gap-5">
            <img
              className="w-12 h-12 object-cover opacity-60"
              /* CHANGED: Added ?. and fallback to boxIcon to prevent crash if product/image is null */
              src={order.items?.[0]?.product?.image?.[0] 
                ? `http://localhost:5000/images/${order.items[0].product.image[0]}` 
                : boxIcon} 
              alt="boxIcon"
            />
            <>
              {order.items.map((item, index) => (
                <div key={index} className="flex flex-col justify-center">
                  <p className="font-medium">
                    {/* CHANGED: Added ?. and fallback text to prevent crash if product is null */}
                    {item.product?.name || "Product Unavailable"}{" "}
                    <span
                      className={`text-indigo-500 ${
                        item.quantity < 2 && "hidden"
                      }`}
                    >
                      x {item.quantity}
                    </span>
                  </p>
                </div>
              ))}
            </>
          </div>

          <div className="text-sm">
            <p className="font-medium mb-1">
              {/* CHANGED: Added ?. just in case address is missing */}
              {order.address?.firstName} {order.address?.lastName}
            </p>
            <p>
              {order.address?.street}, {order.address?.city},{" "}
              {order.address?.state},{order.address?.zipcode},{" "}
              {order.address?.country}
            </p>
          </div>

          <p className="font-medium text-base my-auto text-black/70">
            ${order.amount}
          </p>

          <div className="flex flex-col text-sm">
            <p>Method: {order.paymentType}</p>
            <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>
            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            <select
  className="p-2 font-semibold text-sm border border-gray-300 rounded bg-white"
  value={order.status}
  onChange={(e) => statusHandler(e, order._id)}
>
  <option value="Order Placed">Order Placed</option>
  <option value="Processing">Processing</option>
  <option value="Shipped">Shipped</option>
  <option value="Out for delivery">Out for delivery</option>
  <option value="Delivered">Delivered</option>
</select>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Orders;