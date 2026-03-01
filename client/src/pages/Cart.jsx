import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  
  // Checkout Flow States
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: Cart, 1: Logistics, 2: Payment
  const [deliveryType, setDeliveryType] = useState("pickup"); // 'pickup' | 'delivery'
  const [address, setAddress] = useState({ houseNo: "", area: "", pincode: "", coords: null });
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' | 'cod'
  
  // Custom Alert State
  const [customAlert, setCustomAlert] = useState(null); // { type: 'success' | 'error', message: string, onClose?: () => void }
  
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
    if (updatedCart.length === 0) setCheckoutStep(0);
  };

  // --- FINANCIAL CALCULATIONS ---
  const subTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const cgst = Math.round(subTotal * 0.025); // 2.5% Industry Standard
  const sgst = Math.round(subTotal * 0.025); // 2.5% Industry Standard
  const deliveryCharge = deliveryType === "delivery" ? 300 : 0; // Standard Flat Fee
  const grandTotal = subTotal + cgst + sgst + deliveryCharge;

  // --- UPI LOGIC ---
  const upiId = "affanshk021@oksbi"; 
  const upiName = "Usman Bhai Bhatiyara"; 
  const upiIntentString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${grandTotal}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiIntentString)}`;

  const handleStartCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setCustomAlert({ 
        type: "error", 
        message: "Please login to proceed with booking.",
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
          setCustomAlert({ type: "success", message: "📍 Map location pinned successfully!" });
        },
        () => setCustomAlert({ type: "error", message: "Please allow location access in your browser to pin your map location." })
      );
    } else {
      setCustomAlert({ type: "error", message: "Geolocation is not supported by your browser." });
    }
  };

  const proceedToPayment = () => {
    if (deliveryType === "delivery") {
      if (!address.houseNo || !address.area || !address.pincode) {
        setCustomAlert({ type: "error", message: "Please fill in all address fields for delivery." });
        return;
      }
    }
    setCheckoutStep(2);
  };

  const submitOrder = async () => {
    if (paymentMethod === "online" && utr.length < 12) {
      setCustomAlert({ type: "error", message: "Please enter a valid 12-digit UTR/Transaction ID for online payment." });
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id || user.id; 
    setIsSubmitting(true);

    try {
      // Format address for database
      const finalAddress = deliveryType === "delivery" 
        ? `${address.houseNo}, ${address.area}, ${address.pincode} ${address.coords ? '(Map Pinned)' : ''}`
        : "Self-Pickup";

      // COMBINED ORDER PAYLOAD
      const orderPayload = {
        userId: userId,
        userName: user.name,
        // Fallback for old schemas that expect a top-level string
        dishName: "Combined Selection", 
        category: "Multiple",
        personCount: cartItems.reduce((acc, curr) => Math.max(acc, curr.personCount), 0), // Max persons
        
        // NEW: Array containing the exact items selected
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
        
        // LOGISTICS & FINANCIALS
        cgst: cgst,
        sgst: sgst,
        deliveryFee: deliveryCharge,
        grandTotal: grandTotal,
        deliveryType: deliveryType,
        deliveryAddress: finalAddress,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "Pending (COD)" : "Paid (Verification Pending)",
        utrNumber: paymentMethod === "online" ? utr : "COD"
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/place`, {
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
        message: paymentMethod === "online" ? "Payment submitted! Your order is pending verification." : "Order placed successfully! Please pay on delivery/pickup.",
        onClose: () => {
          localStorage.removeItem("ub_cart");
          setCartItems([]);
          setCheckoutStep(0);
          navigate("/profile"); 
        }
      });
    } catch (err) {
      console.error(err);
      setCustomAlert({ type: "error", message: `Error: ${err.message} \n\nPlease try emptying your cart and adding the items again.` });
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
                <span>SUBTOTAL</span>
                <span className="grand-price">₹{subTotal}</span>
              </div>
              <button className="checkout-btn" onClick={handleStartCheckout}>
                PROCEED TO SECURE CHECKOUT
              </button>
            </div>
          </>
        )}
      </div>

      {/* --- MULTI-STEP CHECKOUT MODAL --- */}
      {checkoutStep > 0 && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal">
            <button className="close-modal" onClick={() => setCheckoutStep(0)}>✕</button>
            
            <div className="modal-progress">
                <span className={checkoutStep === 1 ? "active" : ""}>01. LOGISTICS</span>
                <span className="divider"></span>
                <span className={checkoutStep === 2 ? "active" : ""}>02. PAYMENT</span>
            </div>

            {/* STEP 1: LOGISTICS */}
            {checkoutStep === 1 && (
              <div className="step-content">
                <h2>DELIVERY METHOD</h2>
                
                <div className="method-toggles">
                  <button 
                    className={`method-btn ${deliveryType === 'pickup' ? 'active' : ''}`}
                    onClick={() => setDeliveryType('pickup')}
                  >
                    SELF-PICKUP
                  </button>
                  <button 
                    className={`method-btn ${deliveryType === 'delivery' ? 'active' : ''}`}
                    onClick={() => setDeliveryType('delivery')}
                  >
                    DELIVER TO ME
                  </button>
                </div>

                {deliveryType === "delivery" && (
                  <div className="address-section">
                    <button className="detect-location-btn" onClick={handleDetectLocation}>
                       📍 PIN MY CURRENT LOCATION ON MAP
                    </button>
                    <p className="coords-status">{address.coords ? "Location Pinned Successfully ✓" : "Map location not pinned yet"}</p>
                    
                    <div className="address-form">
                      <input 
                        type="text" placeholder="House No. / Flat Name" 
                        value={address.houseNo} onChange={(e) => setAddress({...address, houseNo: e.target.value})}
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
                )}

                {deliveryType === "pickup" && (
                  <div className="pickup-info">
                    <p className="editorial-label">PICKUP ADDRESS</p>
                    <h4>Usman Bhai Bhatiyara Catering HQ</h4>
                    <p>Surat, Gujarat, India</p>
                    <p className="note">Please arrive 15 minutes prior to your selected time.</p>
                  </div>
                )}

                <button className="confirm-step-btn" onClick={proceedToPayment}>CONTINUE TO PAYMENT</button>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {checkoutStep === 2 && (
              <div className="step-content">
                <h2>FINALIZE ORDER</h2>
                
                {/* Break Down */}
                <div className="invoice-breakdown">
                  <div className="breakdown-row"><span>Subtotal</span><span>₹{subTotal}</span></div>
                  <div className="breakdown-row"><span>CGST (2.5%)</span><span>₹{cgst}</span></div>
                  <div className="breakdown-row"><span>SGST (2.5%)</span><span>₹{sgst}</span></div>
                  {deliveryType === "delivery" && (
                    <div className="breakdown-row highlight"><span>Delivery Charge</span><span>₹{deliveryCharge}</span></div>
                  )}
                  <div className="breakdown-row grand-total"><span>GRAND TOTAL</span><span>₹{grandTotal}</span></div>
                </div>

                <div className="method-toggles payment-toggles">
                  <button 
                    className={`method-btn ${paymentMethod === 'online' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('online')}
                  >
                    ONLINE (QR)
                  </button>
                  <button 
                    className={`method-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    CASH ON DELIVERY
                  </button>
                </div>

                {paymentMethod === "online" ? (
                  <div className="online-payment-box">
                    <div className="qr-container">
                      <img src={qrCodeUrl} alt="UPI QR Code" />
                      <p>Scan with Google Pay, PhonePe, or Paytm</p>
                    </div>
                    <div className="utr-input-group">
                      <label>ENTER 12-DIGIT UTR / TRANSACTION ID</label>
                      <input 
                        type="text" placeholder="e.g. 301234567890" maxLength="12"
                        value={utr} onChange={(e) => setUtr(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="cod-info-box">
                    <p>You have selected Cash on Delivery. Please keep exact change ready at the time of {deliveryType}.</p>
                  </div>
                )}

                <div className="modal-actions-split">
                  <button className="back-step-btn" onClick={() => setCheckoutStep(1)}>BACK</button>
                  <button 
                    className={`confirm-step-btn ${isSubmitting ? 'loading' : ''}`} 
                    onClick={submitOrder} disabled={isSubmitting}
                  >
                    {isSubmitting ? "PROCESSING..." : "CONFIRM ORDER"}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* --- CUSTOM ALERT MODAL --- */}
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

export default Cart;