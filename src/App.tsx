import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';

// Import des nouvelles PAGES
import Home from './pages/Home';
import About from './pages/About';
import MissionsPage from './pages/MissionsPage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import CollectionPage from './pages/CollectionPage';
import ContactPage from './pages/ContactPage';
import Donate from './pages/Donate';
import Reports from './pages/Reports';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import BlogPostDetail from './pages/BlogPostDetail';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white selection:bg-orange-500 selection:text-white scroll-smooth">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/A-Propos" element={<About />} />
          <Route path="/Missions" element={<MissionsPage />} />
          <Route path="/Galerie" element={<GalleryPage />} />
          <Route path="/Blog" element={<BlogPage />} />
          <Route path="/Collection" element={<CollectionPage />} />
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/Donate" element={<Donate />} />
          <Route path="/Rapports" element={<Reports />} />
          <Route path="/mentions-legales" element={<LegalNotice />} />
          <Route path="/confidentialite" element={<PrivacyPolicy />} />
          <Route path="/Blog/:slug" element={<BlogPostDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;