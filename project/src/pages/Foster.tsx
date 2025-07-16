import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Home, Clock, Users, CheckCircle, ArrowRight, Download, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Foster = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const benefits = [
    {
      icon: Heart,
      title: 'Save Lives',
      description: 'Provide critical care to pets who need time to recover or grow before adoption.'
    },
    {
      icon: Home,
      title: 'Flexible Commitment',
      description: 'Choose short-term or long-term fostering based on your availability and preferences.'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a network of caring foster families with 24/7 support and guidance.'
    },
    {
      icon: CheckCircle,
      title: 'All Supplies Provided',
      description: 'We provide food, medical care, and all necessary supplies for your foster pet.'
    }
  ];

  const requirements = [
    'Must be 18 years or older',
    'Stable living situation',
    'Available time for pet care',
    'Basic pet care knowledge',
    'Access to veterinary care',
    'Safe, pet-friendly environment'
  ];

  const fosterTypes = [
    {
      title: 'Emergency Foster',
      duration: '1-2 weeks',
      description: 'Provide immediate temporary care for pets in crisis situations.',
      urgency: 'High Priority',
      color: 'border-red-200 bg-red-50',
      available: 8
    },
    {
      title: 'Medical Foster',
      duration: '2-8 weeks',
      description: 'Care for pets recovering from surgery or medical treatment.',
      urgency: 'Ongoing Need',
      color: 'border-blue-200 bg-blue-50',
      available: 3
    },
    {
      title: 'Puppy/Kitten Foster',
      duration: '8-12 weeks',
      description: 'Nurture young animals until they\'re ready for adoption.',
      urgency: 'Seasonal',
      color: 'border-green-200 bg-green-50',
      available: 12
    },
    {
      title: 'Long-term Foster',
      duration: '3+ months',
      description: 'Provide extended care for pets with special needs or behavioral rehabilitation.',
      urgency: 'Special Cases',
      color: 'border-purple-200 bg-purple-50',
      available: 5
    }
  ];

  const upcomingEvents = [
    {
      date: '18',
      month: 'Dec',
      title: 'Foster Parent Orientation',
      location: 'Community Center, University Road',
      time: '10:00 AM - 12:00 PM',
      description: 'Learn about our foster program and meet current foster families.'
    },
    {
      date: '25',
      month: 'Dec',
      title: 'Foster Family Holiday Gathering',
      location: 'Rajkot Municipal Garden',
      time: '4:00 PM - 7:00 PM',
      description: 'Celebrate the holidays with fellow foster families and their pets.'
    },
    {
      date: '2',
      month: 'Jan',
      title: 'Pet Care Workshop for Foster Parents',
      location: 'Online Event',
      time: '7:00 PM - 8:30 PM',
      description: 'Advanced pet care techniques and emergency preparedness.'
    }
  ];

  const handleApplyToFoster = () => {
    if (!currentUser) {
      navigate('/auth');
      toast.error('Please sign in to apply for fostering');
      return;
    }
    navigate('/foster/apply');
    toast.success('Redirecting to foster application form');
  };

  const handleFosterTypeSelect = (type) => {
    if (!currentUser) {
      navigate('/auth');
      toast.error('Please sign in to select foster type');
      return;
    }
    navigate('/foster/apply');
    toast.success(`Selected ${type} - proceeding to application`);
  };

  const handleEventRegistration = (eventTitle) => {
    if (!currentUser) {
      navigate('/auth');
      toast.error('Please sign in to register for events');
      return;
    }
    
    // Navigate to event registration page
    const eventId = eventTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/event-registration/${eventId}`);
  };

  const handleDownloadGuide = () => {
    // Create a comprehensive foster guide content
    const guideContent = `
      FOSTER CARE GUIDE - ZOOMIES & SNUGGLES
      
      Welcome to Foster Parenting!
      
      Thank you for your interest in becoming a foster parent. This guide will help you understand what to expect and how to prepare for your fostering journey.
      
      GETTING STARTED:
      1. Complete the foster application
      2. Attend orientation session
      3. Home visit and approval
      4. Match with a foster pet
      5. Begin fostering with full support
      
      WHAT WE PROVIDE:
      - All food and supplies
      - Complete veterinary care
      - 24/7 support hotline
      - Training and guidance
      - Transportation assistance
      
      FOSTER TYPES:
      - Emergency Foster (1-2 weeks)
      - Medical Foster (2-8 weeks)
      - Puppy/Kitten Foster (8-12 weeks)
      - Long-term Foster (3+ months)
      
      CONTACT INFORMATION:
      Phone: +91 98765 43210
      Email: foster@zoomiessnuggles.org
      Emergency Hotline: Available 24/7
      
      For complete guide, visit our website or contact us directly.
    `;
    
    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Foster_Care_Guide.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Foster care guide downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-500 to-secondary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">
                Become a Foster Parent
              </h1>
              <p className="text-xl text-accent-100 mb-8 leading-relaxed">
                Open your heart and home to a pet in need. Foster care saves lives and makes adoption possible. 
                Join our community of heroes in Rajkot who are making a difference, one pet at a time.
              </p>
              {currentUser && (
                <div className="mb-6 inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full">
                  <span className="font-medium">
                    Welcome, {currentUser.name}! Ready to start your fostering journey?
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleApplyToFoster}
                  className="bg-white text-accent-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg"
                >
                  {currentUser ? 'Apply to Foster' : 'Sign In to Apply'}
                </button>
                <button 
                  onClick={handleDownloadGuide}
                  className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-accent-600 transition-all duration-200 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Foster Guide
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4587955/pexels-photo-4587955.jpeg"
                alt="Foster family with pets"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="font-bold text-2xl text-accent-500">245</div>
                  <div className="text-sm text-primary-600">Active Foster Families</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Foster Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
              Why Foster with Us?
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Fostering is one of the most rewarding ways to help animals in need. Here's why our program stands out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-secondary-500" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-primary-800 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-primary-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Foster Types */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
              Types of Foster Care
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Choose the type of fostering that best fits your lifestyle and availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fosterTypes.map((type, index) => (
              <div 
                key={index} 
                onClick={() => handleFosterTypeSelect(type.title)}
                className={`border-2 rounded-xl p-6 ${type.color} hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-xl text-primary-800">
                    {type.title}
                  </h3>
                  <span className="text-sm font-semibold px-3 py-1 bg-white rounded-full text-primary-700">
                    {type.urgency}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary-600" />
                    <span className="text-primary-700 font-medium">{type.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-primary-700 font-medium">{type.available} pets need homes</span>
                  </div>
                </div>
                <p className="text-primary-600 leading-relaxed mb-4">
                  {type.description}
                </p>
                <div className="text-center">
                  <button className="bg-secondary-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-secondary-600 transition-colors duration-200">
                    Select This Type
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="font-heading font-bold text-3xl text-primary-800 mb-6 text-center">
              Foster Requirements
            </h2>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-heading font-bold text-lg text-primary-800 mb-4">
                Foster Requirements Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-primary-700 text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={handleApplyToFoster}
                className="bg-secondary-500 text-white font-semibold px-12 py-4 rounded-lg hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {currentUser ? 'Apply Now' : 'Sign In to Apply'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
              Foster Community Events
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Join our foster family community at upcoming events and workshops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-primary-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-3xl text-secondary-500">{event.date}</div>
                    <div className="text-sm text-primary-600 uppercase font-medium">{event.month}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-primary-800 mb-2">
                      {event.title}
                    </h3>
                    <div className="space-y-1 text-sm text-primary-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-primary-600 text-sm mb-4 leading-relaxed">
                  {event.description}
                </p>
                <button
                  onClick={() => handleEventRegistration(event.title)}
                  className="w-full bg-accent-500 text-white font-semibold py-3 rounded-lg hover:bg-accent-600 transition-colors duration-200"
                >
                  {currentUser ? 'Register for Event' : 'Sign In to Register'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-secondary-500 to-accent-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-6">
            Ready to Save Lives?
          </h2>
          <p className="text-xl text-secondary-100 mb-8 leading-relaxed">
            Every foster family makes it possible for us to rescue more pets. Your temporary care 
            creates permanent change in an animal's life.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Phone className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <a href="tel:+919484844090" className="text-secondary-100 hover:text-white">
                +91 9484844090
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Mail className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <a href="mailto:foster@zoomiessnuggles.org" className="text-secondary-100 hover:text-white">
                zoomiesnsnuggles@gmail.com
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Calendar className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Schedule Visit</h3>
              <span className="text-secondary-100">By appointment only</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleApplyToFoster}
              className="bg-white text-secondary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Apply Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            <button 
              onClick={handleDownloadGuide}
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-secondary-600 transition-all duration-200"
            >
              Download Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Foster;