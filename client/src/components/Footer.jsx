import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>UB<br/><span className="text-gold">CATERING</span></h2>
          <p>Surat's Premier Catering Legacy since 1990.</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>NAVIGATION</h4>
            <Link to="/">HOME</Link>
            <Link to="/menu">MENU</Link>
            <Link to="/about">ABOUT</Link>
            <Link to="/contact">CONTACT</Link>
          </div>
          <div className="link-group">
            <h4>ORDER POLICY</h4>
            <p>MINIMUM ORDER: 10 PERSONS</p>
            <p>MAXIMUM VALUE: ₹5,000 PER ORDER</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 UB CATERING. ALL RIGHTS RESERVED.</p>
        <p>BCA SEM 6 PROJECT</p>
      </div>
    </footer>
  );
};

export default Footer;