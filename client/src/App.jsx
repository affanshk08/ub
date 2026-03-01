import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Transition from "./components/Transition";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home'; 
import Menu from './pages/Menu'; 
// Logic: Importing the Booking page
import Booking from './pages/Booking';
// Logic: Importing the Cart page
import Cart from './pages/Cart';
// Logic: Importing the newly created Wedding Cart page
import WeddingCart from './pages/WeddingCart';
// Logic: Importing the new Profile page
import Profile from './pages/Profile';
// Logic: Importing the AdminDashboard from the folder we created
import AdminDashboard from './pages/Admin/AdminDashboard'; 

import './components/Navbar.css';

// Logic: Protected Route for standard authenticated users
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // If no user is logged in, redirect them to the login page immediately
  if (!user) {
    // 'replace' prevents them from clicking the back button and getting stuck in a redirect loop
    return <Navigate to="/login" replace />; 
  }
  return children;
};

// Logic: Protected Route for Admin
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Checks if user exists and if their role is strictly 'admin'
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <Transition>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* PROTECTED ROUTES (Requires Login) */}
            <Route 
              path="/menu" 
              element={
                <ProtectedRoute>
                  <Menu />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            {/* NEW STRICTLY WEDDING CART ROUTE */}
            <Route 
              path="/wedding-cart" 
              element={
                <ProtectedRoute>
                  <WeddingCart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* STRICT ADMIN ROUTE */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
          {/* Footer inside Transition so it respects page reveal timing */}
          <Footer /> 
        </Transition>
      </div>
    </Router>
  );
}

export default App;