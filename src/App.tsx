import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import HomePage from './pages/HomePage-Hub';
import ResourceDetailPage from './pages/ResourceDetailPage-New';
import ResourceUploadPage from './pages/ResourceUploadPage';
import AdminIntelligenceDashboard from './pages/AdminIntelligenceDashboard';
import ContactPage from './pages/ContactPage';
import ConnectionsPage from './pages/ConnectionsPage';
import EnhancedNavbar from './components/EnhancedNavbar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <EnhancedNavbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/resource/:id" element={<ResourceDetailPage />} />
              <Route path="/upload" element={<ResourceUploadPage />} />
              <Route path="/admin/dashboard" element={<AdminIntelligenceDashboard />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
