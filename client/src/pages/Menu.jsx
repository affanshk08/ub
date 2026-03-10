import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate, Link } from "react-router-dom";
import "./Menu.css";

// 1. Base Menu Data (Preserved for Images and Nested Structure)
const initialMenuData = {
  veg: {
    "Farsan": {
      "Steamed Classics": [
        { id: "v1", name: "Surti Locho", price: "500", desc: "A Surat specialty. Steamed, spiced gram flour base served hot with oil, butter, and a signature locho masala.", images: ["https://s3-ap-south-1.amazonaws.com/betterbutterbucket-silver/taqizaki-khan20180620192231869.jpeg"] },
        { id: "v2", name: "Khaman", price: "450", desc: "Soft, spongy steamed cakes made from fermented chana dal, tempered with mustard seeds and green chilies.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp7ZmClW4HbmYTCwqFMbvq-zF6fHZxJddnEg&s"] },
        { id: "v3", name: "Khandvi", price: "440", desc: "Thin, tightly rolled bite-sized pieces made from gram flour and yogurt, garnished with fresh coconut and cilantro.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa2ZMAFfN-rBcwL-bp9R1iJUhoHO0v6DANIw&s"] },
        { id: "v4", name: "Idada (White Dhokla)", price: "780", desc: "Traditional white steamed dhokla made from a fermented batter of rice and urad dal, heavily dusted with black pepper.", images: ["https://i.ytimg.com/vi/Oz34j5---iQ/maxresdefault.jpg"] },
        { id: "v5", name: "Patra", price: "1200", desc: "Colocasia leaves smeared with a sweet, spicy, and tangy gram flour paste, rolled, steamed, and sliced.", images: ["https://i.ndtvimg.com/i/2018-02/patra_620x330_51518071961.jpg?auto=format&fit=crop&w=800&q=80"] }
      ],
      "Crispy Delights": [
        { id: "v6", name: "Lilva Kachori", price: "300", desc: "Crispy, deep-fried pastry balls stuffed with a fresh, seasonal green pigeon peas (tuvar lilva) filling.", images: ["https://www.nehascookbook.com/wp-content/uploads/2020/11/Lilva-kachori-WS-500x500.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v7", name: "Methi Na Gota", price: "620", desc: "Golden, crispy fritters made with gram flour, fresh fenugreek leaves, and whole coriander seeds.", images: ["https://www.nehascookbook.com/wp-content/uploads/2022/09/Mix-bhaji-gota-WS-1.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v8", name: "Dahi Vada", price: "350", desc: "Soft lentil dumplings soaked in creamy, whipped sweet yogurt, topped with tamarind and mint chutneys.", images: ["https://ministryofcurry.com/wp-content/uploads/2016/08/Dahi-Vada-5-500x375.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v9", name: "Mix Veg Samosa", price: "520", desc: "Classic flaky pastry filled with a savory mixture of spiced potatoes, peas, and carrots.", images: ["https://vadilalglobal.com/cdn/shop/files/Mixed_Veg_Samosa.jpg?v=1724914627&width=1946?auto=format&fit=crop&w=800&q=80"] },
        { id: "v10", name: "Kele Ki Tikki", price: "630", desc: "Pan-fried patties made from raw bananas and subtle fasting-friendly spices.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEfZdF72oEPAhY8sECacNl85Ry3wV0saDGaA&s?auto=format&fit=crop&w=800&q=80"] }
      ]
    },
    "Main Course": {
      "Traditional Shaak": [
        { id: "v11", name: "Surti Undhiyu", price: "400", desc: "The legendary Surat winter stew. A complex, slow-cooked mix of seasonal vegetables, muthiya, and fresh green garlic.", images: ["https://static.toiimg.com/thumb/60855023.cms?imgsize=339997&width=800&height=800?auto=format&fit=crop&w=800&q=80"] },
        { id: "v12", name: "Sev Tameta", price: "500", desc: "A Kathiyawadi staple. Sweet and spicy tomato curry garnished with a thick layer of crispy besan sev.", images: ["https://thewhiskaddict.com/wp-content/uploads/2024/12/IMG_1265-scaled.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v13", name: "Ringan No Olo", price: "430", desc: "Fire-roasted eggplant mashed and cooked with spring onions, green garlic, and fresh tomatoes.", images: ["https://img.gujaratijagran.com/2024/11/Ringna-No-Olo-Baingan-Bharta-Recipe.jpg.webp?auto=format&fit=crop&w=800&q=80"] },
        { id: "v14", name: "Lasaniya Batata", price: "350", desc: "Baby potatoes simmered in a fierce, red chili and heavy garlic sauce.", images: ["https://cdn1.foodviva.com/static-content/food-images/gujarati-recipes/lasaniya-batata-recipe-spicy-baby-potatoes-with-garlic/lasaniya-batata-recipe-spicy-baby-potatoes-with-garlic.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v15", name: "Bharela Bhinda", price: "370", desc: "Whole okra stuffed with a roasted blend of besan, peanuts, coriander powder, and jaggery.", images: ["https://cdn.indiaphile.info/wp-content/uploads/2023/02/stp-bharela-bhinda-nu-shaak-8150.jpg?width=1200&format=webp?auto=format&fit=crop&w=800&q=80"] },
        { id: "v16", name: "Kaju Karela", price: "400", desc: "Bitter gourd roundels cooked with premium whole cashews to balance the bitterness with a rich sweetness.", images: ["https://www.nehascookbook.com/wp-content/uploads/2024/05/Kaju-karela-shaak-WS-1.jpg?auto=format&fit=crop&w=800&q=80"] }
      ],
      "Paneer & Rich Gravies": [
        { id: "v17", name: "Paneer Butter Masala", price: "400", desc: "Soft cubes of paneer immersed in a rich, creamy, and mildly sweet tomato gravy.", images: ["https://myfoodstory.com/wp-content/uploads/2021/07/restaurant-style-paneer-butter-masala-2-500x500.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v18", name: "Kaju Curry", price: "450", desc: "Roasted whole cashews in a thick, brown onion and tomato base with warming spices.", images: ["https://cdn2.foodviva.com/static-content/food-images/curry-recipes/kaju-curry/kaju-curry.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v19", name: "Palak Paneer", price: "400", desc: "Fresh spinach puree cooked with ginger, garlic, and paneer cubes, finished with cream.", images: ["https://www.cookwithmanali.com/wp-content/uploads/2019/08/Palak-Paneer.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v20", name: "Malai Kofta", price: "400", desc: "Deep-fried potato and paneer dumplings served in a luxurious, white cashew gravy.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsT8TUD-NzEQeESGXCTvbEFMbcMp-heDW-Kw&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "v21", name: "Veg Kadai", price: "430", desc: "Mixed seasonal vegetables tossed in an iron wok with ground coriander and dry red chilies.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWbIIYy4Ri82T_qyPotNQUcMNDuTZpeYIWaA&s?auto=format&fit=crop&w=800&q=80"] }
      ],
      "Dal & Rice": [
        { id: "v22", name: "Dal Dhokli", price: "300", desc: "A comforting Gujarati classic. Spiced wheat flour pieces simmered in a sweet, sour, and spicy tuvar dal.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAUTQ6JYebLSdaR-J8G6FPRNff-qKJT6-anA&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "v23", name: "Kadhi Khichdi", price: "350", desc: "Simple yellow lentil and rice khichdi served alongside a warm, spiced yogurt and besan kadhi.", images: ["https://www.nehascookbook.com/wp-content/uploads/2022/10/Bardoli-khichdi-WS.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v24", name: "Surti Dal", price: "350", desc: "A sweet and tangy pigeon pea lentil preparation tempered with peanuts, tomatoes, and kokum.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNEg2o5GT3aGcMWf580SWOTNz-vy5VM-S0yw&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "v25", name: "Rajwadi Khichdi", price: "400", desc: "A rich, vegetable-loaded khichdi tempered generously with whole spices and pure desi ghee.", images: ["https://i.ytimg.com/vi/RPRORGFaC3o/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDKcIY1dWtK1cgWuk80HRQhpPifoQ?auto=format&fit=crop&w=800&q=80"] },
        { id: "v26", name: "Veg Pulao", price: "350", desc: "Light, fragrant basmati rice tossed with green peas, carrots, and french beans.", images: ["https://www.indianveggiedelight.com/wp-content/uploads/2019/07/veg-pulao-featured-500x500.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v27", name: "Jeera Rice", price: "280", desc: "Fluffy basmati rice tempered with roasted cumin seeds and fresh coriander.", images: ["https://delishbite.in/wp-content/uploads/2023/07/Blog_1-3-500x500.jpg?crop=1?auto=format&fit=crop&w=800&q=80"] }
      ]
    },
    "Mithai": {
      "Traditional": [
        { id: "v28", name: "Surti Ghari", price: "300", desc: "The pinnacle of Surat's sweets. A rich disc made of puri dough, mawa, ghee, and sugar, packed with nuts.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAXXJN8n0doghkEc2vuHw0ZlI068p1HsCJag&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "v29", name: "Kesar Shrikhand", price: "620", desc: "Thick, strained yogurt sweetened and flavored deeply with saffron threads and cardamom.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeW3v_MKIkaFmnSOhzBkp0SJHQGBNz2uut7g&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "v30", name: "Basundi", price: "500", desc: "Sweetened, dense milk boiled down to a creamy texture, served chilled with sliced almonds.", images: ["https://www.sharmispassions.com/wp-content/uploads/2014/12/basundi4.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v31", name: "Mohanthal", price: "300", desc: "Traditional gram flour fudge enriched with generous amounts of ghee, offering a granular, melt-in-mouth texture.", images: ["https://www.sharmispassions.com/wp-content/uploads/2014/12/basundi4.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v32", name: "Kopra Pak", price: "500", desc: "A soft, moist coconut fudge flavored lightly with saffron and cardamom.", images: ["https://www.chefkunalkapur.com/wp-content/uploads/2024/10/mohanthal-1300x731.jpg?v=1730169543?auto=format&fit=crop&w=800&q=80"] },
        { id: "v33", name: "Churma Ladoo", price: "420", desc: "Crushed, fried wheat dough mixed with ghee and jaggery, rolled into delicious festive spheres.", images: ["https://www.cookingcarnival.com/wp-content/uploads/2021/09/Churma-ladoo-recipe.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "v34", name: "Dudhi Halwa", price: "520", desc: "Fresh bottle gourd slow-cooked with whole milk until reduced, garnished with khoya.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqBnjN8Kb6LbtQNmtAoV4HyyzdumQP_cB5Dg&s?auto=format&fit=crop&w=800&q=80"] }
      ]
    }
  },
  nonveg: {
    Starter: {
      "Tikka": [
        { id: "n1", name: "Malai Tikka", price: "30", desc: "A royal Bhatiyara classic. Tender chicken chunks are marinated for 12 hours in a velvety blend of heavy cream, hung curd, and cashew paste.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDHAI_bbuCZQ0ws2ojtmyxM0vrFkIMXpD6GQ&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "n2", name: "Golden Tikka", price: "30", desc: "Infused with high-grade saffron and fresh turmeric, this tikka offers a vibrant hue and a warm, earthy flavor profile.", images: ["https://dukaan.b-cdn.net/700x700/webp/295487/35a1cb46-27e2-4ab1-8022-e4cb731de3d9.png?auto=format&fit=crop&w=800&q=80"] },
        { id: "n3", name: "Kashmiri Tikka", price: "40", desc: "A mild yet aromatic preparation using authentic Kashmiri red chilies and mace.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR--a-wg8SSwtuACNGsDlvzIdb5yf4awHvkHw&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "n4", name: "Machhi Masal Tikka", price: "40", desc: "Fresh river fish fillets marinated in a robust Bhatiyara 'masal'—a secret blend of 21 spices.", images: ["https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/chicken-tikka-masala-recipe.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "n5", name: "Hindustani Tikka", price: "40", desc: "Inspired by the bold street flavors of Lahore, heavily spiced with crushed coriander.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCPq4FKrNc6gICL3O6sHOiMKpzno1rWxiLGA&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "n6", name: "Schezwan Tikka", price: "30", desc: "A contemporary Surat fusion where tradition meets the orient.", images: ["https://img-cdn.publive.online/fit-in/1200x675/filters:format(webp)/sanjeev-kapoor/media/post_banners/ff9dc23dcc4beb1df4c260442df74561dc8f56b428e81cdb0aef6eba35ba2ca8.jpg?auto=format&fit=crop&w=800&q=80"] }
      ],
      "Tangdi": [
        { id: "n7", name: "Makhhan Mari Tangdi", price: "4", desc: "Succulent chicken drumsticks glazed with clarified butter (Makhhan) and cracked Tellicherry black pepper.", images: ["https://i.ytimg.com/vi/7fIysz9p9NM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD9Kb7XTnsADUHQbRhdrZdJRxAlqg?auto=format&fit=crop&w=800&q=80"] },
        { id: "n8", name: "Irani Tangdi", price: "4", desc: "A heritage recipe featuring a marinade of pomegranate molasses and dried herbs.", images: ["https://i.ytimg.com/vi/frvi3CLk3XA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCuaLwbpWe95uydJG-ctj4R5MXWBw?auto=format&fit=crop&w=800&q=80"] },
        { id: "n9", name: "Schezwan Tangdi", price: "40", desc: "Jumbo drumsticks marinated overnight and finished in a high-flame wok.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt_LImNWFGJA6BPezf-fZ6taT-CnQ9_ThreQ&s?auto=format&fit=crop&w=800&q=80"] }
      ],
      "Rolls & Others": [
        { id: "n10", name: "Tiranga Roll", price: "3", desc: "Three distinct layers of chicken mince rolled together and lightly fried.", images: ["https://i.ytimg.com/vi/IgOe46v0Dik/maxresdefault.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "n11", name: "Cheese Chicken Roll", price: "3", desc: "Crispy golden crust wrapping a molten blend of premium cheese and spicy chicken chunks.", images: ["https://i.ytimg.com/vi/-xy3pLz2QWg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLALHkJz7hI-9bjHT__MtJHgQTGPsA?auto=format&fit=crop&w=800&q=80"] },
        { id: "n12", name: "Mutton Cutlet", price: "4", desc: "Traditional Bhatiyara mutton cutlets, hand-pounded and seasoned with fresh mint.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1YTjZihzPs8KxN6F8c37D8iRRbFbiNwjMyg&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "n13", name: "Chicken Seekh Kebab", price: "3", desc: "Minced chicken seasoned with roasted cumin and fresh coriander, skewered and grilled.", images: ["https://i.ytimg.com/vi/hA3-yD23npM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCoNma_2OAQE0o8y8D5rbspFuvIiA?auto=format&fit=crop&w=800&q=80"] }
      ]
    },
    "Main Course": {
      "Biryani": [
        { id: "n14", name: "Mutton Dum Biryani", price: "6", desc: "The ultimate celebration of meat and rice. Slow-cooked in a heavy copper handi.", images: ["https://www.cubesnjuliennes.com/wp-content/uploads/2021/03/Best-Mutton-Biryani-Recipe.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "n15", name: "Chicken Tikka Biryani", price: "5", desc: "A smoky delight where tandoor-roasted chicken tikkas are layered with biryani rice.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTRuUB5uYLdSdfZxJa9s-vs63SzmT90BLUOQ&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "n16", name: "Mutton Seekh Biryani", price: "6", desc: "Juicy mutton seekh kebabs are nestled within layers of saffron-infused rice.", images: ["https://i.ytimg.com/vi/HoHgZLFourY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD31Gz3OIPXeKgCw8HNXFxXTDDn9g?auto=format&fit=crop&w=800&q=80"] },
        { id: "n17", name: "Italian Chicken Biryani", price: "60", desc: "A global fusion featuring Mediterranean herbs cooked with olive oil alongside traditional spices.", images: ["https://i.ytimg.com/vi/Pv-OHu4oR6M/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAuQvk8oqb9phdmrg-ABiBGcSapeg?auto=format&fit=crop&w=800&q=80"] },
        { id: "n18", name: "Nargisi Kofta Biryani", price: "70", desc: "Royal biryani served with Nargisi Koftas—hard-boiled eggs encased in spiced minced meat.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMLuo6AWTV4L01ok8peBmxC-UZf3TXwW79ZQ&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "n19", name: "Chicken Dum Biryani", price: "50", desc: "Classic chicken and basmati rice slow-cooked in a sealed dough handi.", images: ["https://vismaifood.com/storage/app/uploads/public/e12/7b7/127/thumb__1200_0_0_0_auto.jpg?auto=format&fit=crop&w=800&q=80"] }
      ],
      "Gravy": [
        { id: "n20", name: "Chicken Angara", price: "40", desc: "A fiery red, spicy gravy that carries the 'Angar' (fire) of Surat.", images: ["https://i.ytimg.com/vi/jrAh2aUpniA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBXU8g5w01i799lj360xFJVhVBN7g?auto=format&fit=crop&w=800&q=80"] },
        { id: "n21", name: "Chicken Kadai", price: "40", desc: "Cooked in a traditional iron wok with chunks of bell peppers and onions.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiu7hpTeKhbkOWrIrRWActdk8E40NkAuAMxQ&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "n22", name: "Chicken Patiyala", price: "40", desc: "A rich, cashew-based yellow gravy hidden under a thin, lacy egg omelet.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxysSw0LK5dbaNWrU31RQ0EOLvS4lGdR7CdQ&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "n23", name: "Butter Chicken", price: "40", desc: "The timeless classic. Shredded tandoori chicken simmered in a tomato, butter, and cream sauce.", images: ["https://www.indianhealthyrecipes.com/wp-content/uploads/2023/04/butter-chicken-recipe-500x500.jpg?auto=format&fit=crop&w=800&q=80"] },
        { id: "n24", name: "Golden Chicken", price: "40", desc: "Our signature white gravy, enriched with cream, almonds, and saffron.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRb0NZ1TQwkOTAwqUpggy4yLbd5O-8O3kclw&s?auto=format&fit=crop&w=800&q=80"] },
        { id: "n25", name: "Machhi Masala Chicken", price: "50", desc: "Tangy and spicy green-masala blend applied to tender chicken pieces.", images: ["https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80"] },
        { id: "n26", name: "Chicken Kophta Curry", price: "40", desc: "Delicate, hand-rolled chicken meatballs simmered in a rich, dark brown onion gravy.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrSg5M2g7qmZMwZv6Wi4HfuLYf9d557JADmQ&s?auto=format&fit=crop&w=800&q=80"] }
      ],
    },
  }
};

const Menu = () => {
  const [menuData, setMenuData] = useState(initialMenuData);
  const [isVeg, setIsVeg] = useState(true);

  const currentMenu = isVeg ? menuData.veg : menuData.nonveg;
  const [activeSection, setActiveSection] = useState(Object.keys(currentMenu)[0]);

  const [expandedSubCat, setExpandedSubCat] = useState(null);
  const [expandedDish, setExpandedDish] = useState(null);
  const [dishCounts, setDishCounts] = useState({});
  const [addingId, setAddingId] = useState(null);
  const [showCartBar, setShowCartBar] = useState(false);

  // Custom Alert State
  const [customAlert, setCustomAlert] = useState(null);
  const [cartItems, setCartItems] = useState([]);

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
  const summaryCardRef = useRef();

  // FETCH MENU FROM DB AND MERGE IT WITH HARDCODED DATA
  useEffect(() => {
    const fetchDBMenu = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/menu`);
        const dbItems = await res.json();
        
        if(dbItems.length > 0) {
          // Deep clone the hardcoded data
          const updatedMenu = JSON.parse(JSON.stringify(initialMenuData));
          
          // Create a new section for Admin items
          updatedMenu.veg["New Additions"] = { "Chef's Specials": [] };
          updatedMenu.nonveg["New Additions"] = { "Chef's Specials": [] };

          dbItems.forEach(item => {
            if (item.isCombo) return; // Skip combos, they belong in wedding booking

            const formattedItem = {
              id: item._id,
              name: item.name,
              price: item.price,
              desc: item.description || "Freshly added to the menu by our head chef.",
              images: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"] // Default culinary image
            };

            // Simple logic: if name contains 'chicken' or 'mutton', put in non-veg
            const isNonVeg = item.name.toLowerCase().includes('chicken') || item.name.toLowerCase().includes('mutton') || item.name.toLowerCase().includes('fish');
            
            if (isNonVeg) {
              updatedMenu.nonveg["New Additions"]["Chef's Specials"].push(formattedItem);
            } else {
              updatedMenu.veg["New Additions"]["Chef's Specials"].push(formattedItem);
            }
          });

          // Clean up empty addition categories
          if(updatedMenu.veg["New Additions"]["Chef's Specials"].length === 0) delete updatedMenu.veg["New Additions"];
          if(updatedMenu.nonveg["New Additions"]["Chef's Specials"].length === 0) delete updatedMenu.nonveg["New Additions"];

          setMenuData(updatedMenu);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic menu:", err);
      }
    };
    fetchDBMenu();
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("ub_cart")) || [];
    setCartItems(data);

    if (data.length > 0) {
      setOrderDetails({
        date: data[0].orderDate,
        time: data[0].orderTime,
        phone: data[0].phoneNumber
      });
    }
  }, []);

  const getCount = (id) => dishCounts[id] !== undefined ? dishCounts[id] : 10;
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const updateCount = (id, delta) => {
    setDishCounts(prev => {
      const current = prev[id] === "" ? 10 : parseInt(prev[id], 10) || 10;
      const next = Math.max(10, Math.min(5000, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleManualCountChange = (id, value) => {
    const val = value === "" ? "" : parseInt(value, 10);
    setDishCounts(prev => ({ ...prev, [id]: val }));
  };

  const handleCountBlur = (id) => {
    setDishCounts(prev => {
      const current = prev[id];
      if (current === "" || current < 10 || isNaN(current)) return { ...prev, [id]: 10 };
      if (current > 5000) return { ...prev, [id]: 5000 };
      return prev;
    });
  };

  const calculatePrice = (basePrice, count) => {
    const validCount = parseInt(count) || 0;
    return Math.round((Number(basePrice) / 10) * validCount);
  };

  const closeCustomAlert = () => {
    if (customAlert?.onClose) {
      customAlert.onClose();
    }
    setCustomAlert(null);
  };

  const handleAddToCartRequest = (dish, subCat) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setCustomAlert({
        type: "error",
        message: "Please login to add items!",
        onClose: () => navigate("/login")
      });
      return;
    }

    const finalCount = getCount(dish.id) === "" ? 10 : getCount(dish.id);
    if (finalCount < 10) {
      updateCount(dish.id, 0);
      setCustomAlert({ type: "error", message: "Minimum order must be for 10 persons." });
      return;
    }

    setSelectedDishForDetails({ ...dish, subCat });

    if (cartItems.length === 0) {
      setShowDetailsModal(true);
    } else {
      finalizeAddToCart(dish, subCat);
    }
  };

  const validateAndAdd = () => {
    const { date, time, phone } = orderDetails;
    if (!date || !time || !phone) {
      setCustomAlert({ type: "error", message: "Please fill all details!" });
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);

    if (selectedDateTime < sixHoursLater) {
      setCustomAlert({ type: "error", message: "Advance Notice Required: Orders must be placed at least 6 hours before delivery." });
      return;
    }

    const hours = parseInt(time.split(":")[0]);
    if (hours < 11 || hours >= 21) {
      setCustomAlert({ type: "error", message: "Kitchen Hours: We only deliver between 11:00 AM and 9:00 PM." });
      return;
    }

    setShowDetailsModal(false);
    finalizeAddToCart(selectedDishForDetails, selectedDishForDetails.subCat);
  };

  const finalizeAddToCart = (dish, subCat) => {
    setAddingId(dish.id);

    const count = getCount(dish.id) === "" ? 10 : getCount(dish.id);

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

      if (summaryCardRef.current) {
        gsap.fromTo(summaryCardRef.current,
          { backgroundColor: "#e3b94d", scale: 1.05 },
          { backgroundColor: "white", scale: 1, duration: 1, ease: "power4.out" }
        );
      }

      gsap.to(cartBarRef.current, {
        y: 0, opacity: 1, duration: 0.6, ease: "expo.out"
      });
    }, 1200);
  };

  useGSAP(() => {
    gsap.from(".menu-header h1", {
      y: 100, opacity: 0, duration: 1.2, delay: 1.2, ease: "power4.out"
    });
    gsap.from(".type-toggle-container", {
      opacity: 0, y: 20, delay: 1.4, duration: 0.8
    });
    gsap.from(".section-nav", {
      opacity: 0, y: 20, delay: 1.6, duration: 0.8
    });
  }, { scope: container });

  const animateCurtainChange = (callback) => {
    const tl = gsap.timeline();
    tl.to(curtainRef.current, { scaleX: 1, duration: 0.5, ease: "power2.inOut" })
      .add(() => {
        callback();
      })
      .set(curtainRef.current, { transformOrigin: "right" })
      .to(curtainRef.current, {
        scaleX: 0, duration: 0.5, ease: "power2.inOut",
        onComplete: () => gsap.set(curtainRef.current, { transformOrigin: "left" })
      });
  };

  const handleSectionChange = (section) => {
    if (section === activeSection) return;
    animateCurtainChange(() => {
      setActiveSection(section);
      setExpandedSubCat(null);
      setExpandedDish(null);
    });
  };

  const handleTypeToggle = (setToVeg) => {
    if (isVeg === setToVeg) return;
    animateCurtainChange(() => {
      setIsVeg(setToVeg);
      const newMenu = setToVeg ? menuData.veg : menuData.nonveg;
      setActiveSection(Object.keys(newMenu)[0]);
      setExpandedSubCat(null);
      setExpandedDish(null);
    });
  };

  return (
    <div className="menu-page" ref={container}>
      <header className="menu-header">
        <p className="editorial-label">CURATED CULINARY HERITAGE</p>
        <h1>THE MENU</h1>
      </header>

      <div className="type-toggle-container">
        <div className={`type-toggle ${!isVeg ? 'nonveg' : ''}`}>
          <div className="toggle-slider"></div>
          <div className={`toggle-btn ${isVeg ? 'active' : ''}`} onClick={() => handleTypeToggle(true)}>
            PURE VEG
          </div>
          <div className={`toggle-btn ${!isVeg ? 'active' : ''}`} onClick={() => handleTypeToggle(false)}>
            NON-VEG
          </div>
        </div>
      </div>

      <nav className="section-nav">
        {Object.keys(currentMenu).map((section) => (
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
          {Object.entries(currentMenu[activeSection] || {}).map(([subCat, dishes]) => (
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
                            <p className="detailed-desc">
                              {dish.desc}
                              <br />
                              <span className="per-person-cost">₹{Math.round(dish.price / 10)} PER PERSON</span>
                            </p>
                            <div className="item-controls">
                              <div className="dish-person-counter">
                                <button onClick={() => updateCount(dish.id, -10)}>-</button>
                                <div className="count-display">
                                  <input
                                    type="number"
                                    value={currentCount}
                                    onChange={(e) => handleManualCountChange(dish.id, e.target.value)}
                                    onBlur={() => handleCountBlur(dish.id)}
                                  />
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

      {showDetailsModal && (
        <div className="details-modal-overlay">
          <div className="details-modal">
            <h2>LOGISTICS</h2>
            <p style={{ fontFamily: 'Montserrat', fontSize: '10px', letterSpacing: '2px', color: '#e3b94d', marginBottom: '30px' }}>UNIFIED SELECTION DETAILS</p>

            <div className="modal-input-group">
              <label>DATE</label>
              <input type="date" min={getTodayDate()} onChange={(e) => setOrderDetails({ ...orderDetails, date: e.target.value })} />
            </div>

            <div className="modal-input-group">
              <label>TIME (11 AM - 9 PM)</label>
              <input type="time" onChange={(e) => setOrderDetails({ ...orderDetails, time: e.target.value })} />
            </div>

            <div className="modal-input-group">
              <label>PHONE</label>
              <input type="tel" placeholder="10-digit mobile" onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })} />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDetailsModal(false)}>CANCEL</button>
              <button className="confirm-btn" onClick={validateAndAdd}>CONFIRM</button>
            </div>
          </div>
        </div>
      )}

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

      {customAlert && (
        <div className="custom-alert-overlay">
          <div className={`custom-alert-box ${customAlert.type}`}>
            <h3>{customAlert.type === "success" ? "SUCCESS" : "ATTENTION"}</h3>
            <p>{customAlert.message}</p>
            <button className="custom-alert-btn" onClick={closeCustomAlert}>
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Menu;