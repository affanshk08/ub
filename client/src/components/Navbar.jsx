import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { gsap } from "gsap";
import ketchupBottle from "../assets/ketchup-bottle.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ---------- POWDER EFFECT ---------- */
  const runPowderFall = (item) => {
    const container = item.querySelector(".powder-layer");
    if (!container) return;

    const height = item.offsetHeight;
    const width = item.offsetWidth;
    const count = 880;

    setTimeout(() => {
      for (let i = 0; i < count; i++) {
        const p = document.createElement("span");
        p.className = "powder-particle";
        container.appendChild(p);

        const size = gsap.utils.random(0.4, 1);
        const startX = gsap.utils.random(0, width);

        gsap.set(p, {
          left: startX,
          top: -10,
          width: size,
          height: size,
          opacity: gsap.utils.random(0.3, 0.6)
        });

        gsap.to(p, {
          y: gsap.utils.random(height * 0.75, height * 1.2),
          opacity: 0,
          duration: gsap.utils.random(0.2, 3.5),
          ease: "power2.out",
          onComplete: () => p.remove()
        });
      }
    }, 80);
  };

  useEffect(() => {
    /* ---------- NAV ITEM POWDER ---------- */
    const navItems = document.querySelectorAll(".nav-item");
    const navHandlers = [];

    navItems.forEach((item) => {
      const handler = () => runPowderFall(item);
      navHandlers.push({ item, handler });
      item.addEventListener("mouseenter", handler);
    });

    /* ---------- LOGO ANIMATION (ONE TIME) ---------- */
    const logo = document.querySelector(".nav-logo");
    if (!logo) return;

    const runLogoAnimation = () => {
      if (logo.dataset.animated === "true") return;
      logo.dataset.animated = "true";

      const bottle = document.querySelector(".ketchup-bottle");
      const bg = logo.querySelector(".logo-bg");

      const tl = gsap.timeline();

      tl.fromTo(
        bottle,
        {
          opacity: 0,
          y: -40,          // start ABOVE logo
          rotate: 0
        },
        {
          opacity: 1,
          y: 0,            // straight DOWN
          duration: 1.2,   // slower
          ease: "power3.inOut"
        }
      )
        .to(bottle, {
          rotate: -14,
          duration: 0.9,
          ease: "power2.inOut"
        })
        .fromTo(
          bg,
          { height: "0%" },
          {
            height: "100%",
            duration: 1.8,
            ease: "power2.inOut"
          },
          "+=0.2"
        )
        .to(bottle, {
          rotate: 0,
          duration: 0.6,
          ease: "power2.inOut"
        })
        .to(bottle, {
          y: -40,          // straight UP
          opacity: 0,
          duration: 1.0,
          ease: "none"
        });
    };

    logo.addEventListener("mouseenter", runLogoAnimation);

    return () => {
      navHandlers.forEach(({ item, handler }) => {
        item.removeEventListener("mouseenter", handler);
      });
      logo.removeEventListener("mouseenter", runLogoAnimation);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* LOGO */}
        <div className="nav-logo" data-animated="false">
          <Link to="/" className="logo-text">
            <span className="logo-bg" />
            UB CATERING
          </Link>
        </div>

        {/* KETCHUP BOTTLE */}
        <span className="ketchup-bottle">
          <img src={ketchupBottle} alt="ketchup bottle" />
        </span>

        {/* NAV LINKS */}
        <div className="nav-links">
          {["Home", "About", "Services", "Booking", "Contact"].map((label) => (
            <Link
              key={label}
              to={label === "Home" ? "/" : `/${label.toLowerCase()}`}
              className="nav-item"
            >
              {label}
              <span className="powder-layer" />
            </Link>
          ))}

          {user && user.role === "admin" && (
            <Link to="/admin" className="nav-item">
              Admin
              <span className="powder-layer" />
            </Link>
          )}

          {!user ? (
            <Link to="/login" className="nav-item">
              Login
              <span className="powder-layer" />
            </Link>
          ) : (
            <button className="nav-item logout-btn" onClick={handleLogout}>
              Logout
              <span className="powder-layer" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
