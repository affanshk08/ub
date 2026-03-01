import React, { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const container = useRef();
  const navigate = useNavigate();

  // --- STATE ---
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("history"); // 'history' | 'settings'
  
  const [editFormData, setEditFormData] = useState({ 
    name: user?.name || "", 
    email: user?.email || "", 
    phone: user?.phone || "", 
    profilePic: user?.profilePic || "" 
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Modals & Alerts State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: "" });
  
  const [customAlert, setCustomAlert] = useState(null); // { type: 'success'|'error', message: string, onClose?: function }
  const [confirmModal, setConfirmModal] = useState(null); // { message: string, onConfirm: function }

  // --- LOAD DATA & PROTECT ROUTE ---
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    const userId = user._id || user.id;

    // FIX: Replaced hardcoded localhost URL
    fetch(`${import.meta.env.VITE_API_URL}/api/orders/user/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setOrders(data);
      })
      .catch(err => console.error("Error fetching orders:", err));
  }, [navigate, user]);

  // --- GSAP ANIMATIONS ---
  useGSAP(() => {
    gsap.from(".profile-sidebar", { x: -30, opacity: 0, duration: 0.6, ease: "power2.out" });
    gsap.from(".profile-main", { y: 30, opacity: 0, duration: 0.6, ease: "power2.out", delay: 0.2 });
  }, { scope: container });

  // --- HANDLERS ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(editFormData)
      });
      const updatedUser = await res.json();
      
      if(res.ok) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCustomAlert({ type: "success", message: "Profile updated successfully!" });
      } else {
        setCustomAlert({ type: "error", message: updatedUser.message || "Failed to update profile." });
      }
    } catch (err) {
      console.error(err);
      setCustomAlert({ type: "error", message: "A network error occurred while updating." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData({ ...editFormData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoutRequest = () => {
    setConfirmModal({
      message: "Are you sure you want to log out?",
      onConfirm: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  const submitFeedback = async () => {
    const token = localStorage.getItem("token");
    try {
      // FIX: Replaced hardcoded localhost URL
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${selectedOrderId}/feedback`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(feedbackData)
      });
      
      if(res.ok) {
        setFeedbackModalOpen(false);
        setCustomAlert({ type: "success", message: "Thank you for your feedback! It helps us improve." });
        setFeedbackData({ rating: 5, comment: "" });
        
        setOrders(orders.map(order => 
          order._id === selectedOrderId 
            ? { ...order, hasFeedback: true, feedback: feedbackData } 
            : order
        ));
      } else {
        setCustomAlert({ type: "error", message: "Something went wrong while submitting feedback. Please try again." });
      }
    } catch (err) {
      console.error(err);
      setCustomAlert({ type: "error", message: "Network error occurred." });
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page-wrapper" ref={container}>
      
      <header className="profile-header">
        <h1>MY ACCOUNT</h1>
      </header>

      <div className="profile-layout">
        
        {/* --- SIDEBAR --- */}
        <aside className="profile-sidebar">
          <div className="sidebar-user-info">
            <div className="avatar-wrapper">
              <div className="avatar-circle">
                {editFormData.profilePic || user.profilePic ? (
                  <img src={editFormData.profilePic || user.profilePic} alt="Profile" />
                ) : (
                  <span className="initial">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="upload-btn-overlay">
                 <input type="file" accept="image/*" onChange={handleImageUpload} title="Change Profile Picture" />
                 <span>✎ Edit</span>
              </div>
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={activeTab === 'history' ? 'active' : ''} 
              onClick={() => setActiveTab('history')}
            >
              Order History
            </button>
            <button 
              className={activeTab === 'settings' ? 'active' : ''} 
              onClick={() => setActiveTab('settings')}
            >
              Account Settings
            </button>
            <button className="logout-btn" onClick={handleLogoutRequest}>
              Logout
            </button>
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="profile-main">
          
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'history' && (
            <div className="tab-content fade-in">
              <h2>Recent Orders</h2>
              
              <div className="orders-list">
                {orders.length === 0 ? (
                  <div className="empty-state-box">
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/menu" className="solid-btn">EXPLORE MENU</Link>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div className="order-meta">
                          <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                          <span className="order-date">{new Date(order.createdAt).toLocaleDateString()} at {order.orderTime || '12:00'}</span>
                        </div>
                        <span className={`status-badge ${order.status?.toLowerCase() || order.cookingStatus?.toLowerCase()}`}>
                          {order.status || order.cookingStatus}
                        </span>
                      </div>
                      
                      {/* UNIFIED ITEMS DISPLAY */}
                      <div className="order-items-list">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div key={idx} className="archived-item">
                              <span className="item-name">{item.name || item.dishName}</span>
                              <span className="item-details">
                                {item.personCount} Persons <span className="dot">•</span> ₹{item.price}
                              </span>
                            </div>
                          ))
                        ) : (
                          // Fallback for old orders
                          <div className="archived-item">
                            <span className="item-name">{order.dishName}</span>
                            <span className="item-details">{order.personCount} Persons</span>
                          </div>
                        )}
                      </div>

                      <div className="order-logistics-bar">
                        <div className="log-detail">
                          <span className="label">Delivery Method</span>
                          <span>{order.deliveryType ? order.deliveryType.toUpperCase() : 'PICKUP'}</span>
                        </div>
                        <div className="log-detail">
                          <span className="label">Payment</span>
                          <span>{order.paymentMethod ? order.paymentMethod.toUpperCase() : 'ONLINE'}</span>
                        </div>
                        <div className="log-detail total">
                          <span className="label">Grand Total</span>
                          <span className="amount">₹{order.grandTotal || order.totalPrice}</span>
                        </div>
                      </div>

                      <div className="order-actions">
                        {(order.cookingStatus === "Delivered" || order.status === "Delivered") && !order.hasFeedback && (
                          <button 
                            className="outline-btn" 
                            onClick={() => { setSelectedOrderId(order._id); setFeedbackModalOpen(true); }}
                          >
                            RATE ORDER
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="tab-content fade-in">
              <h2>Account Settings</h2>
              
              <div className="settings-card">
                <form className="user-info-form" onSubmit={handleProfileUpdate}>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={editFormData.name} 
                        onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="input-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        value={editFormData.email} 
                        onChange={e => setEditFormData({...editFormData, email: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="input-group">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        value={editFormData.phone} 
                        onChange={e => setEditFormData({...editFormData, phone: e.target.value})} 
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="solid-btn" disabled={isSaving}>
                      {isSaving ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- FEEDBACK MODAL --- */}
      {feedbackModalOpen && (
        <div className="modal-overlay">
          <div className="feedback-modal">
            <button className="close-modal" onClick={() => setFeedbackModalOpen(false)}>✕</button>
            <p className="editorial-label">YOUR OPINION MATTERS</p>
            <h2>RATE YOUR ORDER</h2>
            
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star} 
                  className={`star ${feedbackData.rating >= star ? 'active' : ''}`}
                  onClick={() => setFeedbackData({...feedbackData, rating: star})}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea 
              placeholder="Tell us about your culinary experience..." 
              value={feedbackData.comment}
              onChange={e => setFeedbackData({...feedbackData, comment: e.target.value})}
            ></textarea>

            <button className="solid-btn full-width" onClick={submitFeedback}>SUBMIT FEEDBACK</button>
          </div>
        </div>
      )}

      {/* --- CUSTOM BRANDED ALERT MODAL --- */}
      {customAlert && (
        <div className="custom-alert-overlay">
          <div className={`custom-alert-box ${customAlert.type}`}>
            <h3>{customAlert.type === "success" ? "SUCCESS" : "ATTENTION"}</h3>
            <p>{customAlert.message}</p>
            <button 
              className="custom-alert-btn" 
              onClick={() => {
                if (customAlert.onClose) customAlert.onClose();
                setCustomAlert(null);
              }}
            >
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      )}

      {/* --- CUSTOM CONFIRM MODAL (LOGOUT) --- */}
      {confirmModal && (
        <div className="custom-alert-overlay">
          <div className="custom-alert-box error">
            <h3>LOGOUT</h3>
            <p>{confirmModal.message}</p>
            <div className="confirm-actions">
              <button className="custom-alert-btn outline" onClick={() => setConfirmModal(null)}>
                CANCEL
              </button>
              <button 
                className="custom-alert-btn" 
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
              >
                YES, LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;