import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "./Signup.css";

const Signup = () => {
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
    <div className="signup-screen" ref={container}>
      {/* Container for the 5 transition blocks */}
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

        <form className="signup-form">
          <div className="input-wrapper">
            <label>FULL NAME</label>
            <input type="text" placeholder="Username" />
            <div className="line"></div>
          </div>

          <div className="input-wrapper">
            <label>CHEF EMAIL</label>
            <input type="email" placeholder="user@gmail.com" />
            <div className="line"></div>
          </div>

          <div className="input-wrapper">
            <label>CREATE PASSWORD</label>
            <input type="password" placeholder="••••••••" />
            <div className="line"></div>
          </div>

          <div className="input-wrapper">
            <button className="auth-btn" type="button">
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