import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Transition from "./components/Transition";
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import the new Footer
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home'; 

import './components/Navbar.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <Transition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
          {/* Footer inside Transition so it respects page reveal timing */}
          <Footer /> 
        </Transition>
      </div>
    </Router>
  );
}

export default App;