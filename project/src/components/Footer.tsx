import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handlePrivacyPolicy = () => {
    navigate('/privacy-policy');
  };

  const handleTermsOfService = () => {
    navigate('/terms-of-service');
  };

  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-secondary-400 fill-current" />
              <span className="font-heading font-bold text-xl">Zoomies & Snuggles</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              Connecting loving families with pets in need across Rajkot, Gujarat. 
              Every pet deserves a forever home filled with love and care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-300 hover:text-secondary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-300 hover:text-secondary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-300 hover:text-secondary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/adoption" className="text-primary-200 hover:text-secondary-400 transition-colors">Find a Pet</Link></li>
              <li><Link to="/foster" className="text-primary-200 hover:text-secondary-400 transition-colors">Foster Care</Link></li>
              <li><Link to="/community" className="text-primary-200 hover:text-secondary-400 transition-colors">Community</Link></li>
              <li><Link to="/resources" className="text-primary-200 hover:text-secondary-400 transition-colors">Resources</Link></li>
              <li><Link to="/about" className="text-primary-200 hover:text-secondary-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><span className="text-primary-200">Pet Adoption</span></li>
              <li><span className="text-primary-200">Foster Programs</span></li>
              <li><span className="text-primary-200">Pet Care Education</span></li>
              <li><span className="text-primary-200">Rescue Coordination</span></li>
              <li><span className="text-primary-200">Community Support</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-secondary-400 flex-shrink-0" />
                <span className="text-primary-200 text-sm">Rajkot, Gujarat, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary-400 flex-shrink-0" />
                <span className="text-primary-200 text-sm">+91 9484844090</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-secondary-400 flex-shrink-0" />
                <span className="text-primary-200 text-sm">zoomiesnsnuggles@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-300 text-sm">
              © 2024 Zoomies & Snuggles. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button 
                onClick={handlePrivacyPolicy}
                className="text-primary-300 hover:text-secondary-400 text-sm transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={handleTermsOfService}
                className="text-primary-300 hover:text-secondary-400 text-sm transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;