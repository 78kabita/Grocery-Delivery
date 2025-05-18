import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const Orders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders.reverse()); // latest orders first
  }, []);

  // Handler to delete an order by index
  const handleDelete = (indexToDelete) => {
    const updatedOrders = orders.filter((_, idx) => idx !== indexToDelete);
    setOrders(updatedOrders);

    // Save the updated list reversed back to localStorage (oldest first)
    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders.slice().reverse())
    );
  };

  if (orders.length === 0) {
    return <p className="text-center mt-10">No orders found.</p>;
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300 relative"
          >
            {/* Item list */}
            <div className="flex gap-5 max-w-80">
              <img
                className="w-12 h-12 object-cover"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <p className="font-medium">
                      {item.name}{" "}
                      <span className="text-primary">x {item.quantity}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Address block (if available) */}
            <div className="text-sm md:text-base text-black/60">
              {order.address ? (
                <>
                  <p className="text-black/80">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>
                    {order.address.street}, {order.address.city}
                  </p>
                  <p>
                    {order.address.state}, {order.address.zipcode},{" "}
                    {order.address.country}
                  </p>
                  <p>{order.address.phone}</p>
                </>
              ) : (
                <p>No address info</p>
              )}
            </div>

            {/* Amount */}
            <p className="font-medium text-lg my-auto">
              {currency}
              {order.totalAmount}
            </p>

            {/* Meta Info */}
            <div className="flex flex-col text-sm md:text-base text-black/60">
              <p>Method: {order.paymentMethod}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm font-semibold"
              aria-label={`Delete order ${index + 1}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
