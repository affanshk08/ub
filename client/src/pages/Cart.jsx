import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [utr, setUtr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("ub_cart")) || [];
    setCartItems(data);
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("ub_cart", JSON.stringify(updatedCart));
  };

  const grandTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  // --- UPI LOGIC ---
  const upiId = "affanshk021@oksbi"; // Your Real UPI ID
  const upiName = "Usman Bhai Bhatiyara"; 
  const upiIntentString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${grandTotal}&cu=INR`;
  // Using a free API to generate the QR code instantly
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiIntentString)}`;

  const handleProceedToPayment = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to proceed with booking.");
      navigate("/login");
      return;
    }
    setShowPaymentModal(true);
  };

  const submitOrder = async () => {
    if (utr.length < 12) {
      return alert("Please enter a valid 12-digit UTR/Transaction ID.");
    }

    const user = JSON.parse(localStorage.getItem("user"));
    // Ensure we extract the user ID correctly, regardless of how the token is structured
    const userId = user._id || user.id; 
    
    setIsSubmitting(true);

    try {
      // Loop through cart and save each order to database
      for (const item of cartItems) {
        const res = await fetch("http://127.0.0.1:5000/api/orders/place", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            userName: user.name,
            dishName: item.name,
            category: item.category,
            personCount: item.personCount,
            totalPrice: item.totalPrice,
            // Fallbacks added just in case there's a malformed old item in local storage
            orderDate: item.orderDate || new Date().toISOString().split("T")[0],
            orderTime: item.orderTime || "12:00",
            phoneNumber: item.phoneNumber || user.phone || "0000000000",
            utrNumber: utr
          })
        });

        // Actively check if MongoDB threw a validation error
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to save order to database.");
        }
      }

      alert("Payment submitted! Your order is now pending verification.");
      localStorage.removeItem("ub_cart");
      setCartItems([]);
      setShowPaymentModal(false);
      navigate("/profile"); // Send them to profile to see their new order
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message} \n\nPlease try emptying your cart and adding the items again from the Menu.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <p className="editorial-label">YOUR SELECTION</p>
        <h1>THE BASKET</h1>
      </header>

      <div className="cart-container">
        {cartItems.length === 0 ? (
          <div className="empty-msg">
            <p>Your selection is empty.</p>
            <Link to="/menu" className="back-btn">RETURN TO MENU</Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-img" />
                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p className="cat">{item.category}</p>
                    <p className="count">Guests: {item.personCount}</p>
                  </div>
                  <div className="cart-price">
                    <span>₹{item.totalPrice}</span>
                    <button onClick={() => removeFromCart(index)} className="remove-btn">REMOVE</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="total-row">
                <span>ESTIMATED TOTAL</span>
                <span className="grand-price">₹{grandTotal}</span>
              </div>
              <button className="checkout-btn" onClick={handleProceedToPayment}>
                PROCEED TO PAYMENT
              </button>
            </div>
          </>
        )}
      </div>

      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <button className="close-modal" onClick={() => setShowPaymentModal(false)}>✕</button>
            <p className="editorial-label">SECURE CHECKOUT</p>
            <h2>SCAN & PAY</h2>
            
            <div className="qr-container">
              <img src={qrCodeUrl} alt="UPI QR Code" />
              <p>Scan with Google Pay, PhonePe, or Paytm</p>
            </div>

            <div className="payment-details-box">
              <div className="pay-row">
                <span>PAYEE:</span>
                <strong>{upiName}</strong>
              </div>
              <div className="pay-row">
                <span>AMOUNT:</span>
                <strong style={{fontSize: '24px', color: '#111'}}>₹{grandTotal}</strong>
              </div>
            </div>

            <div className="utr-input-group">
              <label>ENTER 12-DIGIT UTR / TRANSACTION ID</label>
              <input 
                type="text" 
                placeholder="e.g. 301234567890" 
                maxLength="12"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
              />
            </div>

            <button 
              className={`confirm-payment-btn ${isSubmitting ? 'loading' : ''}`} 
              onClick={submitOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "CONFIRM PAYMENT"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;