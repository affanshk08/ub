import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "./Login.css";

const Login = () => {
  const container = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. The Staggered Block Reveal (Original left-to-right but FASTER)
    tl.to(".curtain-block", {
      y: "-100%",
      duration: 1,      // Speed of each individual block
      ease: "expo.inOut",
      stagger: 0.04,    // Much smaller delay for a snappier feel
    })
    // 2. Heading reveal from bottom
    .from(".login-heading h1", {
      y: 200,
      duration: 1,      // Faster duration
      ease: "power4.out",
    }, "-=0.8")         // Starts earlier while blocks are still moving
    // 3. Staggered Inputs
    .from(".input-wrapper", {
      opacity: 0,
      y: 30,
      stagger: 0.08,    // Snappier stagger for inputs too
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

        <form className="login-form">
          <div className="input-wrapper">
            <label>CHEF ID / EMAIL</label>
            <input type="email" placeholder="user@gmail.com" />
            <div className="line"></div>
          </div>

          <div className="input-wrapper">
            <label>PASSWORD</label>
            <input type="password" placeholder="••••••••" />
            <div className="line"></div>
          </div>

          <div className="input-wrapper">
            <button className="auth-btn" type="button">
              LET'S COOK
            </button>
          </div>

          {/* NEW SIGNUP OPTION */}
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