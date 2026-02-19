import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Eye, EyeOff, Mail, Lock, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('adopter');
  const [organizationCode, setOrganizationCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [petState, setPetState] = useState('normal');
  const [authLoading, setAuthLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    experience: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setPetState('happy');

    try {
      if (isLogin) {
        // LOGIN
        if (!formData.email || !formData.password) {
          toast.error('Please fill in all fields');
          setPetState('normal');
          setAuthLoading(false);
          return;
        }

        const result = await signIn(formData.email, formData.password);
        
        if (result.success) {
          toast.success('Login successful! Welcome back.');
          setTimeout(() => navigate("/"), 500);
        } else {
          setPetState('normal');
        }
      } else {
        // SIGN UP
        if (userType === 'organization' && organizationCode !== '456123') {
          toast.error('Invalid organization code. Please contact support for assistance.');
          setPetState('normal');
          setAuthLoading(false);
          return;
        }

        if (!formData.name || !formData.email || !formData.password) {
          toast.error('Please fill in all required fields');
          setPetState('normal');
          setAuthLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          setPetState('normal');
          setAuthLoading(false);
          return;
        }

        const result = await signUp({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType,
          phone: formData.phone,
          location: formData.location,
          experience: formData.experience
        });

        if (result.success) {
          toast.success(`Registration successful! Welcome to Zoomies & Snuggles, ${formData.name}!`);
          
          // Store password for sign-in (in production, use proper hashing)
          localStorage.setItem(`password_${formData.email}`, formData.password);
          
          setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            location: '',
            experience: ''
          });
          
          setTimeout(() => navigate("/"), 500);
        } else {
          setPetState('normal');
        }
      }
    } catch (error) {
      setPetState('normal');
      console.error('Auth error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setFormData({
      ...formData,
      password: e.target.value
    });
    setIsTyping(e.target.value.length > 0);
    
    if (e.target.value.length > 0) {
      setPetState('shy');
    } else {
      setPetState('normal');
    }
  };

  const handlePasswordFocus = () => {
    setPetState('shy');
  };

  const handlePasswordBlur = () => {
    setTimeout(() => {
      setIsTyping(false);
      if (formData.password.length === 0) {
        setPetState('normal');
      }
    }, 300);
  };

  const handleFieldFocus = (fieldName) => {
    if (fieldName === 'password') {
      setPetState('shy');
    } else {
      setPetState('winking');
      setTimeout(() => setPetState('normal'), 1500);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }

    toast.info('For demo purposes: Use any email with password "password" to reset.');
  };

  const PetCharacter = () => {
    const [isBlinking, setIsBlinking] = React.useState(false);
    const [currentMessage, setCurrentMessage] = React.useState('');

    React.useEffect(() => {
      if (petState === 'normal') {
        const blinkInterval = setInterval(() => {
          setIsBlinking(true);
          setTimeout(() => setIsBlinking(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(blinkInterval);
      }
    }, [petState]);

    React.useEffect(() => {
      const messages = {
        shy: ['🙈 I won\'t peek!', '🤫 Your secret is safe!', '🙃 Privacy first!', '😇 Protecting your privacy!'],
        normal: ['👋 Hello there!', '🐕 Ready to help!', '😊 Welcome!'],
        happy: ['🎉 Great job!', '✨ Almost done!', '🥳 You\'re amazing!'],
        winking: ['😉 Good choice!', '👍 Looking good!', '🌟 Perfect!']
      };
      
      const stateMessages = messages[petState] || messages.normal;
      setCurrentMessage(stateMessages[Math.floor(Math.random() * stateMessages.length)]);
    }, [petState]);

    return (
      <div className="relative">
        <div className={`transform transition-all duration-700 ${petState === 'shy' ? 'scale-110 -translate-y-2' : 'scale-100'} hover:scale-105`}>
          <svg width="120" height="100" viewBox="0 0 120 100" className="drop-shadow-xl filter">
            <ellipse cx="60" cy="75" rx="35" ry="20" fill="#D2B48C" className="animate-pulse" style={{animationDuration: '3s'}} />
            <circle cx="60" cy="45" r="28" fill="#F4A460" className={`transition-all duration-700 ${petState === 'shy' ? 'transform -translate-y-2' : ''}`} />
            
            <ellipse cx="45" cy="25" rx="8" ry="15" fill="#CD853F" transform="rotate(-25 45 25)" />
            <ellipse cx="75" cy="25" rx="8" ry="15" fill="#CD853F" transform="rotate(25 75 25)" />
            <ellipse cx="45" cy="25" rx="4" ry="8" fill="#F4A460" transform="rotate(-25 45 25)" />
            <ellipse cx="75" cy="25" rx="4" ry="8" fill="#F4A460" transform="rotate(25 75 25)" />
            
            {petState === 'normal' && !isBlinking && (
              <>
                <circle cx="50" cy="40" r="5" fill="black" className="animate-pulse" style={{animationDuration: '2s'}} />
                <circle cx="70" cy="40" r="5" fill="black" className="animate-pulse" style={{animationDuration: '2s'}} />
                <circle cx="51" cy="38" r="2" fill="white" />
                <circle cx="71" cy="38" r="2" fill="white" />
              </>
            )}
            
            {petState === 'normal' && isBlinking && (
              <>
                <path d="M 45 40 Q 50 37 55 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 65 40 Q 70 37 75 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              </>
            )}
            
            {petState === 'happy' && (
              <>
                <path d="M 45 40 Q 50 36 55 40" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 65 40 Q 70 36 75 40" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
            
            {petState === 'winking' && (
              <>
                <path d="M 45 40 Q 50 37 55 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="70" cy="40" r="5" fill="black" />
                <circle cx="71" cy="38" r="2" fill="white" />
              </>
            )}
            
            {petState === 'shy' && (
              <>
                <path d="M 45 40 Q 50 37 55 40" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" className={`${isTyping ? 'animate-pulse' : ''}`} />
                <path d="M 65 40 Q 70 37 75 40" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" className={`${isTyping ? 'animate-pulse' : ''}`} />
                <ellipse cx="35" cy="48" rx="4" ry="3" fill="#FFB6C1" opacity="0.6" className="animate-pulse" />
                <ellipse cx="85" cy="48" rx="4" ry="3" fill="#FFB6C1" opacity="0.6" className="animate-pulse" />
              </>
            )}
            
            <ellipse cx="60" cy="50" rx="3" ry="2" fill="black" className="animate-pulse" style={{animationDuration: '2s'}} />
            
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
            
            <path d="M 85 70 Q 100 65 95 85" stroke="#CD853F" strokeWidth="8" fill="none" strokeLinecap="round" className="animate-pulse" style={{transformOrigin: '85px 70px', animationDuration: '2s'}} />
          </svg>
        </div>
        
        {petState !== 'normal' && (
          <div className="flex justify-center mt-2 animate-fade-in">
            <div className={`relative px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
              petState === 'shy' ? 'bg-pink-100 text-pink-700 border border-pink-200' :
              petState === 'happy' ? 'bg-green-100 text-green-700 border border-green-200' :
              petState === 'winking' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
              'bg-secondary-100 text-secondary-700 border border-secondary-200'
            } ${isTyping && petState === 'shy' ? 'animate-bounce' : ''}`}>
              {currentMessage}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent ${
                petState === 'shy' ? 'border-b-pink-200' :
                petState === 'happy' ? 'border-b-green-200' :
                petState === 'winking' ? 'border-b-blue-200' :
                'border-b-secondary-200'
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
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Heart className="h-8 w-8 text-secondary-500 fill-current" />
            <span className="font-heading font-bold text-xl text-primary-800">
              Zoomies & Snuggles
            </span>
          </Link>
          <p className="text-primary-600 mt-2 text-base font-medium">
            {isLogin ? 'Welcome back!' : 'Join our pet-loving community'}
          </p>
        </div>

        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-visible">
          <div className="flex justify-center mt-4 mb-6 z-10">
            <PetCharacter />
          </div>

          <div className="p-8 pt-2">
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
                  <label htmlFor="name" className="block text-sm font-medium text-primary-700 mb-2">
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
                {!isLogin && (
                  <p className="text-xs text-primary-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              {isLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-secondary-600 hover:text-secondary-700 transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold py-4 rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
