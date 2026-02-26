import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

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
              <button className="checkout-btn">PROCEED TO BOOKING</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;