import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./WeddingCart.css";

const WeddingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  
  // Checkout Flow States
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: Cart, 1: Logistics, 2: Payment
  const [address, setAddress] = useState({ hallName: "", area: "", pincode: "", coords: null });
  
  // Custom Alert State
  const [customAlert, setCustomAlert] = useState(null); 
  
  const [utr, setUtr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Reading strictly from the wedding cart
    const data = JSON.parse(localStorage.getItem("ub_wedding_cart")) || [];
    setCartItems(data);
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("ub_wedding_cart", JSON.stringify(updatedCart));
    if (updatedCart.length === 0) setCheckoutStep(0);
  };

  // --- FINANCIAL & BUSINESS LOGIC CALCULATIONS ---
  const subTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  
  // Get maximum person count across the order to determine tiers
  const maxPersons = cartItems.length > 0 ? Math.max(...cartItems.map(item => item.personCount)) : 0;
  
  // Business Rules
  const isDiscountApplicable = maxPersons > 400;
  const isTaxWaived = maxPersons > 2500;

  const discountAmount = isDiscountApplicable ? Math.round(subTotal * 0.05) : 0; // 5% Flat Discount
  const taxableAmount = subTotal - discountAmount;
  
  const cgst = isTaxWaived ? 0 : Math.round(taxableAmount * 0.025);
  const sgst = isTaxWaived ? 0 : Math.round(taxableAmount * 0.025);
  
  const grandTotal = taxableAmount + cgst + sgst;
  
  // 30% Advance Payment Logic
  const advancePayment = Math.round(grandTotal * 0.30);
  const remainingBalance = grandTotal - advancePayment;

  // --- UPI LOGIC (Targeting the 30% Advance) ---
  const upiId = "affanshk021@oksbi"; 
  const upiName = "Usman Bhai Bhatiyara"; 
  const upiIntentString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${advancePayment}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiIntentString)}`;

  const handleStartCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setCustomAlert({ 
        type: "error", 
        message: "Please login to proceed with wedding bookings.",
        onClose: () => navigate("/login") 
      });
      return;
    }
    setCheckoutStep(1);
  };

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddress({ ...address, coords: { lat: position.coords.latitude, lng: position.coords.longitude } });
          setCustomAlert({ type: "success", message: "📍 Wedding Hall map location pinned successfully!" });
        },
        () => setCustomAlert({ type: "error", message: "Please allow location access to pin the wedding venue." })
      );
    } else {
      setCustomAlert({ type: "error", message: "Geolocation is not supported by your browser." });
    }
  };

  const proceedToPayment = () => {
    if (!address.hallName || !address.area || !address.pincode) {
      setCustomAlert({ type: "error", message: "Please fill in all venue address fields." });
      return;
    }
    setCheckoutStep(2);
  };

  const submitOrder = async () => {
    if (utr.length < 12) {
      setCustomAlert({ type: "error", message: "Please enter a valid 12-digit UTR/Transaction ID for the advance payment." });
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id || user.id; 
    setIsSubmitting(true);

    try {
      const finalAddress = `${address.hallName}, ${address.area}, ${address.pincode} ${address.coords ? '(Map Pinned)' : ''}`;

      const orderPayload = {
        userId: userId,
        userName: user.name,
        dishName: "Wedding Package Selection", 
        category: "Wedding",
        personCount: maxPersons,
        
        items: cartItems.map(item => ({
          dishId: item.dishId,
          name: item.name,
          category: item.category,
          personCount: item.personCount,
          price: item.totalPrice
        })),

        totalPrice: subTotal, 
        orderDate: cartItems[0]?.orderDate || new Date().toISOString().split("T")[0],
        orderTime: cartItems[0]?.orderTime || "12:00",
        phoneNumber: cartItems[0]?.phoneNumber || user.phone || "0000000000",
        
        // FINANCIALS
        cgst: cgst,
        sgst: sgst,
        deliveryFee: 0, // Waived for large wedding orders
        grandTotal: grandTotal,
        advancePaid: advancePayment,
        balanceDue: remainingBalance,
        
        deliveryType: "Wedding Delivery",
        deliveryAddress: finalAddress,
        paymentMethod: "online",
        paymentStatus: "30% Advance Paid (Verification Pending)",
        utrNumber: utr
      };

      const res = await fetch("http://127.0.0.1:5000/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save order to database.");
      }

      setCustomAlert({ 
        type: "success", 
        message: "Advance Payment submitted! Your wedding order is pending verification.",
        onClose: () => {
          localStorage.removeItem("ub_wedding_cart");
          setCartItems([]);
          setCheckoutStep(0);
          navigate("/profile"); 
        }
      });
    } catch (err) {
      console.error(err);
      setCustomAlert({ type: "error", message: `Error: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCustomAlert = () => {
    if (customAlert?.onClose) {
      customAlert.onClose();
    }
    setCustomAlert(null);
  };

  return (
    <div className="wedding-cart-page">
      <header className="cart-header">
        <p className="editorial-label">GRAND SCALE CELEBRATIONS</p>
        <h1>WEDDING BASKET</h1>
      </header>

      <div className="cart-container">
        {cartItems.length === 0 ? (
          <div className="empty-msg">
            <p>Your wedding selection is empty.</p>
            <Link to="/booking" className="back-btn">RETURN TO COMBOS</Link>
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
                    <p className="count">Expected Guests: {item.personCount}</p>
                    <p className="date-time">Delivery: {item.orderDate} at {item.orderTime}</p>
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
                <span>SUBTOTAL</span>
                <span className="grand-price">₹{subTotal}</span>
              </div>
              <button className="checkout-btn" onClick={handleStartCheckout}>
                PROCEED TO WEDDING LOGISTICS
              </button>
            </div>
          </>
        )}
      </div>

      {/* --- MULTI-STEP CHECKOUT MODAL --- */}
      {checkoutStep > 0 && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal wedding-modal">
            <button className="close-modal" onClick={() => setCheckoutStep(0)}>✕</button>
            
            <div className="modal-progress">
                <span className={checkoutStep === 1 ? "active" : ""}>01. VENUE</span>
                <span className="divider"></span>
                <span className={checkoutStep === 2 ? "active" : ""}>02. ADVANCE PAYMENT</span>
            </div>

            {/* STEP 1: VENUE LOGISTICS */}
            {checkoutStep === 1 && (
              <div className="step-content">
                <h2>VENUE DETAILS</h2>
                <p className="step-desc">Please provide the exact location of the wedding hall or venue.</p>
                
                <div className="address-section">
                  <button className="detect-location-btn" onClick={handleDetectLocation}>
                      📍 PIN VENUE LOCATION ON MAP
                  </button>
                  <p className="coords-status">{address.coords ? "Venue Location Pinned Successfully ✓" : "Map location not pinned yet"}</p>
                  
                  <div className="address-form">
                    <input 
                      type="text" placeholder="Wedding Hall / Venue Name" 
                      value={address.hallName} onChange={(e) => setAddress({...address, hallName: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Area / Landmark" 
                      value={address.area} onChange={(e) => setAddress({...address, area: e.target.value})}
                    />
                    <input 
                      type="number" placeholder="Pincode" 
                      value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})}
                    />
                  </div>
                </div>

                <button className="confirm-step-btn" onClick={proceedToPayment}>CONTINUE TO BILLING</button>
              </div>
            )}

            {/* STEP 2: FINANCIALS & ADVANCE */}
            {checkoutStep === 2 && (
              <div className="step-content">
                <h2>FINANCIAL REVIEW</h2>
                
                <div className="invoice-breakdown">
                  <div className="breakdown-row"><span>Base Package Subtotal</span><span>₹{subTotal}</span></div>
                  
                  {isDiscountApplicable && (
                    <div className="breakdown-row highlight-green">
                      <span>Premium Volume Discount (5%)</span>
                      <span>- ₹{discountAmount}</span>
                    </div>
                  )}
                  
                  <div className="breakdown-row">
                    <span>CGST (2.5%)</span>
                    {isTaxWaived ? <span className="highlight-green">WAIVED (0%)</span> : <span>₹{cgst}</span>}
                  </div>
                  <div className="breakdown-row">
                    <span>SGST (2.5%)</span>
                    {isTaxWaived ? <span className="highlight-green">WAIVED (0%)</span> : <span>₹{sgst}</span>}
                  </div>
                  
                  <div className="breakdown-row grand-total"><span>GRAND TOTAL</span><span>₹{grandTotal}</span></div>
                </div>

                <div className="split-payment-box">
                  <div className="advance-section">
                    <h4>30% ADVANCE REQUIRED</h4>
                    <h2>₹{advancePayment}</h2>
                    <p>To secure your wedding booking dates.</p>
                  </div>
                  <div className="balance-section">
                    <h4>BALANCE DUE POST-EVENT</h4>
                    <h3>₹{remainingBalance}</h3>
                  </div>
                </div>

                <div className="online-payment-box">
                  <div className="qr-container">
                    <img src={qrCodeUrl} alt="UPI QR Code" />
                    <p>Scan to pay ₹{advancePayment} Advance</p>
                  </div>
                  <div className="utr-input-group">
                    <label>ENTER 12-DIGIT UTR / TRANSACTION ID</label>
                    <input 
                      type="text" placeholder="e.g. 301234567890" maxLength="12"
                      value={utr} onChange={(e) => setUtr(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-actions-split">
                  <button className="back-step-btn" onClick={() => setCheckoutStep(1)}>BACK</button>
                  <button 
                    className={`confirm-step-btn ${isSubmitting ? 'loading' : ''}`} 
                    onClick={submitOrder} disabled={isSubmitting}
                  >
                    {isSubmitting ? "PROCESSING..." : "CONFIRM ADVANCE PAYMENT"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CUSTOM BRANDED ALERT MODAL --- */}
      {customAlert && (
        <div className="custom-alert-overlay">
          <div className={`custom-alert-box ${customAlert.type}`}>
            <h3>{customAlert.type === "success" ? "SUCCESS" : "ATTENTION"}</h3>
            <p>{customAlert.message}</p>
            <button className="custom-alert-btn" onClick={closeCustomAlert}>
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default WeddingCart;