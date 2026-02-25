import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Banner from '../components/ui/Banner';

const FosterApply = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    fosterType: 'emergency',
    experience: '',
    availability: '',
    housing: '',
    otherPets: '',
    references: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setApplicationData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const requirements = [
    'Must be 18 years or older',
    'Stable living situation',
    'Available time for pet care',
    'Basic pet care knowledge',
    'Access to veterinary care',
    'Safe, pet-friendly environment'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!applicationData.name || !applicationData.email || !applicationData.phone || !applicationData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Save application
    const applications = JSON.parse(localStorage.getItem('fosterApplications') || '[]');
    const newApplication = {
      ...applicationData,
      id: Date.now(),
      userId: currentUser.email,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      type: 'foster'
    };
    
    applications.push(newApplication);
    localStorage.setItem('fosterApplications', JSON.stringify(applications));

    setShowSuccessBanner(true);
    toast.success('Foster application submitted successfully!');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset form
    setApplicationData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: '',
      fosterType: 'emergency',
      experience: '',
      availability: '',
      housing: '',
      otherPets: '',
      references: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/foster')}
          className="flex items-center space-x-2 text-primary-600 hover:text-secondary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Foster Program</span>
        </button>

        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="mb-8">
            <Banner
              type="success"
              message="Your foster application has been submitted! Our team will review your application and contact you within 48 hours to discuss next steps."
              onClose={() => setShowSuccessBanner(false)}
            />
          </div>
        )}

        {/* Application Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-secondary-500 mx-auto mb-4" />
            <h1 className="font-heading font-bold text-3xl text-primary-800 mb-4">
              Foster Application
            </h1>
            <p className="text-lg text-primary-600">
              Thank you for your interest in becoming a foster parent. Please fill out this application completely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={applicationData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={applicationData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={applicationData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  placeholder="+91 9484844090"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Foster Type Preference *
                </label>
                <select
                  name="fosterType"
                  required
                  value={applicationData.fosterType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                >
                  <option value="emergency">Emergency Foster</option>
                  <option value="medical">Medical Foster</option>
                  <option value="puppy">Puppy/Kitten Foster</option>
                  <option value="longterm">Long-term Foster</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Home Address *
              </label>
              <textarea
                name="address"
                required
                rows={3}
                value={applicationData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                placeholder="Please provide your complete address in Rajkot"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Pet Care Experience
              </label>
              <textarea
                name="experience"
                rows={4}
                value={applicationData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                placeholder="Tell us about your experience with pets, including any fostering or volunteer work..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Availability
                </label>
                <select
                  name="availability"
                  value={applicationData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                >
                  <option value="">Select availability</option>
                  <option value="full-time">Full-time (home most of the day)</option>
                  <option value="part-time">Part-time (home several hours daily)</option>
                  <option value="weekends">Weekends and evenings</option>
                  <option value="flexible">Flexible schedule</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Housing Type
                </label>
                <select
                  name="housing"
                  value={applicationData.housing}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                >
                  <option value="">Select housing type</option>
                  <option value="house">Independent House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa/Bungalow</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Current Pets
              </label>
              <textarea
                name="otherPets"
                rows={3}
                value={applicationData.otherPets}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                placeholder="Please list any current pets, their ages, and vaccination status..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                References
              </label>
              <textarea
                name="references"
                rows={3}
                value={applicationData.references}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                placeholder="Please provide contact information for 2 references (veterinarian, previous landlord, etc.)"
              />
            </div>

            {/* Requirements Checklist */}
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

            <div className="text-center">
              <button
                type="submit"
                className="bg-secondary-500 text-white font-semibold px-12 py-4 rounded-lg hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Submit Foster Application
              </button>
              <p className="text-sm text-primary-500 mt-4">
                Our team will review your application and contact you within 48 hours.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FosterApply;