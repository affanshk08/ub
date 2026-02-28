import React, { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./Booking.css";

const WEDDING_COMBOS = [
  { 
    id: "wc1", 
    name: "The Royal Bhatiyara Feast", 
    price: 950,
    items: [
      { 
        name: "Malai Tikka", 
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800", 
        desc: "Chicken chunks marinated for 12 hours in a velvety blend of heavy cream and cashew paste." 
      },
      { 
        name: "Dum Biryani", 
        image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800", 
        desc: "Slow-cooked in a heavy copper handi sealed with dough to lock in every aromatic spice." 
      },
      { 
        name: "Jarda", 
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800", 
        desc: "Sweet, saffron-flavored rice loaded with premium almonds, cashews, and ghee." 
      }
    ]
  },
  { 
    id: "wc2", 
    name: "Surati Heritage Grill", 
    price: 880,
    items: [
      { 
        name: "Kashmiri Tikka", 
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800", 
        desc: "Aromatic preparation using Kashmiri red chilies and mace for a deep color without high heat." 
      },
      { 
        name: "Chicken Angara", 
        image: "https://images.unsplash.com/photo-1603894584115-f73f2ec851ad?q=80&w=800", 
        desc: "A fiery red gravy finished with a live coal 'Dhungar' for a deep, smoky undertone." 
      },
      { 
        name: "Dudhi Halwa", 
        image: "https://images.unsplash.com/photo-1589113103553-5384496ff27b?q=80&w=800", 
        desc: "Fresh bottle gourd slow-cooked with whole milk, garnished with silvered pistachios." 
      }
    ]
  }
  // ... Add other 8 combos following this exact 3-item pattern
];

const Booking = () => {
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [personCount, setPersonCount] = useState(100);
  const [orderDetails, setOrderDetails] = useState({ date: "", time: "", phone: "" });
  
  // Custom Alert State
  const [customAlert, setCustomAlert] = useState(null); // { type: 'success' | 'error', message: string }

  const container = useRef();

  useGSAP(() => {
    gsap.from(".booking-header h1", { y: 100, opacity: 0, duration: 1, ease: "power4.out" });
    gsap.from(".combo-card", { opacity: 0, y: 50, stagger: 0.1, duration: 0.8 });
  }, { scope: container });

  const validateAndAdd = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setCustomAlert({ type: "error", message: "Please login to proceed." });
      return;
    }
    
    const { date, time, phone } = orderDetails;
    if (!date || !time || !phone) {
      setCustomAlert({ type: "error", message: "Please fill all logistics details!" });
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    const fortyEightHoursLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    if (selectedDateTime < fortyEightHoursLater) {
      setCustomAlert({ 
        type: "error", 
        message: "Advance Notice Required: Wedding orders must be placed at least 48 hours (2 days) in advance." 
      });
      return;
    }

    const cartItem = {
      dishId: selectedCombo.id,
      name: selectedCombo.name,
      category: "Wedding Combo",
      personCount,
      totalPrice: (selectedCombo.price * personCount),
      image: selectedCombo.items[0].image, 
      orderDate: date,
      orderTime: time,
      phoneNumber: phone
    };

    const cart = JSON.parse(localStorage.getItem("ub_cart")) || [];
    localStorage.setItem("ub_cart", JSON.stringify([...cart, cartItem]));
    
    setCustomAlert({ type: "success", message: "Wedding Package successfully added to your selection!" });
    setSelectedCombo(null);
  };

  return (
    <div className="booking-page" ref={container}>
      <header className="booking-header">
        <p className="editorial-label">GRAND SCALE CELEBRATIONS</p>
        <h1>WEDDING COMBOS</h1>
      </header>

      <div className="combos-grid">
        {WEDDING_COMBOS.map(combo => (
          <div key={combo.id} className="combo-card">
            <div className="card-info-wrap">
              <p className="editorial-label">PACKAGE</p>
              <h3>{combo.name}</h3>
              <p className="items-preview">
                {combo.items.map(i => i.name).join(" • ")}
              </p>
              <div className="card-footer-row">
                <span className="price-tag">₹{combo.price} <small>/ PERSON</small></span>
                <button className="preview-btn" onClick={() => setSelectedCombo(combo)}>
                  PREVIEW DETAILS
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- PREVIEW MODAL --- */}
      {selectedCombo && (
        <div className="preview-modal-overlay">
          <div className="preview-modal">
            <button className="close-modal" onClick={() => setSelectedCombo(null)}>✕</button>
            
            <div className="modal-header">
              <p className="editorial-label">CURATED WEDDING PACKAGE</p>
              <h2>{selectedCombo.name}</h2>
            </div>

            <div className="combo-details-grid">
              {selectedCombo.items.map((item, idx) => (
                <div key={idx} className="dish-detail-card">
                  <div className="dish-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="dish-text">
                    <h4>{item.name}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="booking-logistics-section">
              <div className="logistics-form">
                <div className="input-row">
                  <div className="input-group">
                    <label>PERSON COUNT (MIN 100)</label>
                    <input type="number" value={personCount} min="100" onChange={(e) => setPersonCount(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>DATE (MIN 48H NOTICE)</label>
                    <input type="date" onChange={(e) => setOrderDetails({...orderDetails, date: e.target.value})} />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>DELIVERY TIME</label>
                    <input type="time" onChange={(e) => setOrderDetails({...orderDetails, time: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>PHONE</label>
                    <input type="tel" placeholder="10-digit mobile" onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="checkout-summary">
                <div className="total-box">
                  <label>ESTIMATED TOTAL</label>
                  <span>₹{selectedCombo.price * personCount}</span>
                </div>
                <button className="add-to-selection-btn" onClick={validateAndAdd}>
                  CONFIRM SELECTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM ALERT MODAL --- */}
      {customAlert && (
        <div className="custom-alert-overlay">
          <div className={`custom-alert-box ${customAlert.type}`}>
            <h3>{customAlert.type === "success" ? "SUCCESS" : "ATTENTION"}</h3>
            <p>{customAlert.message}</p>
            <button className="custom-alert-btn" onClick={() => setCustomAlert(null)}>
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;