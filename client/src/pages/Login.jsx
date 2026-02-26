import { useRef, useState } from "react"; // Added useState
import { useGSAP } from "@gsap/react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import gsap from "gsap";
import "./Login.css";

const Login = () => {
  const container = useRef();
  const navigate = useNavigate();

  // --- Logic: Form State ---
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. The Staggered Block Reveal (Original left-to-right but FASTER)
    tl.to(".curtain-block", {
      y: "-100%",
      duration: 1,
      ease: "expo.inOut",
      stagger: 0.04,
    })
    // 2. Heading reveal from bottom
    .from(".login-heading h1", {
      y: 200,
      duration: 1,
      ease: "power4.out",
    }, "-=0.8")
    // 3. Staggered Inputs
    .from(".input-wrapper", {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.8")
    // 4. Lines expand from center
    .from(".line", {
      scaleX: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "expo.inOut"
    }, "-=0.8");
  }, { scope: container });

  // --- Logic: Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Using 127.0.0.1 to match your working Signup logic
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // This is where your 400 error is caught and shown to the user
        throw new Error(data.message || "Invalid Email or Password");
      }

      // Save user session
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home and refresh to update Navbar
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-screen" ref={container}>
      <div className="curtain-container">
        <div className="curtain-block"></div>
        <div className="curtain-block"></div>
        <div className="curtain-block"></div>
        <div className="curtain-block"></div>
        <div className="curtain-block"></div>
      </div>

      <div className="login-content">
        <div className="login-heading">
          <h1>AUTHENTICATE</h1>
        </div>

        {/* Logic: Error Display */}
        {error && <p className="error-banner" style={{color: '#e3b94d', textAlign: 'center', marginBottom: '15px', fontFamily: 'Montserrat'}}>{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label>CHEF ID / EMAIL</label>
            <input 
              type="email" 
              placeholder="user@gmail.com" 
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="line"></div>
          </div>

          <div className="input-wrapper">
            <label>PASSWORD</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div className="line"></div>
          </div>

          <div className="input-wrapper">
            {/* Logic: Changed type to submit */}
            <button className="auth-btn" type="submit">
              LET'S COOK
            </button>
          </div>

          <div className="input-wrapper">
            <Link to="/signup" className="switch-link">
              NEW CHEF? REGISTER HERE
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;