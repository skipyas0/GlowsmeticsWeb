import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Procedures from './pages/Procedures';
import ProcedureDetail from './pages/ProcedureDetail';

function App() {
  return (
    <Router basename="/GlowsmeticsWeb">
      <div className="page-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/procedures" element={<Procedures />} />
            <Route path="/procedures/:id" element={<ProcedureDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
