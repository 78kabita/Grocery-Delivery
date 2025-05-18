import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency } = useAppContext();

  // Load orders from localStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setMyOrders(storedOrders.reverse()); // latest orders first
  }, []);

  // Delete an order by index
  const handleDelete = (indexToDelete) => {
    const updatedOrders = myOrders.filter((_, idx) => idx !== indexToDelete);
    setMyOrders(updatedOrders);

    // Save updated data back to localStorage in original order
    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders.slice().reverse())
    );
  };

  if (myOrders.length === 0) {
    return <p className="text-center mt-10">No orders found.</p>;
  }

  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {myOrders.map((order, index) => (
        <div
          key={index}
          className="relative border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          {/* Delete Order Button */}
          <button
            onClick={() => handleDelete(index)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm font-semibold"
          >
            Delete Order
          </button>

          {/* Order Meta Info */}
          <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
            <span>Order ID: {order._id || "N/A"}</span>
            <span>Payment: {order.paymentType || "N/A"}</span>
            <span>
              Total Amount: {currency}
              {order.totalAmount || order.amount || 0}
            </span>
          </p>

          {/* Each Product in the Order */}
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white text-gray-500/70 ${
                order.items.length !== idx + 1 ? "border-b" : ""
              } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16`}
            >
              {/* Product Info */}
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-primary/10 p-4 rounded-lg">
                  {item.product?.image?.[0] || item.image ? (
                    <img
                      src={item.product?.image?.[0] || item.image}
                      alt={item.product?.name || item.name || "Product"}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium text-gray-800">
                    {item.product?.name || item.name || "Unnamed Product"}
                  </h2>
                  <p>Category: {item.product?.category || "N/A"}</p>
                </div>
              </div>

              {/* Order Info */}
              <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                <p>Quantity: {item.quantity || 1}</p>
                <p>Status: {order.status || "Processing"}</p>
                <p>
                  Date:{" "}
                  {new Date(order.createdAt || order.date).toLocaleDateString()}
                </p>
              </div>

              {/* Price */}
              <p className="text-primary text-lg font-medium">
                Amount: {currency}
                {item.product?.offerPrice
                  ? item.product.offerPrice * item.quantity
                  : item.price
                  ? item.price * item.quantity
                  : 0}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
