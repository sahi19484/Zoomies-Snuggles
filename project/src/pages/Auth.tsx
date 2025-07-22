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

    // Update pet state based on password strength
    if (e.target.value.length > 0) {
      setPetState('shy');
    } else {
      setPetState('normal');
    }
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    setPetState('shy');
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    // Smooth transition back to normal state
    setTimeout(() => {
      setIsTyping(false);
      if (formData.password.length === 0) {
        setPetState('normal');
      }
    }, 300);
  };

  // Enhanced form submission with pet feedback
  const handleSubmitWithPetFeedback = (e: React.FormEvent) => {
    e.preventDefault();

    // Show happy pet during submission
    setPetState('happy');

    // Call original submit handler
    handleSubmit(e);
  };

  // Handle form field focus for different pet states
  const handleFieldFocus = (fieldName: string) => {
    if (fieldName === 'password') {
      setPetState('shy');
    } else {
      setPetState('winking');
      setTimeout(() => setPetState('normal'), 1500);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }
    toast.success(`Password reset instructions sent to ${formData.email}`);
  };

  // Enhanced Cute Pet Character Component
  const PetCharacter = () => {
    const [isBlinking, setIsBlinking] = React.useState(false);
    const [currentMessage, setCurrentMessage] = React.useState('');

    // Blinking animation
    React.useEffect(() => {
      if (petState === 'normal') {
        const blinkInterval = setInterval(() => {
          setIsBlinking(true);
          setTimeout(() => setIsBlinking(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(blinkInterval);
      }
    }, [petState]);

    // Dynamic messages based on state
    React.useEffect(() => {
      const messages = {
        shy: ["🙈 I won't peek!", "🤫 Your secret is safe!", "🙃 Privacy first!"],
        normal: ["👋 Hello there!", "🐕 Ready to help!", "😊 Welcome!"],
        happy: ["🎉 Great job!", "✨ Almost done!", "🥳 You're amazing!"],
        winking: ["😉 Good choice!", "👍 Looking good!", "🌟 Perfect!"]
      };

      const stateMessages = messages[petState] || messages.normal;
      setCurrentMessage(stateMessages[Math.floor(Math.random() * stateMessages.length)]);
    }, [petState]);

    return (
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className={`transform transition-all duration-500 ${petState === 'shy' ? 'scale-105' : 'scale-100'} hover:scale-110`}>
            <svg width="140" height="140" viewBox="0 0 140 140" className="drop-shadow-2xl filter">
              {/* Glow effect */}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Pet body with breathing animation */}
              <ellipse
                cx="70"
                cy="95"
                rx="40"
                ry="30"
                fill="#D2B48C"
                className="animate-pulse"
                style={{animationDuration: '3s'}}
              />

              {/* Pet head with subtle movement */}
              <circle
                cx="70"
                cy="55"
                r="35"
                fill="#F4A460"
                className={`transition-all duration-500 ${petState === 'shy' ? 'transform -translate-y-1' : ''}`}
              />

              {/* Ears with movement */}
              <ellipse
                cx="50"
                cy="30"
                rx="10"
                ry="18"
                fill="#CD853F"
                transform={`rotate(-20 50 30) ${petState === 'happy' ? 'scale(1.1)' : 'scale(1)'}`}
                className="transition-transform duration-300"
              />
              <ellipse
                cx="90"
                cy="30"
                rx="10"
                ry="18"
                fill="#CD853F"
                transform={`rotate(20 90 30) ${petState === 'happy' ? 'scale(1.1)' : 'scale(1)'}`}
                className="transition-transform duration-300"
              />

              {/* Inner ears */}
              <ellipse cx="50" cy="30" rx="5" ry="10" fill="#F4A460" transform="rotate(-20 50 30)" />
              <ellipse cx="90" cy="30" rx="5" ry="10" fill="#F4A460" transform="rotate(20 90 30)" />

              {/* Eyes - Multiple states */}
              {petState === 'normal' && !isBlinking && (
                <>
                  <circle cx="58" cy="48" r="6" fill="black" className="animate-pulse" style={{animationDuration: '2s'}} />
                  <circle cx="82" cy="48" r="6" fill="black" className="animate-pulse" style={{animationDuration: '2s'}} />
                  <circle cx="59" cy="46" r="2.5" fill="white" />
                  <circle cx="83" cy="46" r="2.5" fill="white" />
                  <circle cx="60" cy="47" r="1" fill="white" />
                  <circle cx="84" cy="47" r="1" fill="white" />
                </>
              )}

              {/* Blinking eyes */}
              {petState === 'normal' && isBlinking && (
                <>
                  <path d="M 52 48 Q 58 45 64 48" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 76 48 Q 82 45 88 48" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              )}

              {/* Happy eyes */}
              {petState === 'happy' && (
                <>
                  <path d="M 52 48 Q 58 44 64 48" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 76 48 Q 82 44 88 48" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
                </>
              )}

              {/* Winking */}
              {petState === 'winking' && (
                <>
                  <path d="M 52 48 Q 58 45 64 48" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="82" cy="48" r="6" fill="black" />
                  <circle cx="83" cy="46" r="2.5" fill="white" />
                  <circle cx="84" cy="47" r="1" fill="white" />
                </>
              )}

              {/* Shy state - closed eyes with paws */}
              {petState === 'shy' && (
                <>
                  <path d="M 52 48 Q 58 45 64 48" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 76 48 Q 82 45 88 48" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />

                  {/* Enhanced paws with animation */}
                  <g className="animate-bounce" style={{animationDuration: '2s'}}>
                    {/* Left paw */}
                    <ellipse cx="56" cy="43" rx="10" ry="8" fill="#CD853F" filter="url(#glow)" />
                    <circle cx="52" cy="41" r="2.5" fill="#8B4513" />
                    <circle cx="56" cy="40" r="2" fill="#8B4513" />
                    <circle cx="60" cy="41" r="2.5" fill="#8B4513" />

                    {/* Right paw */}
                    <ellipse cx="84" cy="43" rx="10" ry="8" fill="#CD853F" filter="url(#glow)" />
                    <circle cx="80" cy="41" r="2.5" fill="#8B4513" />
                    <circle cx="84" cy="40" r="2" fill="#8B4513" />
                    <circle cx="88" cy="41" r="2.5" fill="#8B4513" />
                  </g>
                </>
              )}

              {/* Nose with subtle animation */}
              <ellipse
                cx="70"
                cy="60"
                rx="3.5"
                ry="2.5"
                fill="black"
                className="animate-pulse"
                style={{animationDuration: '2s'}}
              />

              {/* Mouth - different expressions */}
              {petState === 'normal' && (
                <>
                  <path d="M 70 64 Q 64 70 58 68" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 70 64 Q 76 70 82 68" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              )}

              {petState === 'happy' && (
                <path d="M 60 68 Q 70 75 80 68" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}

              {(petState === 'shy' || petState === 'winking') && (
                <ellipse cx="70" cy="68" rx="8" ry="4" fill="black" opacity="0.8" />
              )}

              {/* Spots with subtle animation */}
              <circle cx="45" cy="60" r="5" fill="#CD853F" opacity="0.8" className="animate-pulse" style={{animationDuration: '4s'}} />
              <circle cx="90" cy="65" r="4" fill="#CD853F" opacity="0.8" className="animate-pulse" style={{animationDuration: '3s'}} />
              <circle cx="55" cy="80" r="3" fill="#CD853F" opacity="0.6" />

              {/* Tail with enhanced wagging */}
              <path
                d="M 100 85 Q 115 75 105 100"
                stroke="#CD853F"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                className={`transition-all duration-300 ${
                  petState === 'happy' ? 'animate-spin' :
                  petState === 'shy' ? 'animate-bounce' :
                  'animate-pulse'
                }`}
                style={{
                  transformOrigin: '100px 85px',
                  animationDuration: petState === 'happy' ? '0.5s' : '2s'
                }}
              />
            </svg>
          </div>

          {/* Enhanced dynamic message with better styling */}
          {petState !== 'normal' && (
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 animate-fade-in">
              <div className={`relative px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
                petState === 'shy' ? 'bg-pink-100 text-pink-700 border border-pink-200' :
                petState === 'happy' ? 'bg-green-100 text-green-700 border border-green-200' :
                petState === 'winking' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                'bg-secondary-100 text-secondary-700 border border-secondary-200'
              }`}>
                {currentMessage}
                {/* Speech bubble tail */}
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                  petState === 'shy' ? 'border-t-pink-200' :
                  petState === 'happy' ? 'border-t-green-200' :
                  petState === 'winking' ? 'border-t-blue-200' :
                  'border-t-secondary-200'
                }`}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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

          <form onSubmit={handleSubmitWithPetFeedback} className="space-y-6">
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
                    onFocus={() => handleFieldFocus('name')}
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
                  onFocus={() => handleFieldFocus('email')}
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
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
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
