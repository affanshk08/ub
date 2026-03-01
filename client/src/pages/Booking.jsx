import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

// --- 24 PREMIUM WEDDING COMBOS (12 VEG & 12 NON-VEG) ---
const WEDDING_COMBOS = [
  // --- VEG COMBOS ---
  { id: "wv1", type: "veg", name: "The Grand Surti Feast", price: 950, items: [
      { name: "Surti Locho", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80", desc: "A Surat specialty served hot with signature locho masala." },
      { name: "Surti Undhiyu", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80", desc: "The legendary Surat winter stew with seasonal vegetables." },
      { name: "Surti Dal", image: "https://images.unsplash.com/photo-1512058560366-cd2429ff5c7c?auto=format&fit=crop&w=800&q=80", desc: "A sweet and tangy pigeon pea lentil preparation." },
      { name: "Surti Ghari", image: "https://images.unsplash.com/photo-1589113103553-5384496ff27b?auto=format&fit=crop&w=800&q=80", desc: "The pinnacle of Surat's sweets, packed with mawa and nuts." }
    ]
  },
  { id: "wv2", type: "veg", name: "Royal Kathiyawadi", price: 880, items: [
      { name: "Methi Na Gota", image: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?auto=format&fit=crop&w=800&q=80", desc: "Golden fritters with fresh fenugreek and coriander seeds." },
      { name: "Sev Tameta", image: "https://images.unsplash.com/photo-1603894584115-f73f2ec851ad?auto=format&fit=crop&w=800&q=80", desc: "Sweet and spicy tomato curry garnished with besan sev." },
      { name: "Rajwadi Khichdi", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", desc: "A rich khichdi tempered generously with pure desi ghee." },
      { name: "Mohanthal", image: "https://images.unsplash.com/photo-1596797038583-18a68a637311?auto=format&fit=crop&w=800&q=80", desc: "Traditional gram flour fudge enriched with ghee." }
    ]
  },
  { id: "wv3", type: "veg", name: "The Classic Gujarati", price: 850, items: [
      { name: "Khaman", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80", desc: "Soft, spongy steamed cakes tempered with mustard seeds." },
      { name: "Ringan No Olo", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80", desc: "Fire-roasted eggplant mashed with green garlic." },
      { name: "Kadhi Khichdi", image: "https://images.unsplash.com/photo-1626500155537-883777587788?auto=format&fit=crop&w=800&q=80", desc: "Yellow lentil khichdi alongside spiced yogurt kadhi." },
      { name: "Basundi", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80", desc: "Sweetened, dense milk boiled to a creamy texture." }
    ]
  },
  { id: "wv4", type: "veg", name: "Monsoon Cravings", price: 920, items: [
      { name: "Lilva Kachori", image: "https://images.unsplash.com/photo-1603962285838-838104440129?auto=format&fit=crop&w=800&q=80", desc: "Deep-fried pastry stuffed with fresh green pigeon peas." },
      { name: "Lasaniya Batata", image: "https://images.unsplash.com/photo-1545231027-63b6f2a3c2dd?auto=format&fit=crop&w=800&q=80", desc: "Baby potatoes simmered in a fierce garlic sauce." },
      { name: "Jeera Rice", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80", desc: "Fluffy basmati rice tempered with roasted cumin." },
      { name: "Dudhi Halwa", image: "https://images.unsplash.com/photo-1621361019047-98319f390886?auto=format&fit=crop&w=800&q=80", desc: "Fresh bottle gourd slow-cooked with whole milk." }
    ]
  },
  { id: "wv5", type: "veg", name: "Premium Paneer Banquet", price: 1100, items: [
      { name: "Khandvi", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", desc: "Thinly rolled bite-sized pieces garnished with coconut." },
      { name: "Paneer Butter Masala", image: "https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80", desc: "Soft paneer cubes immersed in a rich tomato gravy." },
      { name: "Veg Pulao", image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80", desc: "Fragrant basmati rice tossed with fresh green peas." },
      { name: "Kesar Shrikhand", image: "https://images.unsplash.com/photo-1621361019047-98319f390886?auto=format&fit=crop&w=800&q=80", desc: "Thick, strained yogurt flavored with saffron threads." }
    ]
  },
  { id: "wv6", type: "veg", name: "The Cashew Delight", price: 1150, items: [
      { name: "Mix Veg Samosa", image: "https://images.unsplash.com/photo-1539252554454-31d626bd57b8?auto=format&fit=crop&w=800&q=80", desc: "Classic flaky pastry filled with spiced potatoes." },
      { name: "Kaju Curry", image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80", desc: "Roasted whole cashews in a thick brown gravy." },
      { name: "Dal Dhokli", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", desc: "Spiced wheat pieces simmered in tuvar dal." },
      { name: "Kopra Pak", image: "https://images.unsplash.com/photo-1589113103553-5384496ff27b?auto=format&fit=crop&w=800&q=80", desc: "Soft, moist coconut fudge lightly flavored." }
    ]
  },
  { id: "wv7", type: "veg", name: "Nawab's Veg Dastarkhwan", price: 1050, items: [
      { name: "Dahi Vada", image: "https://images.unsplash.com/photo-1626132646529-5aa71394c98a?auto=format&fit=crop&w=800&q=80", desc: "Soft lentil dumplings soaked in creamy sweet yogurt." },
      { name: "Malai Kofta", image: "https://images.unsplash.com/photo-1545231027-63b6f2a3c2dd?auto=format&fit=crop&w=800&q=80", desc: "Deep-fried dumplings in a luxurious cashew gravy." },
      { name: "Jeera Rice", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80", desc: "Fluffy basmati rice tempered with roasted cumin." },
      { name: "Churma Ladoo", image: "https://images.unsplash.com/photo-1596797038583-18a68a637311?auto=format&fit=crop&w=800&q=80", desc: "Fried wheat dough rolled into festive spheres." }
    ]
  },
  { id: "wv8", type: "veg", name: "Saurashtra Special", price: 900, items: [
      { name: "Idada", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80", desc: "White steamed dhokla dusted with black pepper." },
      { name: "Bharela Bhinda", image: "https://images.unsplash.com/photo-1601303582555-538600d1641b?auto=format&fit=crop&w=800&q=80", desc: "Whole okra stuffed with a roasted besan blend." },
      { name: "Surti Dal", image: "https://images.unsplash.com/photo-1512058560366-cd2429ff5c7c?auto=format&fit=crop&w=800&q=80", desc: "A sweet and tangy pigeon pea lentil preparation." },
      { name: "Basundi", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80", desc: "Sweetened milk served chilled with almonds." }
    ]
  },
  { id: "wv9", type: "veg", name: "Green Garden Feast", price: 980, items: [
      { name: "Patra", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80", desc: "Colocasia leaves smeared with sweet & tangy paste." },
      { name: "Palak Paneer", image: "https://images.unsplash.com/photo-1603894584115-f73f2ec851ad?auto=format&fit=crop&w=800&q=80", desc: "Fresh spinach puree cooked with paneer cubes." },
      { name: "Veg Pulao", image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80", desc: "Basmati rice tossed with seasonal vegetables." },
      { name: "Dudhi Halwa", image: "https://images.unsplash.com/photo-1621361019047-98319f390886?auto=format&fit=crop&w=800&q=80", desc: "Bottle gourd slow-cooked with milk and khoya." }
    ]
  },
  { id: "wv10", type: "veg", name: "Sweet & Savory Mix", price: 1020, items: [
      { name: "Kele Ki Tikki", image: "https://images.unsplash.com/photo-1524331155111-e9e99677020d?auto=format&fit=crop&w=800&q=80", desc: "Pan-fried patties made from raw bananas." },
      { name: "Kaju Karela", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80", desc: "Bitter gourd cooked with premium whole cashews." },
      { name: "Kadhi Khichdi", image: "https://images.unsplash.com/photo-1626500155537-883777587788?auto=format&fit=crop&w=800&q=80", desc: "Simple khichdi served with spiced yogurt kadhi." },
      { name: "Surti Ghari", image: "https://images.unsplash.com/photo-1589113103553-5384496ff27b?auto=format&fit=crop&w=800&q=80", desc: "Rich disc made of dough, mawa, and ghee." }
    ]
  },
  { id: "wv11", type: "veg", name: "The Grand Marwari", price: 950, items: [
      { name: "Mix Veg Samosa", image: "https://images.unsplash.com/photo-1539252554454-31d626bd57b8?auto=format&fit=crop&w=800&q=80", desc: "Flaky pastry filled with a savory mixture." },
      { name: "Veg Kadai", image: "https://images.unsplash.com/photo-1601303582555-538600d1641b?auto=format&fit=crop&w=800&q=80", desc: "Mixed vegetables tossed in an iron wok." },
      { name: "Rajwadi Khichdi", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", desc: "Vegetable-loaded khichdi tempered with ghee." },
      { name: "Mohanthal", image: "https://images.unsplash.com/photo-1596797038583-18a68a637311?auto=format&fit=crop&w=800&q=80", desc: "Gram flour fudge with a granular texture." }
    ]
  },
  { id: "wv12", type: "veg", name: "Ultimate Wedding Thali", price: 1200, items: [
      { name: "Surti Locho", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80", desc: "Steamed gram flour served with signature masala." },
      { name: "Paneer Butter Masala", image: "https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80", desc: "Soft cubes of paneer immersed in rich tomato gravy." },
      { name: "Dal Dhokli", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", desc: "Spiced wheat pieces in sweet and sour tuvar dal." },
      { name: "Kesar Shrikhand", image: "https://images.unsplash.com/photo-1621361019047-98319f390886?auto=format&fit=crop&w=800&q=80", desc: "Thick yogurt heavily flavored with saffron." }
    ]
  },

  // --- NON-VEG COMBOS ---
  { id: "wn1", type: "nonveg", name: "The Royal Bhatiyara Feast", price: 1450, items: [
      { name: "Malai Tikka", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80", desc: "Chicken chunks marinated in a velvety cashew paste." },
      { name: "Mutton Dum Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80", desc: "Meat and rice slow-cooked in a heavy copper handi." },
      { name: "Chicken Angara", image: "https://images.unsplash.com/photo-1603894584115-f73f2ec851ad?auto=format&fit=crop&w=800&q=80", desc: "A fiery red gravy carrying the fire of Surat." },
      { name: "Jarda", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80", desc: "Sweet, saffron-flavored rice loaded with premium nuts." }
    ]
  },
  { id: "wn2", type: "nonveg", name: "Nizami Dastarkhwan", price: 1380, items: [
      { name: "Golden Tikka", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", desc: "Infused with high-grade saffron and turmeric." },
      { name: "Chicken Tikka Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80", desc: "Smoky tandoor-roasted chicken layered with rice." },
      { name: "Butter Chicken", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80", desc: "Shredded tandoori chicken in a butter cream sauce." },
      { name: "Sevio ka Shola", image: "https://images.unsplash.com/photo-1589113103553-5384496ff27b?auto=format&fit=crop&w=800&q=80", desc: "Vermicelli cooked in thickened milk and cardamom." }
    ]
  },
  { id: "wn3", type: "nonveg", name: "Kashmiri Wazwan", price: 1550, items: [
      { name: "Kashmiri Tikka", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80", desc: "Aromatic preparation using Kashmiri red chilies." },
      { name: "Mutton Yakhni Pulav", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", desc: "Meat and rice cooked in clarified stock." },
      { name: "Golden Chicken", image: "https://images.unsplash.com/photo-1545231027-63b6f2a3c2dd?auto=format&fit=crop&w=800&q=80", desc: "Signature white gravy enriched with almonds." },
      { name: "Chawal ka Shola", image: "https://images.unsplash.com/photo-1596797038583-18a68a637311?auto=format&fit=crop&w=800&q=80", desc: "Rich rice pudding slow-reduced to creamy perfection." }
    ]
  },
  { id: "wn4", type: "nonveg", name: "Surti Non-Veg Heritage", price: 1420, items: [
      { name: "Machhi Masal Tikka", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80", desc: "Fresh fish fillets marinated in a secret blend." },
      { name: "Chicken Dum Biryani", image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80", desc: "Classic chicken and rice in a sealed dough handi." },
      { name: "Machhi Masala Chicken", image: "https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80", desc: "Tangy green-masala blend applied to chicken." },
      { name: "Thuli", image: "https://images.unsplash.com/photo-1621361019047-98319f390886?auto=format&fit=crop&w=800&q=80", desc: "Cracked wheat dessert cooked with jaggery." }
    ]
  },
  { id: "wn5", type: "nonveg", name: "Lahori Darbar", price: 1580, items: [
      { name: "Pakistani Tikka", image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80", desc: "Inspired by street flavors, heavily spiced." },
      { name: "Mutton Seekh Biryani", image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80", desc: "Juicy seekh kebabs nestled within saffron rice." },
      { name: "Chicken Kadai", image: "https://images.unsplash.com/photo-1601303582555-538600d1641b?auto=format&fit=crop&w=800&q=80", desc: "Cooked in an iron wok with bell peppers." },
      { name: "Dudhi Ka Halwa", image: "https://images.unsplash.com/photo-1589113103553-5384496ff27b?auto=format&fit=crop&w=800&q=80", desc: "Bottle gourd slow-cooked with whole milk." }
    ]
  },
  { id: "wn6", type: "nonveg", name: "Fusion Fiesta", price: 1350, items: [
      { name: "Schezwan Tikka", image: "https://images.unsplash.com/photo-1524331155111-e9e99677020d?auto=format&fit=crop&w=800&q=80", desc: "Contemporary Surat fusion where tradition meets the orient." },
      { name: "Italian Chicken Biryani", image: "https://images.unsplash.com/photo-1512058560366-cd2429ff5c7c?auto=format&fit=crop&w=800&q=80", desc: "A global fusion featuring Mediterranean herbs." },
      { name: "Chicken Patiyala", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80", desc: "Rich yellow gravy hidden under a lacy egg omelet." },
      { name: "Gajar Ka Halwa", image: "https://images.unsplash.com/photo-1621361019047-98319f390886?auto=format&fit=crop&w=800&q=80", desc: "Seasonal red carrots braised in desi ghee." }
    ]
  },
  { id: "wn7", type: "nonveg", name: "The Pepper Trail", price: 1480, items: [
      { name: "Makhhan Mari Tangdi", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80", desc: "Drumsticks glazed with clarified butter and black pepper." },
      { name: "Chicken Pulao", image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80", desc: "Basmati rice tossed with chicken chunks." },
      { name: "Chicken Kophta Curry", image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80", desc: "Hand-rolled meatballs simmered in dark brown gravy." },
      { name: "Akhrot Ka Halwa", image: "https://images.unsplash.com/photo-1596797038583-18a68a637311?auto=format&fit=crop&w=800&q=80", desc: "Artisanal walnut paste halwa cooked to perfection." }
    ]
  },
  { id: "wn8", type: "nonveg", name: "Persian Banquet", price: 1400, items: [
      { name: "Irani Tangdi", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80", desc: "Marinade of pomegranate molasses and dried herbs." },
      { name: "Mutton Khichda", image: "https://images.unsplash.com/photo-1505253149613-11b847673558?auto=format&fit=crop&w=800&q=80", desc: "A slow-cooked porridge of meat, lentils, and wheat." },
      { name: "Butter Chicken", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80", desc: "Shredded tandoori chicken simmered in creamy sauce." },
      { name: "Jarda", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80", desc: "Sweet, saffron-flavored rice cooked with nuts." }
    ]
  },
  { id: "wn9", type: "nonveg", name: "Nawab's Choice", price: 1600, items: [
      { name: "Tiranga Roll", image: "https://images.unsplash.com/photo-1539252554454-31d626bd57b8?auto=format&fit=crop&w=800&q=80", desc: "Three layers of chicken mince lightly fried." },
      { name: "Nargisi Kofta Biryani", image: "https://images.unsplash.com/photo-1645177623570-5283995804bc?auto=format&fit=crop&w=800&q=80", desc: "Biryani served with boiled eggs encased in meat." },
      { name: "Chicken Angara", image: "https://images.unsplash.com/photo-1603894584115-f73f2ec851ad?auto=format&fit=crop&w=800&q=80", desc: "Fiery red gravy carrying a deep smoky undertone." },
      { name: "Sevio ka Shola", image: "https://images.unsplash.com/photo-1589113103553-5384496ff27b?auto=format&fit=crop&w=800&q=80", desc: "Vermicelli in thickened milk with silver leaf." }
    ]
  },
  { id: "wn10", type: "nonveg", name: "Cheesy Delight", price: 1450, items: [
      { name: "Cheese Chicken Roll", image: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?auto=format&fit=crop&w=800&q=80", desc: "Crispy crust wrapping molten cheese and chicken." },
      { name: "Chicken Tikka Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80", desc: "A smoky delight with tandoor-roasted chicken." },
      { name: "Golden Chicken", image: "https://images.unsplash.com/photo-1545231027-63b6f2a3c2dd?auto=format&fit=crop&w=800&q=80", desc: "Signature white gravy enriched with cream." },
      { name: "Chawal ka Shola", image: "https://images.unsplash.com/photo-1596797038583-18a68a637311?auto=format&fit=crop&w=800&q=80", desc: "Rich rice pudding slow-reduced to a cream." }
    ]
  },
  { id: "wn11", type: "nonveg", name: "The Seekh Symphony", price: 1520, items: [
      { name: "Chicken Seekh Kebab", image: "https://images.unsplash.com/photo-1603962285838-838104440129?auto=format&fit=crop&w=800&q=80", desc: "Minced chicken seasoned with roasted cumin." },
      { name: "Mutton Seekh Biryani", image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80", desc: "Juicy mutton kebabs nestled in saffron rice." },
      { name: "Chicken Kheema", image: "https://images.unsplash.com/photo-1626500155537-883777587788?auto=format&fit=crop&w=800&q=80", desc: "Spicy minced chicken cooked with green peas." },
      { name: "Thuli", image: "https://images.unsplash.com/photo-1621361019047-98319f390886?auto=format&fit=crop&w=800&q=80", desc: "Cracked wheat dessert cooked with jaggery and ghee." }
    ]
  },
  { id: "wn12", type: "nonveg", name: "Grand Mutton Feast", price: 1700, items: [
      { name: "Mutton Cutlet", image: "https://images.unsplash.com/photo-1626132646529-5aa71394c98a?auto=format&fit=crop&w=800&q=80", desc: "Hand-pounded cutlets seasoned with fresh mint." },
      { name: "Mutton Dum Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80", desc: "The ultimate celebration of meat and rice." },
      { name: "Mutton Yakhni Pulav", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", desc: "Subtle meat preparation in clarified stock." },
      { name: "Akhrot Ka Halwa", image: "https://images.unsplash.com/photo-1596797038583-18a68a637311?auto=format&fit=crop&w=800&q=80", desc: "Artisanal walnut paste halwa caramelized to perfection." }
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
  
  // Custom Alert State (Modified to support button text and actions)
  const [customAlert, setCustomAlert] = useState(null);
  
  // Floating Taskbar State
  const [weddingCartCount, setWeddingCartCount] = useState(0);

  const container = useRef();
  const navigate = useNavigate();
  
  const filteredCombos = WEDDING_COMBOS.filter(c => c.type === (isVeg ? "veg" : "nonveg"));

  // Check local storage on mount to see if taskbar should be visible
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

    // Storing in a separate 'ub_wedding_cart'
    const cart = JSON.parse(localStorage.getItem("ub_wedding_cart")) || [];
    const updatedCart = [...cart, cartItem];
    
    localStorage.setItem("ub_wedding_cart", JSON.stringify(updatedCart));
    setWeddingCartCount(updatedCart.length); // Update taskbar state
    
    // Auto-redirect via success alert
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
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(text)}`, "_blank");
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