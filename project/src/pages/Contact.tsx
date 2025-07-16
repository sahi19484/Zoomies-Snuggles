import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Heart, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Banner from '../components/ui/Banner';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Save message
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const newMessage = {
      ...formData,
      id: Date.now(),
      userId: currentUser?.email || 'anonymous',
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    messages.push(newMessage);
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    setShowSuccessBanner(true);
    toast.success('Message sent successfully! We will respond within 24 hours.');
    
    // Scroll to top to show banner
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset form (keep user info if logged in)
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      subject: '',
      message: '',
      inquiryType: 'general'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Mon-Sat, 9 AM - 7 PM',
      action: () => window.open('tel:+919876543210'),
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'zoomiesnsnuggles@gmail.com',
      description: 'We respond within 24 hours',
      action: () => window.open('mailto:zoomiesnsnuggles@gmail.com'),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: '+91 98765 43210',
      description: 'Quick responses available',
      action: () => window.open('https://wa.me/919876543210'),
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Rajkot, Gujarat',
      description: 'By appointment only',
      action: () => {
        toast.success('To schedule a visit, please call us or send a message');
        window.open('https://maps.google.com/?q=Rajkot,Gujarat', '_blank');
      },
      color: 'bg-red-100 text-red-600'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 7:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 5:00 PM' },
    { day: 'Sunday', hours: 'Emergency calls only' }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'adoption', label: 'Pet Adoption' },
    { value: 'foster', label: 'Foster Program' },
    { value: 'volunteer', label: 'Volunteer Opportunities' },
    { value: 'emergency', label: 'Emergency/Rescue' },
    { value: 'partnership', label: 'Partnership/Collaboration' }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'adoption':
        navigate('/adoption');
        break;
      case 'foster':
        navigate('/foster');
        break;
      case 'resources':
        navigate('/resources');
        break;
      default:
        break;
    }
  };

  const handleEmergencyCall = () => {
    window.open('tel:+919876543210');
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-500 to-secondary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-accent-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Have questions about adoption, fostering, or our services? We're here to help and 
              would love to hear from you. Reach out to our friendly team anytime.
            </p>
            {currentUser && (
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full">
                <span className="font-medium">
                  Signed in as {currentUser.name} ({currentUser.userType})
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <button
                  key={index}
                  onClick={method.action}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${method.color} rounded-full mb-4`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary-800 mb-2">
                    {method.title}
                  </h3>
                  <p className="font-medium text-primary-700 mb-1">
                    {method.details}
                  </p>
                  <p className="text-sm text-primary-500">
                    {method.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                Send Us a Message
              </h2>
              
              {/* Success Banner */}
              {showSuccessBanner && (
                <div className="mb-6">
                  <Banner
                    type="success"
                    message="Your message has been sent successfully! Our team will respond within 24 hours."
                    onClose={() => setShowSuccessBanner(false)}
                  />
                </div>
              )}

              {currentUser && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>Account Detected:</strong> Your contact information has been pre-filled from your account.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primary-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-primary-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-primary-700 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      required
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-primary-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    placeholder="Brief subject of your message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-primary-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                    placeholder="Please share your message, questions, or how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary-500 text-white font-semibold py-4 rounded-lg hover:bg-secondary-600 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Office Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-accent-500" />
                Office Hours
              </h2>
              <div className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-primary-100 last:border-b-0">
                    <span className="text-primary-700 font-medium">{schedule.day}</span>
                    <span className="text-primary-600">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-accent-50 rounded-lg">
                <p className="text-sm text-accent-700">
                  <strong>Emergency Rescues:</strong> Available 24/7 for animal emergencies and rescue situations.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleQuickAction('adoption')}
                  className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors w-full text-left"
                >
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-secondary-500 mr-3" />
                    <span className="font-medium text-primary-800">Browse Pets</span>
                  </div>
                  <span className="text-secondary-500">→</span>
                </button>
                <button
                  onClick={() => handleQuickAction('foster')}
                  className="flex items-center justify-between p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors w-full text-left"
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-accent-500 mr-3" />
                    <span className="font-medium text-primary-800">Foster Program</span>
                  </div>
                  <span className="text-accent-500">→</span>
                </button>
                <button
                  onClick={() => handleQuickAction('resources')}
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors w-full text-left"
                >
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="font-medium text-primary-800">Pet Care Resources</span>
                  </div>
                  <span className="text-green-500">→</span>
                </button>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-6 text-white">
              <h2 className="font-heading font-bold text-xl mb-4">
                Emergency Rescue?
              </h2>
              <p className="text-red-100 mb-4 text-sm">
                If you've found an injured or abandoned animal that needs immediate help, contact us right away.
              </p>
              <button
                onClick={handleEmergencyCall}
                className="inline-flex items-center bg-white text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200 w-full justify-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                Emergency Hotline
              </button>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
                Our Location
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-secondary-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-primary-800">Zoomies & Snuggles</p>
                    <p className="text-primary-600">Rajkot, Gujarat, India</p>
                    <p className="text-sm text-primary-500 mt-1">
                      Exact address shared upon appointment confirmation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;