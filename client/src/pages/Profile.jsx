import React, { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const container = useRef();
  const curtainRef = useRef();
  const navigate = useNavigate();

  // --- STATE ---
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editFormData, setEditFormData] = useState({ 
    name: user?.name || "", 
    email: user?.email || "", 
    phone: user?.phone || "", 
    profilePic: user?.profilePic || "" 
  });
  
  // Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: "" });

  // --- LOAD DATA & PROTECT ROUTE ---
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    // Safely extract the user ID
    const userId = user._id || user.id;

    // Fetch user's order history from backend
    fetch(`http://127.0.0.1:5000/api/orders/user/${userId}`, {
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
    const tl = gsap.timeline();

    // Curtain reveal
    tl.to(curtainRef.current, { scaleX: 0, duration: 0.8, ease: "power3.inOut", transformOrigin: "right" })
      .from(".profile-header h1", { y: 100, opacity: 0, duration: 0.8, ease: "power4.out" }, "-=0.2")
      .from(".profile-card", { y: 40, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .from(".order-card", { y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }, "-=0.4");
  }, { scope: container });

  // --- HANDLERS ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/profile`, {
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
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert(updatedUser.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
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

  const submitFeedback = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/orders/${selectedOrderId}/feedback`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(feedbackData)
      });
      
      if(res.ok) {
        alert("Thank you for your feedback!");
        setFeedbackModalOpen(false);
        setFeedbackData({ rating: 5, comment: "" });
        
        // Update local orders state to remove the feedback button
        setOrders(orders.map(order => 
          order._id === selectedOrderId 
            ? { ...order, hasFeedback: true, feedback: feedbackData } 
            : order
        ));
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Prevent rendering if redirecting
  if (!user) return <div className="profile-page" style={{ background: '#111', height: '100vh' }}></div>;

  return (
    <div className="profile-page" ref={container}>
      <div className="page-curtain" ref={curtainRef}></div>
      
      <header className="profile-header">
        <p className="editorial-label">PERSONAL DASHBOARD</p>
        <h1>YOUR PROFILE</h1>
      </header>

      <div className="profile-grid">
        {/* --- LEFT: PROFILE CARD --- */}
        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar-circle">
              {editFormData.profilePic || user.profilePic ? (
                <img src={isEditing ? editFormData.profilePic : user.profilePic} alt="Profile" />
              ) : (
                <span className="initial">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            {isEditing && (
              <div className="upload-btn-wrapper">
                <button className="change-pic-btn">CHANGE PICTURE</button>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="user-info-display">
              <h2>{user.name}</h2>
              <p className="info-row"><span className="label">EMAIL</span> {user.email}</p>
              <p className="info-row"><span className="label">PHONE</span> {user.phone || "Not Provided"}</p>
              <button className="action-btn" onClick={() => setIsEditing(true)}>EDIT PROFILE</button>
            </div>
          ) : (
            <form className="user-info-form" onSubmit={handleProfileUpdate}>
              <div className="input-group">
                <label>FULL NAME</label>
                <input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>EMAIL</label>
                <input type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>PHONE</label>
                <input type="tel" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>CANCEL</button>
                <button type="submit" className="save-btn">SAVE CHANGES</button>
              </div>
            </form>
          )}
        </div>

        {/* --- RIGHT: ORDER HISTORY --- */}
        <div className="order-history-section">
          <h2>ORDER HISTORY</h2>
          <div className="orders-list">
            {orders.length === 0 ? (
              <p className="empty-state">You haven't placed any orders yet.</p>
            ) : (
              orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                      <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`status-badge ${order.status?.toLowerCase() || order.cookingStatus?.toLowerCase()}`}>
                      {order.status || order.cookingStatus}
                    </span>
                  </div>
                  
                  <div className="order-items">
                    <p>{order.dishName} <span className="item-qty">x{order.personCount}</span></p>
                  </div>

                  <div className="order-footer">
                    <span className="order-total">₹{order.totalPrice}</span>
                    {/* Shows Feedback button ONLY if order is delivered and hasn't been reviewed yet */}
                    {(order.cookingStatus === "Delivered" || order.status === "Delivered") && !order.hasFeedback && (
                      <button 
                        className="feedback-btn" 
                        onClick={() => { setSelectedOrderId(order._id); setFeedbackModalOpen(true); }}
                      >
                        RATE & FEEDBACK
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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

            <button className="submit-feedback-btn" onClick={submitFeedback}>SUBMIT FEEDBACK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;