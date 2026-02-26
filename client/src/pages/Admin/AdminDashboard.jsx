import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/orders/all");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, field, value) => {
    const order = orders.find(o => o._id === id);
    const body = field === 'cooking' 
      ? { cookingStatus: value, paymentStatus: order.paymentStatus }
      : { paymentStatus: value, cookingStatus: order.cookingStatus };

    try {
      await fetch(`http://127.0.0.1:5000/api/orders/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      fetchOrders(); // Refresh the list
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <header className="admin-header">
        <p className="editorial-label">UB CATERING COMMAND</p>
        <h1>KITCHEN DASHBOARD</h1>
      </header>

      <div className="admin-content">
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>DISH</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>COOKING STATUS</th>
                <th>PAYMENT</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="customer-cell">{order.userName}</td>
                    <td className="dish-cell">{order.dishName}</td>
                    <td>{order.category}</td>
                    <td>₹{order.price}</td>
                    <td>
                      <select 
                        value={order.cookingStatus} 
                        onChange={(e) => updateStatus(order._id, 'cooking', e.target.value)}
                        className={`status-select ${order.cookingStatus.toLowerCase()}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Cooking">Cooking</option>
                        <option value="Ready">Ready</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        value={order.paymentStatus} 
                        onChange={(e) => updateStatus(order._id, 'payment', e.target.value)}
                        className={`payment-select ${order.paymentStatus.toLowerCase()}`}
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>NO ORDERS YET</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;