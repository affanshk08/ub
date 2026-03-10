import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

// --- 24 PREMIUM WEDDING COMBOS (SYNCED EXACTLY WITH MENU.JSX) ---
const WEDDING_COMBOS = [
  // --- VEG COMBOS ---
  { id: "wv1", type: "veg", name: "The Grand Surti Feast", price: 950, items: [
      { name: "Surti Locho", image: "https://s3-ap-south-1.amazonaws.com/betterbutterbucket-silver/taqizaki-khan20180620192231869.jpeg", desc: "A Surat specialty. Steamed, spiced gram flour base served hot with oil, butter, and a signature locho masala." },
      { name: "Surti Undhiyu", image: "https://static.toiimg.com/thumb/60855023.cms?imgsize=339997&width=800&height=800?auto=format&fit=crop&w=800&q=80", desc: "The legendary Surat winter stew. A complex, slow-cooked mix of seasonal vegetables, muthiya, and fresh green garlic." },
      { name: "Surti Dal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNEg2o5GT3aGcMWf580SWOTNz-vy5VM-S0yw&s?auto=format&fit=crop&w=800&q=80", desc: "A sweet and tangy pigeon pea lentil preparation tempered with peanuts, tomatoes, and kokum." },
      { name: "Surti Ghari", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAXXJN8n0doghkEc2vuHw0ZlI068p1HsCJag&s?auto=format&fit=crop&w=800&q=80", desc: "The pinnacle of Surat's sweets. A rich disc made of puri dough, mawa, ghee, and sugar, packed with nuts." }
    ]
  },
  { id: "wv2", type: "veg", name: "Royal Kathiyawadi", price: 880, items: [
      { name: "Methi Na Gota", image: "https://www.nehascookbook.com/wp-content/uploads/2022/09/Mix-bhaji-gota-WS-1.jpg?auto=format&fit=crop&w=800&q=80", desc: "Golden, crispy fritters made with gram flour, fresh fenugreek leaves, and whole coriander seeds." },
      { name: "Sev Tameta", image: "https://thewhiskaddict.com/wp-content/uploads/2024/12/IMG_1265-scaled.jpg?auto=format&fit=crop&w=800&q=80", desc: "A Kathiyawadi staple. Sweet and spicy tomato curry garnished with a thick layer of crispy besan sev." },
      { name: "Rajwadi Khichdi", image: "https://i.ytimg.com/vi/RPRORGFaC3o/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDKcIY1dWtK1cgWuk80HRQhpPifoQ?auto=format&fit=crop&w=800&q=80", desc: "A rich, vegetable-loaded khichdi tempered generously with whole spices and pure desi ghee." },
      { name: "Mohanthal", image: "https://www.sharmispassions.com/wp-content/uploads/2014/12/basundi4.jpg?auto=format&fit=crop&w=800&q=80", desc: "Traditional gram flour fudge enriched with generous amounts of ghee, offering a granular, melt-in-mouth texture." }
    ]
  },
  { id: "wv3", type: "veg", name: "The Classic Gujarati", price: 850, items: [
      { name: "Khaman", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp7ZmClW4HbmYTCwqFMbvq-zF6fHZxJddnEg&s", desc: "Soft, spongy steamed cakes made from fermented chana dal, tempered with mustard seeds and green chilies." },
      { name: "Ringan No Olo", image: "https://img.gujaratijagran.com/2024/11/Ringna-No-Olo-Baingan-Bharta-Recipe.jpg.webp?auto=format&fit=crop&w=800&q=80", desc: "Fire-roasted eggplant mashed and cooked with spring onions, green garlic, and fresh tomatoes." },
      { name: "Kadhi Khichdi", image: "https://www.nehascookbook.com/wp-content/uploads/2022/10/Bardoli-khichdi-WS.jpg?auto=format&fit=crop&w=800&q=80", desc: "Simple yellow lentil and rice khichdi served alongside a warm, spiced yogurt and besan kadhi." },
      { name: "Basundi", image: "https://www.sharmispassions.com/wp-content/uploads/2014/12/basundi4.jpg?auto=format&fit=crop&w=800&q=80", desc: "Sweetened, dense milk boiled down to a creamy texture, served chilled with sliced almonds." }
    ]
  },
  { id: "wv4", type: "veg", name: "Monsoon Cravings", price: 920, items: [
      { name: "Lilva Kachori", image: "https://www.nehascookbook.com/wp-content/uploads/2020/11/Lilva-kachori-WS-500x500.jpg?auto=format&fit=crop&w=800&q=80", desc: "Crispy, deep-fried pastry balls stuffed with a fresh, seasonal green pigeon peas (tuvar lilva) filling." },
      { name: "Lasaniya Batata", image: "https://cdn1.foodviva.com/static-content/food-images/gujarati-recipes/lasaniya-batata-recipe-spicy-baby-potatoes-with-garlic/lasaniya-batata-recipe-spicy-baby-potatoes-with-garlic.jpg?auto=format&fit=crop&w=800&q=80", desc: "Baby potatoes simmered in a fierce, red chili and heavy garlic sauce." },
      { name: "Jeera Rice", image: "https://delishbite.in/wp-content/uploads/2023/07/Blog_1-3-500x500.jpg?crop=1?auto=format&fit=crop&w=800&q=80", desc: "Fluffy basmati rice tempered with roasted cumin seeds and fresh coriander." },
      { name: "Churma Ladoo", image: "https://www.cookingcarnival.com/wp-content/uploads/2021/09/Churma-ladoo-recipe.jpg?auto=format&fit=crop&w=800&q=80", desc: "Crushed, fried wheat dough mixed with ghee and jaggery, rolled into delicious festive spheres." }
    ]
  },
  { id: "wv5", type: "veg", name: "Premium Paneer Banquet", price: 1100, items: [
      { name: "Khandvi", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa2ZMAFfN-rBcwL-bp9R1iJUhoHO0v6DANIw&s", desc: "Thin, tightly rolled bite-sized pieces made from gram flour and yogurt, garnished with fresh coconut and cilantro." },
      { name: "Paneer Butter Masala", image: "https://myfoodstory.com/wp-content/uploads/2021/07/restaurant-style-paneer-butter-masala-2-500x500.jpg?auto=format&fit=crop&w=800&q=80", desc: "Soft cubes of paneer immersed in a rich, creamy, and mildly sweet tomato gravy." },
      { name: "Veg Pulao", image: "https://www.indianveggiedelight.com/wp-content/uploads/2019/07/veg-pulao-featured-500x500.jpg?auto=format&fit=crop&w=800&q=80", desc: "Light, fragrant basmati rice tossed with green peas, carrots, and french beans." },
      { name: "Kesar Shrikhand", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeW3v_MKIkaFmnSOhzBkp0SJHQGBNz2uut7g&s?auto=format&fit=crop&w=800&q=80", desc: "Thick, strained yogurt sweetened and flavored deeply with saffron threads and cardamom." }
    ]
  },
  { id: "wv6", type: "veg", name: "The Cashew Delight", price: 1150, items: [
      { name: "Mix Veg Samosa", image: "https://vadilalglobal.com/cdn/shop/files/Mixed_Veg_Samosa.jpg?v=1724914627&width=1946?auto=format&fit=crop&w=800&q=80", desc: "Classic flaky pastry filled with a savory mixture of spiced potatoes, peas, and carrots." },
      { name: "Kaju Curry", image: "https://cdn2.foodviva.com/static-content/food-images/curry-recipes/kaju-curry/kaju-curry.jpg?auto=format&fit=crop&w=800&q=80", desc: "Roasted whole cashews in a thick, brown onion and tomato base with warming spices." },
      { name: "Dal Dhokli", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAUTQ6JYebLSdaR-J8G6FPRNff-qKJT6-anA&s?auto=format&fit=crop&w=800&q=80", desc: "A comforting Gujarati classic. Spiced wheat flour pieces simmered in a sweet, sour, and spicy tuvar dal." },
      { name: "Kopra Pak", image: "https://www.chefkunalkapur.com/wp-content/uploads/2024/10/mohanthal-1300x731.jpg?v=1730169543?auto=format&fit=crop&w=800&q=80", desc: "A soft, moist coconut fudge flavored lightly with saffron and cardamom." }
    ]
  },
  { id: "wv7", type: "veg", name: "Nawab's Veg Dastarkhwan", price: 1050, items: [
      { name: "Dahi Vada", image: "https://ministryofcurry.com/wp-content/uploads/2016/08/Dahi-Vada-5-500x375.jpg?auto=format&fit=crop&w=800&q=80", desc: "Soft lentil dumplings soaked in creamy, whipped sweet yogurt, topped with tamarind and mint chutneys." },
      { name: "Malai Kofta", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsT8TUD-NzEQeESGXCTvbEFMbcMp-heDW-Kw&s?auto=format&fit=crop&w=800&q=80", desc: "Deep-fried potato and paneer dumplings served in a luxurious, white cashew gravy." },
      { name: "Jeera Rice", image: "https://delishbite.in/wp-content/uploads/2023/07/Blog_1-3-500x500.jpg?crop=1?auto=format&fit=crop&w=800&q=80", desc: "Fluffy basmati rice tempered with roasted cumin seeds and fresh coriander." },
      { name: "Churma Ladoo", image: "https://www.cookingcarnival.com/wp-content/uploads/2021/09/Churma-ladoo-recipe.jpg?auto=format&fit=crop&w=800&q=80", desc: "Crushed, fried wheat dough mixed with ghee and jaggery, rolled into delicious festive spheres." }
    ]
  },
  { id: "wv8", type: "veg", name: "Saurashtra Special", price: 900, items: [
      { name: "Idada (White Dhokla)", image: "https://i.ytimg.com/vi/Oz34j5---iQ/maxresdefault.jpg", desc: "Traditional white steamed dhokla made from a fermented batter of rice and urad dal, heavily dusted with black pepper." },
      { name: "Bharela Bhinda", image: "https://cdn.indiaphile.info/wp-content/uploads/2023/02/stp-bharela-bhinda-nu-shaak-8150.jpg?width=1200&format=webp?auto=format&fit=crop&w=800&q=80", desc: "Whole okra stuffed with a roasted blend of besan, peanuts, coriander powder, and jaggery." },
      { name: "Surti Dal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNEg2o5GT3aGcMWf580SWOTNz-vy5VM-S0yw&s?auto=format&fit=crop&w=800&q=80", desc: "A sweet and tangy pigeon pea lentil preparation tempered with peanuts, tomatoes, and kokum." },
      { name: "Basundi", image: "https://www.sharmispassions.com/wp-content/uploads/2014/12/basundi4.jpg?auto=format&fit=crop&w=800&q=80", desc: "Sweetened, dense milk boiled down to a creamy texture, served chilled with sliced almonds." }
    ]
  },
  { id: "wv9", type: "veg", name: "Green Garden Feast", price: 980, items: [
      { name: "Patra", image: "https://i.ndtvimg.com/i/2018-02/patra_620x330_51518071961.jpg?auto=format&fit=crop&w=800&q=80", desc: "Colocasia leaves smeared with a sweet, spicy, and tangy gram flour paste, rolled, steamed, and sliced." },
      { name: "Palak Paneer", image: "https://www.cookwithmanali.com/wp-content/uploads/2019/08/Palak-Paneer.jpg?auto=format&fit=crop&w=800&q=80", desc: "Fresh spinach puree cooked with ginger, garlic, and paneer cubes, finished with cream." },
      { name: "Veg Pulao", image: "https://www.indianveggiedelight.com/wp-content/uploads/2019/07/veg-pulao-featured-500x500.jpg?auto=format&fit=crop&w=800&q=80", desc: "Light, fragrant basmati rice tossed with green peas, carrots, and french beans." },
      { name: "Kesar Shrikhand", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeW3v_MKIkaFmnSOhzBkp0SJHQGBNz2uut7g&s?auto=format&fit=crop&w=800&q=80", desc: "Thick, strained yogurt sweetened and flavored deeply with saffron threads and cardamom." }
    ]
  },
  { id: "wv10", type: "veg", name: "Sweet & Savory Mix", price: 1020, items: [
      { name: "Kele Ki Tikki", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEfZdF72oEPAhY8sECacNl85Ry3wV0saDGaA&s?auto=format&fit=crop&w=800&q=80", desc: "Pan-fried patties made from raw bananas and subtle fasting-friendly spices." },
      { name: "Kaju Karela", image: "https://www.nehascookbook.com/wp-content/uploads/2024/05/Kaju-karela-shaak-WS-1.jpg?auto=format&fit=crop&w=800&q=80", desc: "Bitter gourd roundels cooked with premium whole cashews to balance the bitterness with a rich sweetness." },
      { name: "Kadhi Khichdi", image: "https://www.nehascookbook.com/wp-content/uploads/2022/10/Bardoli-khichdi-WS.jpg?auto=format&fit=crop&w=800&q=80", desc: "Simple yellow lentil and rice khichdi served alongside a warm, spiced yogurt and besan kadhi." },
      { name: "Surti Ghari", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAXXJN8n0doghkEc2vuHw0ZlI068p1HsCJag&s?auto=format&fit=crop&w=800&q=80", desc: "The pinnacle of Surat's sweets. A rich disc made of puri dough, mawa, ghee, and sugar, packed with nuts." }
    ]
  },
  { id: "wv11", type: "veg", name: "The Grand Marwari", price: 950, items: [
      { name: "Mix Veg Samosa", image: "https://vadilalglobal.com/cdn/shop/files/Mixed_Veg_Samosa.jpg?v=1724914627&width=1946?auto=format&fit=crop&w=800&q=80", desc: "Classic flaky pastry filled with a savory mixture of spiced potatoes, peas, and carrots." },
      { name: "Veg Kadai", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWbIIYy4Ri82T_qyPotNQUcMNDuTZpeYIWaA&s?auto=format&fit=crop&w=800&q=80", desc: "Mixed seasonal vegetables tossed in an iron wok with ground coriander and dry red chilies." },
      { name: "Rajwadi Khichdi", image: "https://i.ytimg.com/vi/RPRORGFaC3o/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDKcIY1dWtK1cgWuk80HRQhpPifoQ?auto=format&fit=crop&w=800&q=80", desc: "A rich, vegetable-loaded khichdi tempered generously with whole spices and pure desi ghee." },
      { name: "Mohanthal", image: "https://www.sharmispassions.com/wp-content/uploads/2014/12/basundi4.jpg?auto=format&fit=crop&w=800&q=80", desc: "Traditional gram flour fudge enriched with generous amounts of ghee, offering a granular, melt-in-mouth texture." }
    ]
  },
  { id: "wv12", type: "veg", name: "Ultimate Wedding Thali", price: 1200, items: [
      { name: "Surti Locho", image: "https://s3-ap-south-1.amazonaws.com/betterbutterbucket-silver/taqizaki-khan20180620192231869.jpeg", desc: "A Surat specialty. Steamed, spiced gram flour base served hot with oil, butter, and a signature locho masala." },
      { name: "Paneer Butter Masala", image: "https://myfoodstory.com/wp-content/uploads/2021/07/restaurant-style-paneer-butter-masala-2-500x500.jpg?auto=format&fit=crop&w=800&q=80", desc: "Soft cubes of paneer immersed in a rich, creamy, and mildly sweet tomato gravy." },
      { name: "Dal Dhokli", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAUTQ6JYebLSdaR-J8G6FPRNff-qKJT6-anA&s?auto=format&fit=crop&w=800&q=80", desc: "A comforting Gujarati classic. Spiced wheat flour pieces simmered in a sweet, sour, and spicy tuvar dal." },
      { name: "Kesar Shrikhand", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeW3v_MKIkaFmnSOhzBkp0SJHQGBNz2uut7g&s?auto=format&fit=crop&w=800&q=80", desc: "Thick, strained yogurt sweetened and flavored deeply with saffron threads and cardamom." }
    ]
  },

  // --- NON-VEG COMBOS ---
  { id: "wn1", type: "nonveg", name: "The Royal Bhatiyara Feast", price: 1450, items: [
      { name: "Malai Tikka", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDHAI_bbuCZQ0ws2ojtmyxM0vrFkIMXpD6GQ&s?auto=format&fit=crop&w=800&q=80", desc: "A royal Bhatiyara classic. Tender chicken chunks are marinated for 12 hours in a velvety blend of heavy cream, hung curd, and cashew paste." },
      { name: "Mutton Dum Biryani", image: "https://www.cubesnjuliennes.com/wp-content/uploads/2021/03/Best-Mutton-Biryani-Recipe.jpg?auto=format&fit=crop&w=800&q=80", desc: "The ultimate celebration of meat and rice. Slow-cooked in a heavy copper handi." },
      { name: "Chicken Angara", image: "https://i.ytimg.com/vi/jrAh2aUpniA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBXU8g5w01i799lj360xFJVhVBN7g?auto=format&fit=crop&w=800&q=80", desc: "A fiery red, spicy gravy that carries the 'Angar' (fire) of Surat." },
      { name: "Chicken Seekh Kebab", image: "https://i.ytimg.com/vi/hA3-yD23npM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCoNma_2OAQE0o8y8D5rbspFuvIiA?auto=format&fit=crop&w=800&q=80", desc: "Minced chicken seasoned with roasted cumin and fresh coriander, skewered and grilled." }
    ]
  },
  { id: "wn2", type: "nonveg", name: "Nizami Dastarkhwan", price: 1380, items: [
      { name: "Golden Tikka", image: "https://dukaan.b-cdn.net/700x700/webp/295487/35a1cb46-27e2-4ab1-8022-e4cb731de3d9.png?auto=format&fit=crop&w=800&q=80", desc: "Infused with high-grade saffron and fresh turmeric, this tikka offers a vibrant hue and a warm, earthy flavor profile." },
      { name: "Chicken Tikka Biryani", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTRuUB5uYLdSdfZxJa9s-vs63SzmT90BLUOQ&s?auto=format&fit=crop&w=800&q=80", desc: "A smoky delight where tandoor-roasted chicken tikkas are layered with biryani rice." },
      { name: "Butter Chicken", image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2023/04/butter-chicken-recipe-500x500.jpg?auto=format&fit=crop&w=800&q=80", desc: "The timeless classic. Shredded tandoori chicken simmered in a tomato, butter, and cream sauce." },
      { name: "Cheese Chicken Roll", image: "https://i.ytimg.com/vi/-xy3pLz2QWg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLALHkJz7hI-9bjHT__MtJHgQTGPsA?auto=format&fit=crop&w=800&q=80", desc: "Crispy golden crust wrapping a molten blend of premium cheese and spicy chicken chunks." }
    ]
  },
  { id: "wn3", type: "nonveg", name: "Kashmiri Wazwan", price: 1550, items: [
      { name: "Kashmiri Tikka", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR--a-wg8SSwtuACNGsDlvzIdb5yf4awHvkHw&s?auto=format&fit=crop&w=800&q=80", desc: "A mild yet aromatic preparation using authentic Kashmiri red chilies and mace." },
      { name: "Mutton Seekh Biryani", image: "https://i.ytimg.com/vi/HoHgZLFourY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD31Gz3OIPXeKgCw8HNXFxXTDDn9g?auto=format&fit=crop&w=800&q=80", desc: "Juicy mutton seekh kebabs are nestled within layers of saffron-infused rice." },
      { name: "Golden Chicken", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRb0NZ1TQwkOTAwqUpggy4yLbd5O-8O3kclw&s?auto=format&fit=crop&w=800&q=80", desc: "Our signature white gravy, enriched with cream, almonds, and saffron." },
      { name: "Mutton Cutlet", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1YTjZihzPs8KxN6F8c37D8iRRbFbiNwjMyg&s?auto=format&fit=crop&w=800&q=80", desc: "Traditional Bhatiyara mutton cutlets, hand-pounded and seasoned with fresh mint." }
    ]
  },
  { id: "wn4", type: "nonveg", name: "Surti Non-Veg Heritage", price: 1420, items: [
      { name: "Machhi Masal Tikka", image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/06/chicken-tikka-masala-recipe.jpg?auto=format&fit=crop&w=800&q=80", desc: "Fresh river fish fillets marinated in a robust Bhatiyara 'masal'—a secret blend of 21 spices." },
      { name: "Chicken Dum Biryani", image: "https://vismaifood.com/storage/app/uploads/public/e12/7b7/127/thumb__1200_0_0_0_auto.jpg?auto=format&fit=crop&w=800&q=80", desc: "Classic chicken and basmati rice slow-cooked in a sealed dough handi." },
      { name: "Machhi Masala Chicken", image: "https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80", desc: "Tangy and spicy green-masala blend applied to tender chicken pieces." },
      { name: "Tiranga Roll", image: "https://i.ytimg.com/vi/IgOe46v0Dik/maxresdefault.jpg?auto=format&fit=crop&w=800&q=80", desc: "Three distinct layers of chicken mince rolled together and lightly fried." }
    ]
  },
  { id: "wn5", type: "nonveg", name: "Lahori Darbar", price: 1580, items: [
      { name: "Hindustani Tikka", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCPq4FKrNc6gICL3O6sHOiMKpzno1rWxiLGA&s?auto=format&fit=crop&w=800&q=80", desc: "Inspired by the bold street flavors of Lahore, heavily spiced with crushed coriander." },
      { name: "Mutton Seekh Biryani", image: "https://i.ytimg.com/vi/HoHgZLFourY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD31Gz3OIPXeKgCw8HNXFxXTDDn9g?auto=format&fit=crop&w=800&q=80", desc: "Juicy mutton seekh kebabs are nestled within layers of saffron-infused rice." },
      { name: "Chicken Kadai", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiu7hpTeKhbkOWrIrRWActdk8E40NkAuAMxQ&s?auto=format&fit=crop&w=800&q=80", desc: "Cooked in a traditional iron wok with chunks of bell peppers and onions." },
      { name: "Schezwan Tangdi", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt_LImNWFGJA6BPezf-fZ6taT-CnQ9_ThreQ&s?auto=format&fit=crop&w=800&q=80", desc: "Jumbo drumsticks marinated overnight and finished in a high-flame wok." }
    ]
  },
  { id: "wn6", type: "nonveg", name: "Fusion Fiesta", price: 1350, items: [
      { name: "Schezwan Tikka", image: "https://img-cdn.publive.online/fit-in/1200x675/filters:format(webp)/sanjeev-kapoor/media/post_banners/ff9dc23dcc4beb1df4c260442df74561dc8f56b428e81cdb0aef6eba35ba2ca8.jpg?auto=format&fit=crop&w=800&q=80", desc: "A contemporary Surat fusion where tradition meets the orient." },
      { name: "Italian Chicken Biryani", image: "https://i.ytimg.com/vi/Pv-OHu4oR6M/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAuQvk8oqb9phdmrg-ABiBGcSapeg?auto=format&fit=crop&w=800&q=80", desc: "A global fusion featuring Mediterranean herbs cooked with olive oil alongside traditional spices." },
      { name: "Chicken Patiyala", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxysSw0LK5dbaNWrU31RQ0EOLvS4lGdR7CdQ&s?auto=format&fit=crop&w=800&q=80", desc: "A rich, cashew-based yellow gravy hidden under a thin, lacy egg omelet." },
      { name: "Cheese Chicken Roll", image: "https://i.ytimg.com/vi/-xy3pLz2QWg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLALHkJz7hI-9bjHT__MtJHgQTGPsA?auto=format&fit=crop&w=800&q=80", desc: "Crispy golden crust wrapping a molten blend of premium cheese and spicy chicken chunks." }
    ]
  },
  { id: "wn7", type: "nonveg", name: "The Pepper Trail", price: 1480, items: [
      { name: "Makhhan Mari Tangdi", image: "https://i.ytimg.com/vi/7fIysz9p9NM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD9Kb7XTnsADUHQbRhdrZdJRxAlqg?auto=format&fit=crop&w=800&q=80", desc: "Succulent chicken drumsticks glazed with clarified butter (Makhhan) and cracked Tellicherry black pepper." },
      { name: "Chicken Dum Biryani", image: "https://vismaifood.com/storage/app/uploads/public/e12/7b7/127/thumb__1200_0_0_0_auto.jpg?auto=format&fit=crop&w=800&q=80", desc: "Classic chicken and basmati rice slow-cooked in a sealed dough handi." },
      { name: "Chicken Kophta Curry", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrSg5M2g7qmZMwZv6Wi4HfuLYf9d557JADmQ&s?auto=format&fit=crop&w=800&q=80", desc: "Delicate, hand-rolled chicken meatballs simmered in a rich, dark brown onion gravy." },
      { name: "Irani Tangdi", image: "https://i.ytimg.com/vi/frvi3CLk3XA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCuaLwbpWe95uydJG-ctj4R5MXWBw?auto=format&fit=crop&w=800&q=80", desc: "A heritage recipe featuring a marinade of pomegranate molasses and dried herbs." }
    ]
  },
  { id: "wn8", type: "nonveg", name: "Persian Banquet", price: 1400, items: [
      { name: "Irani Tangdi", image: "https://i.ytimg.com/vi/frvi3CLk3XA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCuaLwbpWe95uydJG-ctj4R5MXWBw?auto=format&fit=crop&w=800&q=80", desc: "A heritage recipe featuring a marinade of pomegranate molasses and dried herbs." },
      { name: "Mutton Dum Biryani", image: "https://www.cubesnjuliennes.com/wp-content/uploads/2021/03/Best-Mutton-Biryani-Recipe.jpg?auto=format&fit=crop&w=800&q=80", desc: "The ultimate celebration of meat and rice. Slow-cooked in a heavy copper handi." },
      { name: "Butter Chicken", image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2023/04/butter-chicken-recipe-500x500.jpg?auto=format&fit=crop&w=800&q=80", desc: "The timeless classic. Shredded tandoori chicken simmered in a tomato, butter, and cream sauce." },
      { name: "Chicken Seekh Kebab", image: "https://i.ytimg.com/vi/hA3-yD23npM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCoNma_2OAQE0o8y8D5rbspFuvIiA?auto=format&fit=crop&w=800&q=80", desc: "Minced chicken seasoned with roasted cumin and fresh coriander, skewered and grilled." }
    ]
  },
  { id: "wn9", type: "nonveg", name: "Nawab's Choice", price: 1600, items: [
      { name: "Tiranga Roll", image: "https://i.ytimg.com/vi/IgOe46v0Dik/maxresdefault.jpg?auto=format&fit=crop&w=800&q=80", desc: "Three distinct layers of chicken mince rolled together and lightly fried." },
      { name: "Nargisi Kofta Biryani", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMLuo6AWTV4L01ok8peBmxC-UZf3TXwW79ZQ&s?auto=format&fit=crop&w=800&q=80", desc: "Royal biryani served with Nargisi Koftas—hard-boiled eggs encased in spiced minced meat." },
      { name: "Chicken Angara", image: "https://i.ytimg.com/vi/jrAh2aUpniA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBXU8g5w01i799lj360xFJVhVBN7g?auto=format&fit=crop&w=800&q=80", desc: "A fiery red, spicy gravy that carries the 'Angar' (fire) of Surat." },
      { name: "Malai Tikka", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDHAI_bbuCZQ0ws2ojtmyxM0vrFkIMXpD6GQ&s?auto=format&fit=crop&w=800&q=80", desc: "A royal Bhatiyara classic. Tender chicken chunks are marinated for 12 hours in a velvety blend of heavy cream, hung curd, and cashew paste." }
    ]
  },
  { id: "wn10", type: "nonveg", name: "Cheesy Delight", price: 1450, items: [
      { name: "Cheese Chicken Roll", image: "https://i.ytimg.com/vi/-xy3pLz2QWg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLALHkJz7hI-9bjHT__MtJHgQTGPsA?auto=format&fit=crop&w=800&q=80", desc: "Crispy golden crust wrapping a molten blend of premium cheese and spicy chicken chunks." },
      { name: "Chicken Tikka Biryani", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTRuUB5uYLdSdfZxJa9s-vs63SzmT90BLUOQ&s?auto=format&fit=crop&w=800&q=80", desc: "A smoky delight where tandoor-roasted chicken tikkas are layered with biryani rice." },
      { name: "Golden Chicken", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRb0NZ1TQwkOTAwqUpggy4yLbd5O-8O3kclw&s?auto=format&fit=crop&w=800&q=80", desc: "Our signature white gravy, enriched with cream, almonds, and saffron." },
      { name: "Chicken Kadai", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiu7hpTeKhbkOWrIrRWActdk8E40NkAuAMxQ&s?auto=format&fit=crop&w=800&q=80", desc: "Cooked in a traditional iron wok with chunks of bell peppers and onions." }
    ]
  },
  { id: "wn11", type: "nonveg", name: "The Seekh Symphony", price: 1520, items: [
      { name: "Chicken Seekh Kebab", image: "https://i.ytimg.com/vi/hA3-yD23npM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCoNma_2OAQE0o8y8D5rbspFuvIiA?auto=format&fit=crop&w=800&q=80", desc: "Minced chicken seasoned with roasted cumin and fresh coriander, skewered and grilled." },
      { name: "Mutton Seekh Biryani", image: "https://i.ytimg.com/vi/HoHgZLFourY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD31Gz3OIPXeKgCw8HNXFxXTDDn9g?auto=format&fit=crop&w=800&q=80", desc: "Juicy mutton seekh kebabs are nestled within layers of saffron-infused rice." },
      { name: "Chicken Kophta Curry", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrSg5M2g7qmZMwZv6Wi4HfuLYf9d557JADmQ&s?auto=format&fit=crop&w=800&q=80", desc: "Delicate, hand-rolled chicken meatballs simmered in a rich, dark brown onion gravy." },
      { name: "Chicken Patiyala", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxysSw0LK5dbaNWrU31RQ0EOLvS4lGdR7CdQ&s?auto=format&fit=crop&w=800&q=80", desc: "A rich, cashew-based yellow gravy hidden under a thin, lacy egg omelet." }
    ]
  },
  { id: "wn12", type: "nonveg", name: "Grand Mutton Feast", price: 1700, items: [
      { name: "Mutton Cutlet", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1YTjZihzPs8KxN6F8c37D8iRRbFbiNwjMyg&s?auto=format&fit=crop&w=800&q=80", desc: "Traditional Bhatiyara mutton cutlets, hand-pounded and seasoned with fresh mint." },
      { name: "Mutton Dum Biryani", image: "https://www.cubesnjuliennes.com/wp-content/uploads/2021/03/Best-Mutton-Biryani-Recipe.jpg?auto=format&fit=crop&w=800&q=80", desc: "The ultimate celebration of meat and rice. Slow-cooked in a heavy copper handi." },
      { name: "Mutton Seekh Biryani", image: "https://i.ytimg.com/vi/HoHgZLFourY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD31Gz3OIPXeKgCw8HNXFxXTDDn9g?auto=format&fit=crop&w=800&q=80", desc: "Juicy mutton seekh kebabs are nestled within layers of saffron-infused rice." },
      { name: "Chicken Angara", image: "https://i.ytimg.com/vi/jrAh2aUpniA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBXU8g5w01i799lj360xFJVhVBN7g?auto=format&fit=crop&w=800&q=80", desc: "A fiery red, spicy gravy that carries the 'Angar' (fire) of Surat." }
    ]
  }
];

// --- INDIVIDUAL GSAP COMBO ROW ---
const ComboRow = ({ combo, onClick }) => {
  const rowRef = useRef();
  const { contextSafe } = useGSAP({ scope: rowRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to(rowRef.current, { backgroundColor: "#111", duration: 0.4, ease: "power2.out" });
    gsap.to(".marquee-text", { color: "#e3b94d", webkitTextStroke: "0px", duration: 0.3 });
    
    gsap.fromTo(".hover-img", 
      { autoAlpha: 0, scale: 0.8, y: 30 }, 
      { 
        autoAlpha: 1, 
        scale: 1, 
        y: 0, 
        stagger: 0.15, 
        duration: 0.5, 
        ease: "back.out(1.5)",
        overwrite: true
      }
    );
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(rowRef.current, { backgroundColor: "#f6f4f1", duration: 0.4, ease: "power2.in" });
    gsap.to(".marquee-text", { color: "transparent", webkitTextStroke: "1px #111", duration: 0.3 });
    
    gsap.to(".hover-img", { 
      autoAlpha: 0, 
      scale: 0.8, 
      y: 30, 
      duration: 0.3,
      overwrite: true 
    });
  });

  const marqueeItems = Array(5).fill(`${combo.name} • ₹${combo.price} / PERS • `);

  return (
    <div className="combo-marquee-row" ref={rowRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => onClick(combo)}>
      <div className="marquee-container">
        {marqueeItems.map((text, idx) => (
          <span key={idx} className="marquee-text">{text}</span>
        ))}
      </div>
      
      <div className="hover-images-wrapper">
        {combo.items.map((item, i) => (
          <img key={i} src={item.image} alt={item.name} className={`hover-img img-${i}`} />
        ))}
      </div>
    </div>
  );
};


// --- MAIN BOOKING COMPONENT ---
const Booking = () => {
  const [isVeg, setIsVeg] = useState(true);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [personCount, setPersonCount] = useState(100);
  const [orderDetails, setOrderDetails] = useState({ date: "", time: "", phone: "" });
  
  // Custom Alert State
  const [customAlert, setCustomAlert] = useState(null);
  
  // Floating Taskbar State
  const [weddingCartCount, setWeddingCartCount] = useState(0);

  const container = useRef();
  const navigate = useNavigate();
  
  const filteredCombos = WEDDING_COMBOS.filter(c => c.type === (isVeg ? "veg" : "nonveg"));

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("ub_wedding_cart")) || [];
    setWeddingCartCount(cart.length);
  }, []);

  useGSAP(() => {
    gsap.from(".booking-header h1", { y: 100, opacity: 0, duration: 1, ease: "power4.out" });
    gsap.from(".type-toggle-container", { opacity: 0, y: 20, delay: 0.2, duration: 0.8 });
  }, { scope: container });

  const validateAndAdd = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setCustomAlert({ type: "error", message: "Please login to proceed." });
      return;
    }
    
    const { date, time, phone } = orderDetails;
    if (!date || !time || !phone) {
      setCustomAlert({ type: "error", message: "Please fill all logistics details!" });
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    const fortyEightHoursLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    if (selectedDateTime < fortyEightHoursLater) {
      setCustomAlert({ 
        type: "error", 
        message: "Advance Notice Required: Wedding orders must be placed at least 48 hours (2 days) in advance." 
      });
      return;
    }

    const cartItem = {
      dishId: selectedCombo.id,
      name: selectedCombo.name,
      category: "Wedding Combo",
      personCount,
      totalPrice: (selectedCombo.price * personCount),
      image: selectedCombo.items[0].image, 
      orderDate: date,
      orderTime: time,
      phoneNumber: phone
    };

    const cart = JSON.parse(localStorage.getItem("ub_wedding_cart")) || [];
    const updatedCart = [...cart, cartItem];
    
    localStorage.setItem("ub_wedding_cart", JSON.stringify(updatedCart));
    setWeddingCartCount(updatedCart.length); 
    
    setCustomAlert({ 
      type: "success", 
      message: "Wedding Package successfully added! Proceeding to the Wedding Cart...",
      btnText: "PROCEED TO CART",
      onClose: () => navigate("/wedding-cart")
    });
    
    setSelectedCombo(null);
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hello Usman Bhai Bhatiyara, I am interested in the ${selectedCombo.name} wedding package.\n\nDetails:\nExpected Persons: ${personCount}\nTentative Date: ${orderDetails.date || 'Not set'}\n\nPlease share further details regarding this package.`;
    window.open(`https://wa.me/917069131793?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="booking-page" ref={container}>
      <header className="booking-header">
        <p className="editorial-label">GRAND SCALE CELEBRATIONS</p>
        <h1>WEDDING COMBOS</h1>
      </header>

      <div className="type-toggle-container">
        <div className={`type-toggle ${!isVeg ? 'nonveg' : ''}`}>
          <div className="toggle-slider"></div>
          <div className={`toggle-btn ${isVeg ? 'active' : ''}`} onClick={() => setIsVeg(true)}>
            PURE VEG
          </div>
          <div className={`toggle-btn ${!isVeg ? 'active' : ''}`} onClick={() => setIsVeg(false)}>
            NON-VEG
          </div>
        </div>
      </div>

      <div className="cinematic-combo-list">
        {filteredCombos.map(combo => (
          <ComboRow key={combo.id} combo={combo} onClick={setSelectedCombo} />
        ))}
      </div>

      {/* --- PREVIEW MODAL --- */}
      {selectedCombo && (
        <div className="preview-modal-overlay">
          <div className="preview-modal">
            <button className="close-modal" onClick={() => setSelectedCombo(null)}>✕</button>
            
            <div className="modal-header">
              <p className="editorial-label">CURATED WEDDING PACKAGE</p>
              <h2>{selectedCombo.name}</h2>
            </div>

            <div className="combo-details-grid">
              {selectedCombo.items.map((item, idx) => (
                <div key={idx} className="dish-detail-card">
                  <div className="dish-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="dish-text">
                    <h4>{item.name}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="booking-logistics-section">
              <div className="logistics-form">
                <div className="input-row">
                  <div className="input-group">
                    <label>PERSON COUNT (MIN 100)</label>
                    <input type="number" value={personCount} min="100" onChange={(e) => setPersonCount(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>DATE (MIN 48H NOTICE)</label>
                    <input type="date" onChange={(e) => setOrderDetails({...orderDetails, date: e.target.value})} />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>DELIVERY TIME</label>
                    <input type="time" onChange={(e) => setOrderDetails({...orderDetails, time: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>PHONE</label>
                    <input type="tel" placeholder="10-digit mobile" onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="checkout-summary">
                <div className="total-box">
                  <label>ESTIMATED TOTAL</label>
                  <span>₹{selectedCombo.price * personCount}</span>
                </div>
                <div className="action-buttons">
                    <button className="add-to-selection-btn" onClick={validateAndAdd}>
                      CONFIRM SELECTION
                    </button>
                    <button className="whatsapp-btn" onClick={handleWhatsAppInquiry}>
                      INQUIRE ON WHATSAPP
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM ALERT MODAL --- */}
      {customAlert && (
        <div className="custom-alert-overlay">
          <div className={`custom-alert-box ${customAlert.type}`}>
            <h3>{customAlert.type === "success" ? "SUCCESS" : "ATTENTION"}</h3>
            <p>{customAlert.message}</p>
            <button className="custom-alert-btn" onClick={() => {
              if (customAlert.onClose) customAlert.onClose();
              setCustomAlert(null);
            }}>
              {customAlert.btnText || "ACKNOWLEDGE"}
            </button>
          </div>
        </div>
      )}

      {/* --- FLOATING WEDDING TASKBAR --- */}
      {weddingCartCount > 0 && (
        <div className="wedding-floating-taskbar">
          <div className="taskbar-content">
            <span className="taskbar-text">YOU HAVE {weddingCartCount} WEDDING PACKAGE(S) IN YOUR SELECTION</span>
            <button className="taskbar-btn" onClick={() => navigate("/wedding-cart")}>
              VIEW WEDDING CART
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Booking;