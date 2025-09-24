import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/ui/Toast';
import Home from './pages/Home';
import Adoption from './pages/Adoption';
import Foster from './pages/Foster';
import Community from './pages/Community';
import Resources from './pages/Resources';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import PetDetails from './pages/PetDetails';
import FosterApply from './pages/FosterApply';
import AddPet from './pages/AddPet';
import EventRegistration from './pages/EventRegistration';
import AccountSettings from './pages/AccountSettings';
import PDFViewer from './pages/PDFViewer';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DebugSupabase from './pages/DebugSupabase';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-primary-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/adoption" element={<Adoption />} />
              <Route path="/adoption/add" element={<AddPet />} />
              <Route path="/adoption/:petId" element={<PetDetails />} />
              <Route path="/foster" element={<Foster />} />
              <Route path="/foster/apply" element={<FosterApply />} />
              <Route path="/community" element={<Community />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/event-registration/:eventId" element={<EventRegistration />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/pdf-viewer/:resourceId" element={<PDFViewer />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/debug-supabase" element={<DebugSupabase />} />
            </Routes>
          </main>
          <Footer />
          <Toast />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
