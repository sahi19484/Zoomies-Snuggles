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

  // Enhanced Cute Pet Character Component as Form Guardian
  const PetCharacter = () => {
    const [isBlinking, setIsBlinking] = React.useState(false);
    const [currentMessage, setCurrentMessage] = React.useState('');
    const [pawsIntensity, setPawsIntensity] = React.useState(0);

    // Enhanced password typing animation
    React.useEffect(() => {
      if (petState === 'shy' && isTyping) {
        const typingInterval = setInterval(() => {
          setPawsIntensity(prev => (prev + 1) % 4);
        }, 200);
        return () => clearInterval(typingInterval);
      } else {
        setPawsIntensity(0);
      }
    }, [petState, isTyping]);

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
        shy: ["🙈 I won't peek!", "🤫 Your secret is safe!", "🙃 Privacy first!", "😇 Protecting your privacy!"],
        normal: ["👋 Hello there!", "🐕 Ready to help!", "😊 Welcome!"],
        happy: ["🎉 Great job!", "✨ Almost done!", "🥳 You're amazing!"],
        winking: ["😉 Good choice!", "👍 Looking good!", "🌟 Perfect!"]
      };
      
      const stateMessages = messages[petState] || messages.normal;
      setCurrentMessage(stateMessages[Math.floor(Math.random() * stateMessages.length)]);
    }, [petState]);

    return (
      <div className="relative">
        <div className={`transform transition-all duration-700 ${petState === 'shy' ? 'scale-110 -translate-y-2' : 'scale-100'} hover:scale-105`}>
          <svg width="120" height="100" viewBox="0 0 120 100" className="drop-shadow-xl filter">
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
              cx="60"
              cy="75"
              rx="35"
              ry="20"
              fill="#D2B48C"
              className={`animate-pulse ${petState === 'shy' ? 'animate-bounce-gentle' : ''}`}
              style={{animationDuration: '3s'}}
            />
            
            {/* Pet head with enhanced movement */}
            <circle
              cx="60"
              cy="45"
              r="28"
              fill="#F4A460"
              className={`transition-all duration-700 ${petState === 'shy' ? 'transform -translate-y-2 animate-heartbeat' : ''}`}
            />
            
            {/* Ears with enhanced movement */}
            <ellipse
              cx="45"
              cy="25"
              rx="8"
              ry="15"
              fill="#CD853F"
              transform={`rotate(-25 45 25) ${petState === 'shy' ? 'scale(1.1)' : petState === 'happy' ? 'scale(1.2)' : 'scale(1)'}`}
              className={`transition-transform duration-500 ${petState === 'shy' ? 'animate-wiggle' : ''}`}
            />
            <ellipse
              cx="75"
              cy="25"
              rx="8"
              ry="15"
              fill="#CD853F"
              transform={`rotate(25 75 25) ${petState === 'shy' ? 'scale(1.1)' : petState === 'happy' ? 'scale(1.2)' : 'scale(1)'}`}
              className={`transition-transform duration-500 ${petState === 'shy' ? 'animate-wiggle' : ''}`}
            />
            
            {/* Inner ears */}
            <ellipse cx="45" cy="25" rx="4" ry="8" fill="#F4A460" transform="rotate(-25 45 25)" />
            <ellipse cx="75" cy="25" rx="4" ry="8" fill="#F4A460" transform="rotate(25 75 25)" />
            
            {/* Eyes - Multiple states */}
            {petState === 'normal' && !isBlinking && (
              <>
                <circle cx="50" cy="40" r="5" fill="black" className="animate-pulse" style={{animationDuration: '2s'}} />
                <circle cx="70" cy="40" r="5" fill="black" className="animate-pulse" style={{animationDuration: '2s'}} />
                <circle cx="51" cy="38" r="2" fill="white" />
                <circle cx="71" cy="38" r="2" fill="white" />
                <circle cx="52" cy="39" r="0.8" fill="white" />
                <circle cx="72" cy="39" r="0.8" fill="white" />
              </>
            )}
            
            {/* Blinking eyes */}
            {petState === 'normal' && isBlinking && (
              <>
                <path d="M 45 40 Q 50 37 55 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 65 40 Q 70 37 75 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              </>
            )}
            
            {/* Happy eyes */}
            {petState === 'happy' && (
              <>
                <path d="M 45 40 Q 50 36 55 40" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 65 40 Q 70 36 75 40" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
            
            {/* Winking */}
            {petState === 'winking' && (
              <>
                <path d="M 45 40 Q 50 37 55 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="70" cy="40" r="5" fill="black" />
                <circle cx="71" cy="38" r="2" fill="white" />
                <circle cx="72" cy="39" r="0.8" fill="white" />
              </>
            )}
            
            {/* Shy state - closed eyes with properly connected paws */}
            {petState === 'shy' && (
              <>
                <path d="M 45 40 Q 50 37 55 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 65 40 Q 70 37 75 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Enhanced paws with proper connection and typing animation */}
                <g className={`transition-all duration-300 ${isTyping ? 'animate-bounce' : ''}`}
                   style={{animationDuration: '0.5s', transform: `scale(${1 + pawsIntensity * 0.05})`}}>

                  {/* Left arm connecting to paw */}
                  <ellipse cx="42" cy="38" rx="3" ry="8" fill="#CD853F" transform="rotate(-30 42 38)" />

                  {/* Left paw properly covering left eye */}
                  <ellipse cx="50" cy="38" rx="10" ry="8" fill="#CD853F" filter="url(#glow)"
                           className={`${isTyping ? 'animate-glow-pulse' : ''}`} />
                  {/* Left paw pads */}
                  <circle cx="47" cy="36" r="2" fill="#8B4513" />
                  <circle cx="50" cy="35" r="1.8" fill="#8B4513" />
                  <circle cx="53" cy="36" r="2" fill="#8B4513" />
                  <circle cx="50" cy="39" r="1.5" fill="#8B4513" />
                  <circle cx="48" cy="41" r="1.2" fill="#8B4513" />
                  <circle cx="52" cy="41" r="1.2" fill="#8B4513" />

                  {/* Right arm connecting to paw */}
                  <ellipse cx="78" cy="38" rx="3" ry="8" fill="#CD853F" transform="rotate(30 78 38)" />

                  {/* Right paw properly covering right eye */}
                  <ellipse cx="70" cy="38" rx="10" ry="8" fill="#CD853F" filter="url(#glow)"
                           className={`${isTyping ? 'animate-glow-pulse' : ''}`} />
                  {/* Right paw pads */}
                  <circle cx="67" cy="36" r="2" fill="#8B4513" />
                  <circle cx="70" cy="35" r="1.8" fill="#8B4513" />
                  <circle cx="73" cy="36" r="2" fill="#8B4513" />
                  <circle cx="70" cy="39" r="1.5" fill="#8B4513" />
                  <circle cx="68" cy="41" r="1.2" fill="#8B4513" />
                  <circle cx="72" cy="41" r="1.2" fill="#8B4513" />
                </g>

                {/* Extra sparkles when typing */}
                {isTyping && (
                  <g className="animate-fade-in">
                    <circle cx="38" cy="32" r="1" fill="#FFD700" className="animate-pulse" />
                    <circle cx="82" cy="30" r="1.5" fill="#FFD700" className="animate-pulse" style={{animationDelay: '0.2s'}} />
                    <circle cx="35" cy="42" r="1" fill="#FFD700" className="animate-pulse" style={{animationDelay: '0.4s'}} />
                    <circle cx="85" cy="40" r="1" fill="#FFD700" className="animate-pulse" style={{animationDelay: '0.6s'}} />
                    <circle cx="60" cy="28" r="1.2" fill="#FFD700" className="animate-pulse" style={{animationDelay: '0.8s'}} />
                  </g>
                )}

                {/* Cute blush effect when shy */}
                <ellipse cx="35" cy="48" rx="3" ry="2" fill="#FFB6C1" opacity="0.6" className="animate-pulse" />
                <ellipse cx="85" cy="48" rx="3" ry="2" fill="#FFB6C1" opacity="0.6" className="animate-pulse" />
              </>
            )}
            
            {/* Nose with subtle animation */}
            <ellipse
              cx="60"
              cy="50"
              rx="3"
              ry="2"
              fill="black"
              className={`animate-pulse ${petState === 'shy' ? 'animate-heartbeat' : ''}`}
              style={{animationDuration: '2s'}}
            />
            
            {/* Mouth - different expressions */}
            {petState === 'normal' && (
              <>
                <path d="M 60 53 Q 55 58 50 56" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 60 53 Q 65 58 70 56" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              </>
            )}
            
            {petState === 'happy' && (
              <path d="M 50 58 Q 60 65 70 58" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
            
            {(petState === 'shy' || petState === 'winking') && (
              <ellipse cx="60" cy="58" rx="6" ry="3" fill="black" opacity="0.8" className={`${petState === 'shy' && isTyping ? 'animate-pulse' : ''}`} />
            )}
            
            {/* Spots with subtle animation */}
            <circle cx="40" cy="50" r="4" fill="#CD853F" opacity="0.8" className="animate-pulse" style={{animationDuration: '4s'}} />
            <circle cx="75" cy="55" r="3" fill="#CD853F" opacity="0.8" className="animate-pulse" style={{animationDuration: '3s'}} />
            <circle cx="50" cy="70" r="2.5" fill="#CD853F" opacity="0.6" />
            
            {/* Tail with enhanced wagging */}
            <path
              d="M 85 70 Q 100 65 95 85"
              stroke="#CD853F"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={`transition-all duration-300 ${
                petState === 'happy' ? 'animate-spin' :
                petState === 'shy' ? 'animate-wiggle' :
                'animate-pulse'
              }`}
              style={{
                transformOrigin: '85px 70px',
                animationDuration: petState === 'happy' ? '0.5s' : petState === 'shy' ? '1s' : '2s'
              }}
            />
          </svg>
        </div>
        
        {/* Enhanced dynamic message positioned for form support */}
        {petState !== 'normal' && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in z-20">
            <div className={`relative px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm ${
              petState === 'shy' ? 'bg-pink-100 text-pink-700 border border-pink-200' :
              petState === 'happy' ? 'bg-green-100 text-green-700 border border-green-200' :
              petState === 'winking' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
              'bg-secondary-100 text-secondary-700 border border-secondary-200'
            } ${isTyping && petState === 'shy' ? 'animate-bounce' : ''}`}>
              {currentMessage}
              {/* Speech bubble tail */}
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent ${
                petState === 'shy' ? 'border-t-pink-200' :
                petState === 'happy' ? 'border-t-green-200' :
                petState === 'winking' ? 'border-t-blue-200' :
                'border-t-secondary-200'
              }`}></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-warm-50 to-secondary-50 py-4">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Heart className="h-8 w-8 text-secondary-500 fill-current" />
            <span className="font-heading font-bold text-xl text-primary-800">
              Zoomies & Snuggles
            </span>
          </Link>
          <p className="text-primary-600 mt-1 text-sm">
            {isLogin ? 'Welcome back!' : 'Join our pet-loving community'}
          </p>
        </div>

        {/* Integrated Auth Form with Pet Character as Guardian */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-visible">
          {/* Pet Character centered at top of form */}
          <div className="flex justify-center -mt-12 mb-4 z-10">
            <PetCharacter />
          </div>

          <div className="p-8 pt-4">
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
                className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold py-4 rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 btn-enhanced"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
