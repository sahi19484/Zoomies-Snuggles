import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, Eye, EyeOff, Mail, Lock, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('adopter');
  const [organizationCode, setOrganizationCode] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [petState, setPetState] = useState('normal'); // normal, shy, happy, winking
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    experience: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const userData = {
        name: formData.name || 'User',
        email: formData.email,
        userType: userType,
        isDemo: false
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));

      toast.success(`Login successful! Welcome back.`);
    } else {
      if (userType === 'organization' && organizationCode !== '456123') {
        toast.error('Invalid organization code. Please contact support for assistance.');
        return;
      }

      if (!formData.name || !formData.email || !formData.password) {
        toast.error('Please fill in all required fields');
        return;
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        userType: userType,
        phone: formData.phone,
        location: formData.location,
        experience: formData.experience,
        isDemo: false
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));

      toast.success(`Registration successful! Welcome to Zoomies & Snuggles, ${formData.name}!`);
    }

    // ✅ Redirect to Home and reload the page
    setTimeout(() => {
      window.location.href = "/";
    }, 500);

    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      location: '',
      experience: ''
    });
    setOrganizationCode('');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      password: e.target.value
    });
    setIsTyping(e.target.value.length > 0);
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    // Keep the "typing" state briefly for smooth transition
    setTimeout(() => {
      setIsTyping(false);
    }, 200);
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }
    toast.success(`Password reset instructions sent to ${formData.email}`);
  };

  // Cute Pet Character Component
  const PetCharacter = () => (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
          {/* Pet body */}
          <ellipse cx="60" cy="80" rx="35" ry="25" fill="#D2B48C" />

          {/* Pet head */}
          <circle cx="60" cy="45" r="30" fill="#F4A460" />

          {/* Ears */}
          <ellipse cx="45" cy="25" rx="8" ry="15" fill="#CD853F" transform="rotate(-20 45 25)" />
          <ellipse cx="75" cy="25" rx="8" ry="15" fill="#CD853F" transform="rotate(20 75 25)" />

          {/* Inner ears */}
          <ellipse cx="45" cy="25" rx="4" ry="8" fill="#F4A460" transform="rotate(-20 45 25)" />
          <ellipse cx="75" cy="25" rx="4" ry="8" fill="#F4A460" transform="rotate(20 75 25)" />

          {/* Eyes - normal state */}
          {!passwordFocused && !isTyping && (
            <>
              <circle cx="50" cy="40" r="5" fill="black" />
              <circle cx="70" cy="40" r="5" fill="black" />
              <circle cx="51" cy="38" r="2" fill="white" />
              <circle cx="71" cy="38" r="2" fill="white" />
            </>
          )}

          {/* Paws covering eyes when typing password */}
          {(passwordFocused || isTyping) && (
            <>
              {/* Closed eyes */}
              <path d="M 45 40 Q 50 37 55 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 65 40 Q 70 37 75 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Paws */}
              <g className={`transition-all duration-500 ${passwordFocused || isTyping ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                {/* Left paw */}
                <ellipse cx="48" cy="35" rx="8" ry="6" fill="#CD853F" />
                <circle cx="45" cy="33" r="2" fill="#8B4513" />
                <circle cx="48" cy="32" r="1.5" fill="#8B4513" />
                <circle cx="51" cy="33" r="2" fill="#8B4513" />

                {/* Right paw */}
                <ellipse cx="72" cy="35" rx="8" ry="6" fill="#CD853F" />
                <circle cx="69" cy="33" r="2" fill="#8B4513" />
                <circle cx="72" cy="32" r="1.5" fill="#8B4513" />
                <circle cx="75" cy="33" r="2" fill="#8B4513" />
              </g>
            </>
          )}

          {/* Nose */}
          <ellipse cx="60" cy="50" rx="3" ry="2" fill="black" />

          {/* Mouth */}
          <path d="M 60 53 Q 55 58 50 56" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 60 53 Q 65 58 70 56" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Spots */}
          <circle cx="40" cy="50" r="4" fill="#CD853F" opacity="0.7" />
          <circle cx="75" cy="55" r="3" fill="#CD853F" opacity="0.7" />

          {/* Tail wagging */}
          <path
            d="M 85 75 Q 95 70 90 85"
            stroke="#CD853F"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={`transition-all duration-1000 ${passwordFocused || isTyping ? 'animate-bounce' : ''}`}
          />
        </svg>

        {/* Cute message */}
        {(passwordFocused || isTyping) && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in">
            <div className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
              🙈 I won't peek!
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-warm-50 to-secondary-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Heart className="h-10 w-10 text-secondary-500 fill-current" />
            <span className="font-heading font-bold text-2xl text-primary-800">
              Zoomies & Snuggles
            </span>
          </Link>
          <p className="text-primary-600 mt-2">
            {isLogin ? 'Welcome back!' : 'Join our pet-loving community'}
          </p>
        </div>

        {/* Cute Pet Character */}
        <PetCharacter />

        {/* Auth Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Toggle Login/Register */}
          <div className="flex bg-primary-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                isLogin
                  ? 'bg-white text-primary-800 shadow-lg transform scale-105'
                  : 'text-primary-600 hover:text-primary-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                !isLogin
                  ? 'bg-white text-primary-800 shadow-lg transform scale-105'
                  : 'text-primary-600 hover:text-primary-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* User Type Selection */}
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                I want to:
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-200"
              >
                <option value="adopter">Adopt a Pet</option>
                <option value="foster">Become a Foster Parent</option>
                <option value="volunteer">Volunteer with Us</option>
                <option value="organization">Partner Organization</option>
              </select>
            </div>
          )}

          {/* Organization Code */}
          {!isLogin && userType === 'organization' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Organization Code *
              </label>
              <input
                type="text"
                value={organizationCode}
                onChange={(e) => setOrganizationCode(e.target.value)}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-200"
                placeholder="Enter organization code"
                required
              />
              <p className="text-xs text-primary-500 mt-1">
                Contact support if you don't have an organization code
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-primary-700 mb-2"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => {
                    setPasswordFocused(false);
                    setIsTyping(false);
                  }}
                  className="w-full pl-10 pr-12 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold py-4 rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
