import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate, Link } from "react-router-dom"; 
import "./Menu.css";

const MENU_DATA = {
  Starter: {
    "Tikka": [
      { id: 1, name: "Malai Tikka", price: "380", desc: "A royal Bhatiyara classic. Tender chicken chunks are marinated for 12 hours in a velvety blend of heavy cream, hung curd, and cashew paste, then charcoal-grilled until they melt in your mouth.", images: ["https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80"] },
      { id: 2, name: "Golden Tikka", price: "390", desc: "Infused with high-grade saffron and fresh turmeric, this tikka offers a vibrant hue and a warm, earthy flavor profile that celebrates the sun-kissed spices of Gujarat.", images: ["https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80"] },
      { id: 3, name: "Kashmiri Tikka", price: "400", desc: "A mild yet aromatic preparation using authentic Kashmiri red chilies and mace, providing a deep red color without the burning heat, perfect for the refined palate.", images: ["https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"] },
      { id: 4, name: "Machhi Masal Tikka", price: "450", desc: "Fresh river fish fillets marinated in a robust Bhatiyara 'masal'—a secret blend of 21 spices—charred to a crispy exterior while remaining succulent inside.", images: ["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80"] },
      { id: 5, name: "Pakistani Tikka", price: "420", desc: "Inspired by the bold street flavors of Lahore, this tikka is heavily spiced with crushed coriander and black pepper, finished with a heavy smoke 'Dhungar'.", images: ["https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80"] },
      { id: 6, name: "Schezwan Tikka", price: "380", desc: "A contemporary Surat fusion where tradition meets the orient. Tandoori chicken tossed in a house-made fiery Schezwan sauce with toasted sesame.", images: ["https://images.unsplash.com/photo-1524331155111-e9e99677020d?auto=format&fit=crop&w=800&q=80"] }
    ],
    "Tangdi": [
      { id: 7, name: "Makhhan Mari Tangdi", price: "450", desc: "Succulent chicken drumsticks glazed with clarified butter (Makhhan) and a heavy dusting of cracked Tellicherry black pepper for a rich, spicy kick.", images: ["https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80"] },
      { id: 8, name: "Irani Tangdi", price: "420", desc: "A heritage recipe featuring a marinade of pomegranate molasses and dried herbs, reflecting the historic Persian culinary influence on Surat's food culture.", images: ["https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80"] },
      { id: 9, name: "Schezwan Tangdi", price: "1", desc: "Jumbo drumsticks marinated overnight and finished in a high-flame wok with red chilies, garlic, and fermented bean paste.", images: ["https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80"] }
    ],
    "Rolls & Others": [
      { id: 10, name: "Tiranga Roll", price: "350", desc: "A stunning visual and culinary treat. Three distinct layers of paneer, spinach, and carrot-infused mash rolled together and lightly fried.", images: ["https://images.unsplash.com/photo-1539252554454-31d626bd57b8?auto=format&fit=crop&w=800&q=80"] },
      { id: 11, name: "Cheese Roll", price: "320", desc: "A favorite among the youth. Crispy golden crust wrapping a molten blend of premium processed and mozzarella cheese with a hint of jalapeño.", images: ["https://images.unsplash.com/photo-1612195583950-b8fd34c87093?auto=format&fit=crop&w=800&q=80"] },
      { id: 12, name: "Cutlet", price: "280", desc: "Traditional Bhatiyara vegetable cutlets, hand-pounded and seasoned with fresh mint, ginger, and green chilies, served with a tangy imli dip.", images: ["https://images.unsplash.com/photo-1626132646529-5aa71394c98a?auto=format&fit=crop&w=800&q=80"] },
      { id: 13, name: "Butta Kawab", price: "300", desc: "Delicate kebabs made from fresh sweet corn and potatoes, flavored with roasted cumin and fresh coriander, shallow fried to a crisp.", images: ["https://images.unsplash.com/photo-1603962285838-838104440129?auto=format&fit=crop&w=800&q=80"] }
    ]
  },
  "Main Course": {
    "Biryani": [
      { id: 14, name: "Dum Biryani", price: "550", desc: "The ultimate celebration of meat and rice. Slow-cooked in a heavy copper handi sealed with dough, allowing the flavors to penetrate every grain of basmati.", images: ["https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80"] },
      { id: 15, name: "Tikka Biryani", price: "580", desc: "A smoky delight where tandoor-roasted chicken tikkas are layered with biryani rice, giving each bite a distinct charcoal-grilled aroma.", images: ["https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"] },
      { id: 16, name: "Seekh Biryani", price: "600", desc: "An innovative blend where juicy mutton seekh kebabs are nestled within layers of saffron-infused rice and caramelized onions.", images: ["https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80"] },
      { id: 17, name: "Italian Biryani", price: "620", desc: "A global fusion featuring Mediterranean herbs like basil and rosemary, cooked with premium olive oil and sun-dried tomatoes alongside traditional spices.", images: ["https://images.unsplash.com/photo-1512058560366-cd2429ff5c7c?auto=format&fit=crop&w=800&q=80"] },
      { id: 18, name: "Nargisi Biryani", price: "650", desc: "Royal biryani served with Nargisi Koftas—hard-boiled eggs encased in a layer of spiced minced meat, resembling the 'Nargis' (Narcissus) flower.", images: ["https://images.unsplash.com/photo-1645177623570-5283995804bc?auto=format&fit=crop&w=800&q=80"] },
      { id: 19, name: "Paneer Tikka Biryani (Veg.)", price: "480", desc: "A vegetarian masterpiece. Large cubes of malai paneer are grilled and dum-cooked with aromatic basmati, mint, and saffron.", images: ["https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80"] }
    ],
    "Gravy": [
      { id: 20, name: "Chicken Angara", price: "450", desc: "A fiery red, spicy gravy that carries the 'Angar' (fire) of Surat. Finished with a live coal 'Dhungar' for a deep, smoky undertone.", images: ["https://images.unsplash.com/photo-1603894584115-f73f2ec851ad?auto=format&fit=crop&w=800&q=80"] },
      { id: 21, name: "Chicken Kadai", price: "420", desc: "Cooked in a traditional iron wok, this dish features chunks of bell peppers and onions in a thick, tomato-based gravy seasoned with freshly ground coriander.", images: ["https://images.unsplash.com/photo-1601303582555-538600d1641b?auto=format&fit=crop&w=800&q=80"] },
      { id: 22, name: "Chicken Patiyala", price: "480", desc: "A rich, cashew-based yellow gravy hidden under a thin, lacy egg omelet, offering a surprising texture and royal taste.", images: ["https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80"] },
      { id: 23, name: "Butter Chicken", price: "460", desc: "The timeless classic. Shredded tandoori chicken simmered in a smooth-as-silk tomato, butter, and cream sauce with a touch of dried fenugreek.", images: ["https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80"] },
      { id: 24, name: "Golden Chicken", price: "470", desc: "Our signature white gravy, enriched with cream, almonds, and saffron, giving it a majestic golden hue and a mildly sweet, nutty finish.", images: ["https://images.unsplash.com/photo-1545231027-63b6f2a3c2dd?auto=format&fit=crop&w=800&q=80"] },
      { id: 25, name: "Machhi Masala Chicken", price: "500", desc: "Usually reserved for fish, this tangy and spicy green-masala blend (coriander, chili, and garlic) is applied to tender chicken pieces.", images: ["https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80"] },
      { id: 26, name: "Chicken Kophta", price: "440", desc: "Delicate, hand-rolled chicken meatballs seasoned with aromatics, simmered in a rich, dark brown onion gravy.", images: ["https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80"] }
    ],
    "Others": [
      { id: 27, name: "Kadhi Khichdi", price: "250", desc: "The soul of Surat. Comforting yellow lentil khichdi served with a piping hot bowl of spiced, tempered yogurt curry (Kadhi).", images: ["https://images.unsplash.com/photo-1626500155537-883777587788?auto=format&fit=crop&w=800&q=80"] },
      { id: 28, name: "Dal Pulav", price: "280", desc: "Lightly spiced basmati rice paired with a rich, buttery side of slow-cooked arhar dal, tempered with garlic and dry red chilies.", images: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"] },
      { id: 29, name: "Tev Pulav", price: "300", desc: "A traditional Surat street favorite. Vegetable-laden spicy rice cooked with a unique blend of 'Tev' spices and fresh greens.", images: ["https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80"] },
      { id: 30, name: "Manda Dalli", price: "320", desc: "A legacy dish. Hand-stretched, paper-thin Manda rotis served with a special thick-textured lentil preparation.", images: ["https://images.unsplash.com/photo-1505253149613-11b847673558?auto=format&fit=crop&w=800&q=80"] },
      { id: 31, name: "Yakhni Pulav", price: "450", desc: "A subtle, non-spicy meat and rice preparation where the grains are cooked in a clarified meat stock infused with whole spices.", images: ["https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80"] },
      { id: 32, name: "Tuvar-Pulav Palita", price: "350", desc: "Celebrating Surat's agricultural roots. Fresh green Tuvar beans cooked with rice and a specialized spice blend known as 'Palita'.", images: ["https://images.unsplash.com/photo-1512058560366-cd2429ff5c7c?auto=format&fit=crop&w=800&q=80"] },
      { id: 33, name: "Veg Biryani", price: "380", desc: "Seasonal vegetables, paneer, and soy chunks layered with high-aroma rice and fried onions, slow-cooked to perfection.", images: ["https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80"] },
      { id: 34, name: "Veg Pulao", price: "320", desc: "A light and healthy option. Basmati rice tossed with garden-fresh peas, beans, and carrots with a hint of whole black pepper.", images: ["https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"] }
    ]
  },
  Dessert: {
    "Traditional": [
      { id: 35, name: "Sevio ka Shola", price: "220", desc: "A decadent dessert of fine vermicelli cooked in thickened milk, flavored with cardamom and topped with a 'Shola' (spark) of silver leaf.", images: ["https://images.unsplash.com/photo-1589113103553-5384496ff27b?auto=format&fit=crop&w=800&q=80"] },
      { id: 36, name: "Chawal ka Shola", price: "200", desc: "Rich rice pudding (Kheer) slow-reduced until it reaches a creamy, rabri-like consistency, served chilled with toasted nuts.", images: ["https://images.unsplash.com/photo-1596797038583-18a68a637311?auto=format&fit=crop&w=800&q=80"] },
      { id: 37, name: "Jarda", price: "180", desc: "Sweet, saffron-flavored rice cooked with sugar, ghee, and loaded with almonds, cashews, and raisins—a festive Bhatiyara staple.", images: ["https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"] },
      { id: 38, name: "Thuli", price: "160", desc: "Traditional Gujarati cracked wheat dessert cooked with jaggery and ghee, offering a healthy yet indulgent end to the meal.", images: ["https://images.unsplash.com/photo-1621361019047-98319f390886?auto=format&fit=crop&w=800&q=80"] },
      { id: 39, name: "Dudhi Ka Halwa", price: "180", desc: "Fresh bottle gourd grated and slow-cooked with whole milk and sugar, garnished with khoya and silvered pistachios.", images: ["https://images.unsplash.com/photo-1589113103553-5384496ff27b?auto=format&fit=crop&w=800&q=80"] },
      { id: 40, name: "Gajar Ka Halwa", price: "190", desc: "The winter favorite. Seasonal red carrots slow-braised in milk and desi ghee, creating a rich, melt-in-the-mouth texture.", images: ["https://images.unsplash.com/photo-1621361019047-98319f390886?auto=format&fit=crop&w=800&q=80"] },
      { id: 41, name: "Akhrot Ka Halwa", price: "250", desc: "An artisanal walnut paste halwa, rich in omega-3 and earthy flavors, slow-cooked to a dark, caramelized perfection.", images: ["https://images.unsplash.com/photo-1596797038583-18a68a637311?auto=format&fit=crop&w=800&q=80"] }
    ]
  }
};

const Menu = () => {
  const [activeSection, setActiveSection] = useState("Starter");
  const [expandedSubCat, setExpandedSubCat] = useState(null);
  const [expandedDish, setExpandedDish] = useState(null);
  const [dishCounts, setDishCounts] = useState({});
  const [addingId, setAddingId] = useState(null);
  const [showCartBar, setShowCartBar] = useState(false);

  // NEW: State to track session cart for summary card
  const [cartItems, setCartItems] = useState([]);

  // LOGIC: Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDishForDetails, setSelectedDishForDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    date: "",
    time: "",
    phone: ""
  });

  const navigate = useNavigate(); 
  const container = useRef();
  const curtainRef = useRef();
  const cartBarRef = useRef();
  const summaryCardRef = useRef(); // For the smooth GSAP flash

  // Load existing selection on mount
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("ub_cart")) || [];
    setCartItems(data);
    
    // If details already exist in cart, pre-set them for new items
    if (data.length > 0) {
        setOrderDetails({
            date: data[0].orderDate,
            time: data[0].orderTime,
            phone: data[0].phoneNumber
        });
    }
  }, []);

  const getCount = (id) => dishCounts[id] || 10;
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const updateCount = (id, delta) => {
    setDishCounts(prev => {
      const current = prev[id] || 10;
      const next = Math.max(10, Math.min(5000, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const calculatePrice = (basePrice, count) => {
    return Math.round((Number(basePrice) / 10) * count);
  };

  // Logic: Only show modal if this is the first item in the session
  const handleAddToCartRequest = (dish, subCat) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please login to add items!");

    setSelectedDishForDetails({ ...dish, subCat });

    if (cartItems.length === 0) {
        setShowDetailsModal(true);
    } else {
        // Logistics already set, add instantly
        finalizeAddToCart(dish, subCat);
    }
  };

  const validateAndAdd = () => {
    const { date, time, phone } = orderDetails;
    if (!date || !time || !phone) return alert("Please fill all details!");

    // Advance Logic Check (6 Hours)
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);

    if (selectedDateTime < sixHoursLater) {
      return alert("Advance Notice Required: Orders must be placed at least 6 hours before delivery.");
    }

    // Kitchen Hours Check (11:00 AM - 09:00 PM)
    const hours = parseInt(time.split(":")[0]);
    if (hours < 11 || hours >= 21) {
      return alert("Kitchen Hours: We only deliver between 11:00 AM and 9:00 PM.");
    }

    setShowDetailsModal(false);
    finalizeAddToCart(selectedDishForDetails, selectedDishForDetails.subCat);
  };

  const finalizeAddToCart = (dish, subCat) => {
    setAddingId(dish.id);
    const count = getCount(dish.id);
    
    const cartItem = {
      dishId: dish.id,
      name: dish.name,
      category: subCat,
      personCount: count,
      totalPrice: calculatePrice(dish.price, count),
      image: dish.images[0],
      orderDate: orderDetails.date,
      orderTime: orderDetails.time,
      phoneNumber: orderDetails.phone
    };

    const updatedCart = [...cartItems, cartItem];
    localStorage.setItem("ub_cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    setTimeout(() => {
      setAddingId(null);
      setShowCartBar(true);
      
      // GSAP "Flash" Animation on Summary Card
      gsap.fromTo(summaryCardRef.current, 
        { backgroundColor: "#e3b94d", scale: 1.05 }, 
        { backgroundColor: "white", scale: 1, duration: 1, ease: "power4.out" }
      );

      gsap.to(cartBarRef.current, {
        y: 0, opacity: 1, duration: 0.6, ease: "expo.out"
      });
    }, 1200);
  };

  useGSAP(() => {
    gsap.from(".menu-header h1", {
      y: 100, opacity: 0, duration: 1.2, delay: 1.2, ease: "power4.out"
    });
    gsap.from(".section-nav", {
      opacity: 0, y: 20, delay: 1.6, duration: 0.8
    });
  }, { scope: container });

  const handleSectionChange = (section) => {
    if (section === activeSection) return;
    const tl = gsap.timeline();
    tl.to(curtainRef.current, { scaleX: 1, duration: 0.5, ease: "power2.inOut" })
      .add(() => {
        setActiveSection(section);
        setExpandedSubCat(null);
        setExpandedDish(null);
      })
      .set(curtainRef.current, { transformOrigin: "right" })
      .to(curtainRef.current, {
        scaleX: 0, duration: 0.5, ease: "power2.inOut",
        onComplete: () => gsap.set(curtainRef.current, { transformOrigin: "left" })
      });
  };

  return (
    <div className="menu-page" ref={container}>
      <header className="menu-header">
        <p className="editorial-label">CURATED CULINARY HERITAGE</p>
        <h1>THE MENU</h1>
      </header>

      <nav className="section-nav">
        {Object.keys(MENU_DATA).map((section) => (
          <button
            key={section}
            className={`section-btn ${activeSection === section ? "active" : ""}`}
            onClick={() => handleSectionChange(section)}
          >
            {section}
          </button>
        ))}
      </nav>

      <div className="menu-display-area" style={{ position: 'relative' }}>
        <div className="menu-curtain" ref={curtainRef}></div>

        <div className="menu-content">
          {Object.entries(MENU_DATA[activeSection]).map(([subCat, dishes]) => (
            <div key={subCat} className={`sub-cat-block ${expandedSubCat === subCat ? "is-open" : ""}`}>
              <div className="sub-cat-header" onClick={() => setExpandedSubCat(expandedSubCat === subCat ? null : subCat)}>
                <h2>{subCat}</h2>
                <div className="plus-icon sub-plus">
                  <div className="line-v"></div><div className="line-h"></div>
                </div>
              </div>

              <div className="dish-list-container">
                {dishes.map((dish) => {
                  const currentCount = getCount(dish.id);
                  const currentPrice = calculatePrice(dish.price, currentCount);

                  return (
                    <div key={dish.id} className={`dish-item ${expandedDish === dish.id ? "expanded" : ""}`}>
                      <div className="dish-main-row" onClick={() => setExpandedDish(expandedDish === dish.id ? null : dish.id)}>
                        <span className="dish-name">{dish.name}</span>
                        <div className="dish-price-wrap">
                          <span className="price">₹{currentPrice}</span>
                          <div className="plus-icon dish-plus">
                            <div className="line-v"></div><div className="line-h"></div>
                          </div>
                        </div>
                      </div>

                      <div className="dish-details-drawer">
                        <div className="details-content">
                          <div className="editorial-slider">
                            <div className="slider-track">
                              {dish.images.map((img, i) => (
                                <div key={i} className="slide-box">
                                  <img src={img} alt={`${dish.name} ${i}`} />
                                </div>
                              ))}
                            </div>
                            <div className="slider-hint">SCROLL TO EXPLORE →</div>
                          </div>
                          
                          <div className="text-content">
                            <p className="detailed-desc">{dish.desc}</p>
                            <div className="item-controls">
                                <div className="dish-person-counter">
                                    <button onClick={() => updateCount(dish.id, -10)}>-</button>
                                    <div className="count-display">
                                        <span className="num">{currentCount}</span>
                                        <span className="label">PERS.</span>
                                    </div>
                                    <button onClick={() => updateCount(dish.id, 10)}>+</button>
                                </div>
                                <button 
                                  className={`add-btn ${addingId === dish.id ? 'is-loading' : ''}`} 
                                  onClick={() => handleAddToCartRequest(dish, subCat)}
                                  disabled={addingId === dish.id}
                                >
                                  {addingId === dish.id ? (
                                    <span className="loader-text">PREPARING...</span>
                                  ) : (
                                    "ADD TO SELECTION"
                                  )}
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: SELECTION SUMMARY CARD (End of Menu Section) */}
      {cartItems.length > 0 && (
          <div className="selection-summary-container">
              <div className="selection-card" ref={summaryCardRef}>
                  <div className="card-top">
                      <p className="editorial-label">SESSION OVERVIEW</p>
                      <h3>YOUR SELECTION</h3>
                  </div>
                  <div className="logistics-grid">
                      <div className="log-item">
                          <label>DELIVERY DATE</label>
                          <p>{cartItems[0].orderDate}</p>
                      </div>
                      <div className="log-item">
                          <label>DELIVERY TIME</label>
                          <p>{cartItems[0].orderTime}</p>
                      </div>
                      <div className="log-item">
                          <label>CONTACT PHONE</label>
                          <p>{cartItems[0].phoneNumber}</p>
                      </div>
                  </div>
                  <div className="mini-item-list">
                      {cartItems.map((item, index) => (
                          <div key={index} className="mini-item">
                              <span>{item.name}</span>
                              <span className="dot-line"></span>
                              <span>₹{item.totalPrice}</span>
                          </div>
                      ))}
                  </div>
                  <div className="card-footer">
                      <div className="total-stack">
                          <label>SUBTOTAL</label>
                          <span className="price-total">₹{cartItems.reduce((acc, curr) => acc + curr.totalPrice, 0)}</span>
                      </div>
                      <Link to="/cart" className="go-to-cart-btn">PROCEED TO BASKET</Link>
                  </div>
              </div>
          </div>
      )}

      {/* MODAL OVERLAY: Logistics Input */}
      {showDetailsModal && (
        <div className="details-modal-overlay">
          <div className="details-modal">
            <h2>LOGISTICS</h2>
            <p style={{fontFamily: 'Montserrat', fontSize: '10px', letterSpacing: '2px', color: '#e3b94d', marginBottom: '30px'}}>UNIFIED SELECTION DETAILS</p>
            
            <div className="modal-input-group">
              <label>DATE</label>
              <input type="date" min={getTodayDate()} onChange={(e) => setOrderDetails({...orderDetails, date: e.target.value})} />
            </div>

            <div className="modal-input-group">
              <label>TIME (11 AM - 9 PM)</label>
              <input type="time" onChange={(e) => setOrderDetails({...orderDetails, time: e.target.value})} />
            </div>

            <div className="modal-input-group">
                <label>PHONE</label>
                <input type="tel" placeholder="10-digit mobile" onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})} />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDetailsModal(false)}>CANCEL</button>
              <button className="confirm-btn" onClick={validateAndAdd}>CONFIRM</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar (Kept for instant confirmation) */}
      <div 
        className={`floating-cart-bar ${showCartBar ? 'visible' : ''}`} 
        ref={cartBarRef}
      >
        <div className="bar-content">
          <p>ITEM ADDED TO YOUR SELECTION</p>
          <div className="bar-actions">
            <button className="continue-btn" onClick={() => setShowCartBar(false)}>CONTINUE BROWSING</button>
            <Link to="/cart" className="go-to-cart-btn">VIEW BASKET</Link>
          </div>
        </div>
      </div>

      <footer className="menu-policy-note">
        <p>ARTISANAL QUALITY | MIN 10 PERSONS | MAX ORDER ₹5,000</p>
      </footer>
    </div>
  );
};

export default Menu;