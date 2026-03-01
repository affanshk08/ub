import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [newMenu, setNewMenu] = useState({ name: "", category: "", price: "", description: "", isCombo: false });

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/all`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/menu`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenu();
  }, []);

  // --- Order Management ---
  const updateStatus = async (id, field, value) => {
    const order = orders.find(o => o._id === id);
    const body = field === 'cooking' 
      ? { cookingStatus: value, paymentStatus: order.paymentStatus }
      : { paymentStatus: value, cookingStatus: order.cookingStatus };

    try {
      await fetch(`${API_URL}/api/orders/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      fetchOrders(); 
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // --- Menu Management ---
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/admin/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMenu),
      });
      setNewMenu({ name: "", category: "", price: "", description: "", isCombo: false });
      fetchMenu();
    } catch (err) {
      console.error("Failed to add menu item:", err);
    }
  };

  const deleteMenu = async (id) => {
    try {
      await fetch(`${API_URL}/api/admin/menu/${id}`, { method: "DELETE" });
      fetchMenu();
    } catch (err) {
      console.error("Failed to delete menu item:", err);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <header className="admin-header">
        <p className="editorial-label">UB CATERING COMMAND</p>
        <h1>KITCHEN DASHBOARD</h1>
        <div className="tab-buttons">
          <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>Manage Orders</button>
          <button onClick={() => setActiveTab("menu")} className={activeTab === "menu" ? "active" : ""}>Manage Menu</button>
        </div>
      </header>

      <div className="admin-content">
        {activeTab === "orders" ? (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>ITEMS</th>
                  <th>TOTAL PRICE</th>
                  <th>COOKING STATUS</th>
                  <th>PAYMENT</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="customer-cell">{order.userName}<br/><small>{order.phoneNumber}</small></td>
                      <td className="dish-cell">
                        <ul>
                          {order.items && order.items.map((item, idx) => (
                            <li key={idx}>{item.dishName} ({item.personCount} pax)</li>
                          ))}
                        </ul>
                      </td>
                      <td>₹{order.totalPrice}</td>
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
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>NO ORDERS YET</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="menu-management-wrapper">
            <form onSubmit={handleMenuSubmit} className="menu-form">
              <h3>Add New Menu Item</h3>
              <input type="text" placeholder="Dish Name" value={newMenu.name} onChange={e => setNewMenu({...newMenu, name: e.target.value})} required />
              <input type="text" placeholder="Category" value={newMenu.category} onChange={e => setNewMenu({...newMenu, category: e.target.value})} required />
              <input type="number" placeholder="Price" value={newMenu.price} onChange={e => setNewMenu({...newMenu, price: e.target.value})} required />
              <label>
                <input type="checkbox" checked={newMenu.isCombo} onChange={e => setNewMenu({...newMenu, isCombo: e.target.checked})} />
                Is Wedding Combo?
              </label>
              <button type="submit">Add Item</button>
            </form>

            <div className="menu-list">
              <h3>Current Menu</h3>
              <ul>
                {menuItems.map(item => (
                  <li key={item._id}>
                    {item.name} - ₹{item.price} ({item.category})
                    <button onClick={() => deleteMenu(item._id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;