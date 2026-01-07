import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Home.css";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const container = useRef();

  useGSAP(() => {
    // --- 1. HERO ENTRANCE ---
    const entranceTl = gsap.timeline({
      defaults: { ease: "power4.out" },
      delay: 1.2,
      onComplete: () => {
        ScrollTrigger.refresh();
      }
    });

    entranceTl.from(".hero-line-inner", {
      y: "110%",
      skewY: 7,
      duration: 1.5,
      stagger: 0.2
    })
      .from(".hero-desc, .hero-btn-container", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2
      }, "-=1");

    // --- 2. PINNED 4-IMAGE SECTION ---
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".parallax-section",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 2,
      }
    });

    parallaxTl
      .from(".img-left", { x: "-100vw", opacity: 0, rotate: -10, stagger: 0.2 }, 0)
      .from(".img-right", { x: "100vw", opacity: 0, rotate: 10, stagger: 0.2 }, 0)
      .from(".parallax-menu-wrap", { y: 50, opacity: 0, duration: 1 }, "-=0.5");

    // --- 3. PHILOSOPHY TEXT MASKING (FIXED SPACE & ANIMATION) ---
    const textElement = document.querySelector(".reveal-text");
    if (textElement) {
      const rawText = textElement.innerText;
      // We clear it and rebuild with a special structure that keeps spaces
      textElement.innerHTML = rawText
        .split(" ")
        .map(word => `<span class="word-wrapper"><span class="word-span">${word}</span></span>`)
        .join(" "); // This JOIN adds the actual space back between words

      gsap.to(textElement.querySelectorAll(".word-span"), {
        color: "#111111",
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".philosophy-section",
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }

    // --- 4. EXPANDING MARQUEE LOGIC ---
    const contactWrap = document.querySelector(".nav-wrap-left");
    const aboutWrap = document.querySelector(".nav-wrap-right");
    const startMarquee = (t) => gsap.to(t, { xPercent: -50, repeat: -1, duration: 12, ease: "none" });
    const stopMarquee = (t) => { gsap.killTweensOf(t); gsap.set(t, { xPercent: 0 }); };

    if (aboutWrap && contactWrap) {
      aboutWrap.addEventListener("mouseenter", () => {
        gsap.to(contactWrap, { x: "-100%", opacity: 0, duration: 0.8, ease: "expo.inOut" });
        gsap.to(aboutWrap, { width: "100%", left: "0%", backgroundColor: "#e3b94d", duration: 0.8, ease: "expo.inOut" });
        gsap.to(".marquee-about", { opacity: 0.2, duration: 0.5 });
        startMarquee(".marquee-about .marquee-inner");
      });
      aboutWrap.addEventListener("mouseleave", () => {
        gsap.to(contactWrap, { x: "0%", opacity: 1, duration: 0.8, ease: "expo.out" });
        gsap.to(aboutWrap, { width: "50%", left: "50%", backgroundColor: "transparent", duration: 0.8, ease: "expo.out" });
        gsap.to(".marquee-about", { opacity: 0, duration: 0.3 });
        stopMarquee(".marquee-about .marquee-inner");
      });

      contactWrap.addEventListener("mouseenter", () => {
        gsap.to(aboutWrap, { x: "100%", opacity: 0, duration: 0.8, ease: "expo.inOut" });
        gsap.to(contactWrap, { width: "100%", backgroundColor: "#e3b94d", duration: 0.8, ease: "expo.inOut" });
        gsap.to(".marquee-contact", { opacity: 0.2, duration: 0.5 });
        startMarquee(".marquee-contact .marquee-inner");
      });
      contactWrap.addEventListener("mouseleave", () => {
        gsap.to(aboutWrap, { x: "0%", opacity: 1, duration: 0.8, ease: "expo.out" });
        gsap.to(contactWrap, { width: "50%", backgroundColor: "transparent", duration: 0.8, ease: "expo.out" });
        gsap.to(".marquee-contact", { opacity: 0, duration: 0.3 });
        stopMarquee(".marquee-contact .marquee-inner");
      });
    }

  }, { scope: container });

  return (
    <div className="home-page" ref={container}>
      {/* SECTION 01: HERO */}
      <section className="hero-section-text">
        <div className="hero-content">
          <h1 className="hero-title">
            <div className="hero-line-wrapper"><div className="hero-line-inner">ELEVATING</div></div>
            <div className="hero-line-wrapper"><div className="hero-line-inner text-gold">SURAT'S FINEST</div></div>
            <div className="hero-line-wrapper"><div className="hero-line-inner">CELEBRATIONS</div></div>
          </h1>
          <p className="hero-desc">Bespeak catering for weddings and events in Surat. <br />Where culinary artistry meets service.</p>
          <div className="hero-btn-container">
            <Link to="/booking" className="hero-book-btn">
              <span>INQUIRE FOR YOUR DATE</span>
              <div className="btn-fill"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 02: PARALLAX IMAGES */}
      <section className="parallax-section">
        <div className="parallax-container">
          <div className="parallax-img-wrapper img-left parallax-img-1">
            <img src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070" alt="1" />
            <p className="img-caption">01. ARTISAN CRAFT</p>
          </div>
          <div className="parallax-img-wrapper img-right parallax-img-2">
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069" alt="2" />
            <p className="img-caption">02. ELEGANT EVENTS</p>
          </div>
          <div className="parallax-img-wrapper img-left parallax-img-3">
            <img src="https://images.unsplash.com/photo-1533144473977-96c5e011746d?q=80&w=1974" alt="3" />
            <p className="img-caption">03. HERITAGE TASTE</p>
          </div>
          <div className="parallax-img-wrapper img-right parallax-img-4">
            <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1974" alt="4" />
            <p className="img-caption">04. MODERN FLAVORS</p>
          </div>

          <div className="parallax-menu-wrap">
            <Link to="/menu" className="hero-book-btn">
              <span>DISCOVER OUR MENU</span>
              <div className="btn-fill"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 03: PHILOSOPHY */}
      <section className="philosophy-section">
        <div className="philosophy-content">
          <h3 className="section-label">THE PHILOSOPHY</h3>
          <p className="reveal-text">
            From the bustling kitchens of Surat to your most cherished celebrations,
            we believe catering is more than just food. It is a heritage of hospitality,
            a commitment to taste, and serving joy to every guest.
          </p>
        </div>
      </section>

      {/* SECTION 04: ACTION NAV */}
      <section className="nav-expand-section">
        <div className="nav-wrap nav-wrap-left">
          <Link to="/contact" className="static-btn">CONTACT US</Link>
          <div className="marquee-wrapper marquee-contact">
            <div className="marquee-inner">
              <span>CONTACT US &nbsp;&nbsp; CONTACT US &nbsp;&nbsp; CONTACT US &nbsp;&nbsp; </span>
              <span>CONTACT US &nbsp;&nbsp; CONTACT US &nbsp;&nbsp; CONTACT US &nbsp;&nbsp; </span>
            </div>
          </div>
        </div>
        <div className="nav-wrap nav-wrap-right">
          <Link to="/about" className="static-btn">ABOUT US</Link>
          <div className="marquee-wrapper marquee-about">
            <div className="marquee-inner">
              <span>ABOUT US &nbsp;&nbsp; ABOUT US &nbsp;&nbsp; ABOUT US &nbsp;&nbsp; </span>
              <span>ABOUT US &nbsp;&nbsp; ABOUT US &nbsp;&nbsp; ABOUT US &nbsp;&nbsp; </span>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;