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
// Logic: Importing the new Profile page
import Profile from './pages/Profile';
// Logic: Importing the AdminDashboard from the folder we created
import AdminDashboard from './pages/Admin/AdminDashboard'; 

import './components/Navbar.css';

// Logic: Protected Route for Admin
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Checks if user exists and if their role is strictly 'admin'
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
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
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            {/* Logic: Added Route for the Booking page */}
            <Route path="/booking" element={<Booking />} />
            <Route path="/cart" element={<Cart />} />
            {/* Logic: Added Route for the new Profile page */}
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Logic: Protected Admin Dashboard Route */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  {/* Logic: Replaced the placeholder div with your AdminDashboard component */}
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