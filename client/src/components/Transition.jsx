import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import "./Transition.css";

const Transition = ({ children }) => {
  const location = useLocation();
  const transitionRef = useRef(null);

  useEffect(() => {
    if (!transitionRef.current) return;
    
    const bars = transitionRef.current.querySelectorAll(".transition-bar");
    const tl = gsap.timeline();

    // The animation stays the same - staggered bars
    tl.set(bars, { scaleY: 0, transformOrigin: "top" })
      .to(bars, {
        scaleY: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power4.inOut",
      })
      .to(bars, {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.6,
        stagger: 0.1,
        ease: "power4.inOut",
        delay: 0.1,
      });

  }, [location.pathname]);

  return (
    <>
      {/* Overlay sits on top but doesn't wrap the content */}
      <div className="transition-overlay" ref={transitionRef}>
        <div className="transition-bar bar-1"></div>
        <div className="transition-bar bar-2"></div>
        <div className="transition-bar bar-3"></div>
        <div className="transition-bar bar-4"></div>
        <div className="transition-bar bar-5"></div>
      </div>
      
      {/* Render children directly without a wrapper div */}
      {children}
    </>
  );
};

export default Transition;