import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PawPrint,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  // Check if user is logged in (this would normally come from a context or state management)
  React.useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Adoption", href: "/adoption" },
    { name: "Foster Care", href: "/foster" },
    { name: "Community", href: "/community" },
    { name: "Resources", href: "/resources" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    toast.success(
      "You have been successfully logged out. Thank you for visiting Zoomies & Snuggles!",
    );
  };

  const handleAccountSettings = () => {
    setIsUserMenuOpen(false);
    navigate("/account-settings");
  };

  const handleViewProfile = () => {
    setIsUserMenuOpen(false);
    navigate("/profile");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-secondary-500 fill-current" />
            <span className="font-heading font-bold text-xl text-primary-800">
              Zoomies & Snuggles
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? "text-secondary-600 bg-secondary-50"
                    : "text-primary-700 hover:text-secondary-600 hover:bg-primary-100"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl group"
                >
                  <div className="w-8 h-8 bg-secondary-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </span>
                  </div>
                  <span className="hidden sm:inline">{currentUser.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-primary-200 animate-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-primary-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-secondary-600">
                            {currentUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary-800">
                            {currentUser.name}
                          </p>
                          <p className="text-sm text-primary-500 capitalize">
                            {currentUser.userType}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={handleViewProfile}
                      className="flex items-center px-4 py-3 text-sm text-primary-700 hover:bg-primary-50 w-full text-left transition-colors duration-150"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </button>
                    <button
                      onClick={handleAccountSettings}
                      className="flex items-center px-4 py-3 text-sm text-primary-700 hover:bg-primary-50 w-full text-left transition-colors duration-150"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </button>
                    <hr className="my-2 border-primary-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-150"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-700 hover:text-secondary-600 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary-500"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-primary-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? "text-secondary-600 bg-secondary-50"
                      : "text-primary-700 hover:text-secondary-600 hover:bg-primary-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {currentUser ? (
                <div className="border-t border-primary-200 pt-3 mt-3">
                  <div className="px-3 py-3 bg-primary-50 rounded-lg mx-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-secondary-600">
                          {currentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-primary-800">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-primary-500 capitalize">
                          {currentUser.userType}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleViewProfile}
                    className="flex items-center w-full px-3 py-3 text-primary-700 hover:bg-primary-100 rounded-md transition-colors duration-150"
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </button>
                  <button
                    onClick={handleAccountSettings}
                    className="flex items-center w-full px-3 py-3 text-primary-700 hover:bg-primary-100 rounded-md transition-colors duration-150"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 bg-secondary-500 text-white px-3 py-3 rounded-lg hover:bg-secondary-600 transition-colors duration-200 font-medium mx-3"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
