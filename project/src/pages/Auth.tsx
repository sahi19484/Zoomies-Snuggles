import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';

// ✅ CORRECT: Import db and auth from their proper locations
import { db } from './firebase/config'; // Firestore database
import { auth } from './firebase/config'; // Firebase authentication

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('adopter');
  const [organizationCode, setOrganizationCode] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [petState, setPetState] = useState('normal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    experience: ''
  });
  const navigate = useNavigate();

  // ✅ CHECK IF EMAIL EXISTS IN FIRESTORE
  const checkEmailExistsInFirestore = async (email) => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking email in Firestore:", error);
      return false;
    }
  };

  // ✅ SAVE USER TO FIRESTORE
  const saveUserToFirestore = async (user, additionalData = {}) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: additionalData.name || user.displayName || '',
        email: user.email,
        userType: additionalData.userType || 'adopter',
        phone: additionalData.phone || '',
        location: additionalData.location || '',
        experience: additionalData.experience || '',
        createdAt: new Date().toISOString(),
        uid: user.uid,
        photoURL: user.photoURL || ''
      });
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      throw error;
    }
  };

  // ✅ GOOGLE SIGN IN
  const handleGoogleSignIn = async () => {
    try {
      setPetState('happy');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userExists = await checkEmailExistsInFirestore(user.email);
      
      if (!userExists) {
        // New user - save to Firestore
        await saveUserToFirestore(user, {
          userType: userType,
          name: user.displayName
        });
        toast.success(`Welcome to Zoomies & Snuggles, ${user.displayName}!`);
      } else {
        toast.success(`Login successful! Welcome back, ${user.displayName}!`);
      }

      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      setPetState('normal');
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled');
      } else {
        toast.error(error.message);
      }
    }
  };

  // ✅ APPLE SIGN IN
  const handleAppleSignIn = async () => {
    try {
      setPetState('happy');
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userExists = await checkEmailExistsInFirestore(user.email);
      
      if (!userExists) {
        // New user - save to Firestore
        await saveUserToFirestore(user, {
          userType: userType,
          name: user.displayName
        });
        toast.success(`Welcome to Zoomies & Snuggles!`);
      } else {
        toast.success(`Login successful! Welcome back!`);
      }

      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      setPetState('normal');
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled');
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPetState('happy');

    if (isLogin) {
      // ✅ SIGN IN: CHECK EMAIL EXISTS FIRST
      try {
        if (!formData.email || !formData.password) {
          toast.error('Please fill in all fields');
          setPetState('normal');
          return;
        }

        const emailExists = await checkEmailExistsInFirestore(formData.email);
        
        if (!emailExists) {
          toast.error('This email is not registered. Please sign up first.');
          setPetState('normal');
          return;
        }

        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success('Login successful! Welcome back.');
        setTimeout(() => navigate("/"), 500);
      } catch (error) {
        setPetState('normal');
        
        if (error.code === 'auth/user-not-found') {
          toast.error('This email is not registered. Please sign up first.');
        } else if (error.code === 'auth/wrong-password') {
          toast.error('Incorrect password. Please try again.');
        } else if (error.code === 'auth/invalid-email') {
          toast.error('Invalid email format.');
        } else {
          toast.error(error.message);
        }
      }
    } else {
      // ✅ SIGN UP: CREATE NEW ACCOUNT
      if (userType === 'organization' && organizationCode !== '456123') {
        toast.error('Invalid organization code. Please contact support for assistance.');
        setPetState('normal');
        return;
      }

      if (!formData.name || !formData.email || !formData.password) {
        toast.error('Please fill in all required fields');
        setPetState('normal');
        return;
      }

      const emailExists = await checkEmailExistsInFirestore(formData.email);
      if (emailExists) {
        toast.error('This email is already registered. Please sign in.');
        setPetState('normal');
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // ✅ ADD USER TO FIRESTORE DATABASE
        await saveUserToFirestore(user, {
          name: formData.name,
          userType: userType,
          phone: formData.phone,
          location: formData.location,
          experience: formData.experience
        });

        toast.success(`Registration successful! Welcome to Zoomies & Snuggles, ${formData.name}!`);
        
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          location: '',
          experience: ''
        });
        
        setTimeout(() => navigate("/"), 500);
      } catch (error) {
        setPetState('normal');
        
        if (error.code === 'auth/email-already-in-use') {
          toast.error('This email is already registered. Please sign in.');
        } else if (error.code === 'auth/weak-password') {
          toast.error('Password is too weak. Please use at least 6 characters.');
        } else if (error.code === 'auth/invalid-email') {
          toast.error('Invalid email format.');
        } else {
          toast.error(error.message);
        }
      }
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
    setPasswordFocused(true);
    setPetState('shy');
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    setTimeout(() => {
      setIsTyping(false);
      if (formData.password.length === 0) {
        setPetState('normal');
      }
    }, 300);
  };

  const handleSubmitWithPetFeedback = (e) => {
    e.preventDefault();
    setPetState('happy');
    handleSubmit(e);
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
    
    const emailExists = await checkEmailExistsInFirestore(formData.email);
    if (!emailExists) {
      toast.error('This email is not registered. Please sign up first.');
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast.success(`Password reset instructions sent to ${formData.email}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Pet Character Component
  const PetCharacter = () => {
    const [isBlinking, setIsBlinking] = React.useState(false);
    const [currentMessage, setCurrentMessage] = React.useState('');
    const [pawsIntensity, setPawsIntensity] = React.useState(0);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    React.useEffect(() => {
      if (petState === 'shy' && isTyping && !isMobile) {
        const typingInterval = setInterval(() => {
          setPawsIntensity(prev => (prev + 1) % 4);
        }, 300);
        return () => clearInterval(typingInterval);
      } else {
        setPawsIntensity(0);
      }
    }, [petState, isTyping, isMobile]);

    React.useEffect(() => {
      if (petState === 'normal') {
        const blinkInterval = setInterval(() => {
          setIsBlinking(true);
          setTimeout(() => setIsBlinking(false), 150);
        }, isMobile ? 5000 : 3000 + Math.random() * 2000);
        return () => clearInterval(blinkInterval);
      }
    }, [petState, isMobile]);

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
        <div className={`pet-smooth-move ${
          petState === 'normal' ? 'pet-idle' :
          petState === 'happy' ? 'pet-excited' :
          petState === 'shy' ? (isMobile ? 'scale-105 -translate-y-1' : 'scale-110 -translate-y-2') : 
          'scale-100'
        } ${!isMobile ? 'hover:pet-smooth-scale hover:scale-105' : ''}`}>
          <svg 
            width={isMobile ? "100" : "120"} 
            height={isMobile ? "85" : "100"} 
            viewBox="0 0 120 100" 
            className={`${isMobile ? 'drop-shadow-lg' : 'drop-shadow-xl'} filter`}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation={isMobile ? "2" : "3"} result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <ellipse
              cx="60"
              cy="75"
              rx="35"
              ry="20"
              fill="#D2B48C"
              className={`pet-breathing ${petState === 'shy' && !isMobile ? 'pet-gentle-bounce' : ''}`}
            />
            
            <circle
              cx="60"
              cy="45"
              r="28"
              fill="#F4A460"
              className={`pet-smooth-move ${
                petState === 'shy' ? (isMobile ? 'transform -translate-y-1' : 'transform -translate-y-2 animate-heartbeat') : 
                petState === 'normal' ? 'gentle-sway' : ''
              }`}
            />
            
            <ellipse
              cx="45"
              cy="25"
              rx="8"
              ry="15"
              fill="#CD853F"
              transform={`rotate(-25 45 25) ${
                petState === 'shy' ? (isMobile ? 'scale(1.05)' : 'scale(1.1)') : 
                petState === 'happy' ? 'scale(1.2)' : 'scale(1)'
              }`}
              className={`pet-smooth-scale ${
                petState === 'shy' && !isMobile ? 'animate-wiggle' : 
                petState === 'normal' ? 'gentle-sway' : ''
              }`}
            />
            <ellipse
              cx="75"
              cy="25"
              rx="8"
              ry="15"
              fill="#CD853F"
              transform={`rotate(25 75 25) ${
                petState === 'shy' ? (isMobile ? 'scale(1.05)' : 'scale(1.1)') : 
                petState === 'happy' ? 'scale(1.2)' : 'scale(1)'
              }`}
              className={`pet-smooth-scale ${
                petState === 'shy' && !isMobile ? 'animate-wiggle' : 
                petState === 'normal' ? 'gentle-sway' : ''
              }`}
            />
            
            <ellipse cx="45" cy="25" rx="4" ry="8" fill="#F4A460" transform="rotate(-25 45 25)" />
            <ellipse cx="75" cy="25" rx="4" ry="8" fill="#F4A460" transform="rotate(25 75 25)" />
            
            {petState === 'normal' && !isBlinking && (
              <>
                <circle cx="50" cy="40" r="5" fill="black" className={!isMobile ? "animate-pulse" : ""} style={{animationDuration: '2s'}} />
                <circle cx="70" cy="40" r="5" fill="black" className={!isMobile ? "animate-pulse" : ""} style={{animationDuration: '2s'}} />
                <circle cx="51" cy="38" r="2" fill="white" />
                <circle cx="71" cy="38" r="2" fill="white" />
                <circle cx="52" cy="39" r="0.8" fill="white" />
                <circle cx="72" cy="39" r="0.8" fill="white" />
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
                <circle cx="72" cy="39" r="0.8" fill="white" />
              </>
            )}
            
            {petState === 'shy' && (
              <>
                <path d="M 45 40 Q 50 37 55 40" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round"
                      className={`${isTyping && !isMobile ? 'animate-pulse' : ''}`} />
                <path d="M 65 40 Q 70 37 75 40" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round"
                      className={`${isTyping && !isMobile ? 'animate-pulse' : ''}`} />

                <path d="M 47 38 L 48 36" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" />
                <path d="M 50 37 L 50 35" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" />
                <path d="M 53 38 L 52 36" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" />

                <path d="M 67 38 L 68 36" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" />
                <path d="M 70 37 L 70 35" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" />
                <path d="M 73 38 L 72 36" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" />

                <ellipse cx="35" cy="48" rx="4" ry="3" fill="#FFB6C1" opacity={isMobile ? "0.4" : "0.6"} className={!isMobile ? "animate-pulse" : ""} />
                <ellipse cx="85" cy="48" rx="4" ry="3" fill="#FFB6C1" opacity={isMobile ? "0.4" : "0.6"} className={!isMobile ? "animate-pulse" : ""} />

                {isTyping && !isMobile && (
                  <g className="animate-fade-in">
                    <circle cx="30" cy="35" r="1" fill="#FFD700" className="animate-pulse" />
                    <circle cx="90" cy="33" r="1.2" fill="#FFD700" className="animate-pulse" style={{animationDelay: '0.3s'}} />
                    <circle cx="60" cy="28" r="1" fill="#FFD700" className="animate-pulse" style={{animationDelay: '0.6s'}} />
                  </g>
                )}
              </>
            )}
            
            <ellipse
              cx="60"
              cy="50"
              rx="3"
              ry="2"
              fill="black"
              className={`${!isMobile ? 'animate-pulse' : ''} ${petState === 'shy' && !isMobile ? 'animate-heartbeat' : ''}`}
              style={{animationDuration: '2s'}}
            />
            
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
              <ellipse cx="60" cy="58" rx="6" ry="3" fill="black" opacity="0.8" 
                       className={`${petState === 'shy' && isTyping && !isMobile ? 'animate-pulse' : ''}`} />
            )}
            
            <path
              d="M 85 70 Q 100 65 95 85"
              stroke="#CD853F"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={`transition-all ${isMobile ? 'duration-200' : 'duration-300'} ${
                petState === 'happy' && !isMobile ? 'animate-spin' :
                petState === 'shy' && !isMobile ? 'animate-wiggle' :
                !isMobile ? 'animate-pulse' : ''
              }`}
              style={{
                transformOrigin: '85px 70px',
                animationDuration: petState === 'happy' ? '0.5s' : petState === 'shy' ? '1s' : '2s'
              }}
            />
          </svg>
        </div>
        
        {petState !== 'normal' && (
          <div className={`flex justify-center mt-2 ${!isMobile ? 'smooth-appear' : 'animate-fade-in-mobile'}`}>
            <div className={`relative px-3 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg backdrop-blur-sm ${
              petState === 'shy' ? 'bg-pink-100 text-pink-700 border border-pink-200' :
              petState === 'happy' ? 'bg-green-100 text-green-700 border border-green-200' :
              petState === 'winking' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
              'bg-secondary-100 text-secondary-700 border border-secondary-200'
            } ${isTyping && petState === 'shy' && !isMobile ? 'animate-bounce' : ''}`}>
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
        {/* Logo */}
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

        {/* Auth Form */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-visible">
          {/* Pet Character */}
          <div className="flex justify-center mt-4 mb-6 z-10">
            <PetCharacter />
          </div>

          <div className="p-8 pt-2">
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

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-primary-200"></div>
              <span className="px-4 text-sm text-primary-500 font-medium">Or continue with</span>
              <div className="flex-1 border-t border-primary-200"></div>
            </div>

            {/* OAuth Buttons - REMOVED DUPLICATES */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-primary-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-primary-700 bg-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>

              {/* Apple Sign In */}
              <button
                type="button"
                onClick={handleAppleSignIn}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-primary-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-primary-700 bg-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05 1.96-3.79 1.96-1.54 0-2.48-1.02-3.8-1.02-1.32 0-2.33 1.05-3.85 1.05-2.05 0-4.01-2.1-5.17-5.02-1.84-4.55.22-9.76 4.38-9.76 1.49 0 2.84.88 3.73.88.88 0 2.53-.94 4.31-.94 1.32 0 2.65.65 3.38 1.67-3.08 1.57-2.58 6.07.6 7.37-.53 1.4-1.26 2.79-1.99 3.81zm-3.04-16.1c.74-.88 1.25-2.09 1.11-3.32-1.07.04-2.37.71-3.13 1.6-.68.78-1.27 2.03-1.11 3.23 1.19.09 2.4-.62 3.13-1.51z" />
                </svg>
                <span className="hidden sm:inline">Apple</span>
              </button>
            </div>

            {/* Forgot Password Link */}
            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
