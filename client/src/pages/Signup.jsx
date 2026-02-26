import { useRef, useState } from "react"; // Added useState
import { useGSAP } from "@gsap/react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import gsap from "gsap";
import "./Signup.css";

const Signup = () => {
  const container = useRef();
  const navigate = useNavigate(); // Initialize navigate

  // --- Logic: Form State ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. The Staggered Block Reveal
    tl.to(".curtain-block", {
      y: "-100%",
      duration: 1,
      ease: "expo.inOut",
      stagger: 0.04,
    })
    // 2. Heading reveal (FIXED: Changed .login-heading to .signup-heading to match your HTML)
    .from(".signup-heading h1", {
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
      const response = await fetch("http://127.0.0.1:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Save user session
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect and refresh
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-screen" ref={container}>
      <div className="curtain-container">
        <div className="curtain-block"></div>
        <div className="curtain-block"></div>
        <div className="curtain-block"></div>
        <div className="curtain-block"></div>
        <div className="curtain-block"></div>
      </div>

      <div className="signup-content">
        <div className="signup-heading">
          <h1>REGISTER</h1>
        </div>

        {/* Logic: Error Display */}
        {error && <p className="error-banner" style={{color: '#e3b94d', textAlign: 'center', marginBottom: '15px'}}>{error}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label>FULL NAME</label>
            <input 
              type="text" 
              placeholder="Username" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <div className="line"></div>
          </div>

          <div className="input-wrapper">
            <label>CHEF EMAIL</label>
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
            <label>CREATE PASSWORD</label>
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
            <Link to="/login" className="switch-link">
              ALREADY REGISTERED? LOGIN HERE
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;