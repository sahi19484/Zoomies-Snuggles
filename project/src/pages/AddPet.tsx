import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Upload, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import Banner from '../components/ui/Banner';

const AddPet = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [petData, setPetData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    size: 'Medium',
    gender: 'Male',
    location: '',
    description: '',
    medicalHistory: '',
    personality: '',
    requirements: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    reason: '',
    vaccinated: false,
    neutered: false,
    urgent: false,
    adoptionFee: ''
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setPetData(prev => ({
        ...prev,
        contactName: user.name || '',
        contactEmail: user.email || '',
        contactPhone: user.phone || '',
        location: user.location || 'Rajkot, Gujarat'
      }));
    } else {
      navigate('/auth');
      toast.error('Please sign in to add a pet for adoption');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!petData.name || !petData.breed || !petData.age || !petData.description || !petData.contactName || !petData.contactPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Save pet submission
    const petSubmissions = JSON.parse(localStorage.getItem('petSubmissions') || '[]');
    const newSubmission = {
      ...petData,
      id: Date.now(),
      submittedBy: currentUser.email,
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      images: images
    };
    
    petSubmissions.push(newSubmission);
    localStorage.setItem('petSubmissions', JSON.stringify(petSubmissions));

    setShowSuccessBanner(true);
    toast.success('Pet submission received! We will review and contact you within 24 hours.');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset form
    setPetData({
      name: '',
      species: 'Dog',
      breed: '',
      age: '',
      size: 'Medium',
      gender: 'Male',
      location: currentUser.location || 'Rajkot, Gujarat',
      description: '',
      medicalHistory: '',
      personality: '',
      requirements: '',
      contactName: currentUser.name || '',
      contactPhone: currentUser.phone || '',
      contactEmail: currentUser.email || '',
      reason: '',
      vaccinated: false,
      neutered: false,
      urgent: false,
      adoptionFee: ''
    });
    setImages([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
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
          onClick={() => navigate('/adoption')}
          className="flex items-center space-x-2 text-primary-600 hover:text-secondary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Adoption</span>
        </button>

        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="mb-8">
            <Banner
              type="success"
              message="Your pet submission has been received! Our team will review the information and contact you within 24 hours to discuss the next steps."
              onClose={() => setShowSuccessBanner(false)}
            />
          </div>
        )}

        {/* Add Pet Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-secondary-500 mx-auto mb-4" />
            <h1 className="font-heading font-bold text-3xl text-primary-800 mb-4">
              Add Pet for Adoption
            </h1>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Help us find a loving home for your pet. Please provide detailed information to help potential adopters understand your pet's needs and personality.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Pet Basic Information */}
            <div className="bg-primary-50 p-6 rounded-lg">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-6">Pet Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={petData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    placeholder="Enter pet's name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Species *
                  </label>
                  <select
                    name="species"
                    required
                    value={petData.species}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Breed *
                  </label>
                  <input
                    type="text"
                    name="breed"
                    required
                    value={petData.breed}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    placeholder="e.g., Golden Retriever, Persian Cat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="text"
                    name="age"
                    required
                    value={petData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    placeholder="e.g., 2 years, 6 months"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Size
                  </label>
                  <select
                    name="size"
                    value={petData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={petData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={petData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  placeholder="City, Area"
                />
              </div>
            </div>

            {/* Pet Photos */}
            <div className="bg-primary-50 p-6 rounded-lg">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-6">Pet Photos</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Upload Photos (Max 5 images, 5MB each)
                </label>
                <div className="border-2 border-dashed border-primary-300 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-primary-400 mx-auto mb-4" />
                  <p className="text-primary-600 mb-4">Click to upload or drag and drop</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors cursor-pointer inline-flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Images
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pet Details */}
            <div className="bg-primary-50 p-6 rounded-lg">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-6">Pet Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={petData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                    placeholder="Describe your pet's appearance, behavior, and what makes them special..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Personality & Temperament
                  </label>
                  <textarea
                    name="personality"
                    rows={3}
                    value={petData.personality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                    placeholder="Is your pet friendly, energetic, calm, good with children, etc.?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    name="medicalHistory"
                    rows={3}
                    value={petData.medicalHistory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                    placeholder="Vaccination status, any medical conditions, treatments, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Care Requirements
                  </label>
                  <textarea
                    name="requirements"
                    rows={3}
                    value={petData.requirements}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                    placeholder="Special care needs, exercise requirements, dietary restrictions, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Reason for Rehoming
                  </label>
                  <textarea
                    name="reason"
                    rows={3}
                    value={petData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                    placeholder="Please share why you need to rehome your pet (optional but helpful for potential adopters)"
                  />
                </div>
              </div>
            </div>

            {/* Health Status */}
            <div className="bg-primary-50 p-6 rounded-lg">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-6">Health Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="vaccinated"
                    id="vaccinated"
                    checked={petData.vaccinated}
                    onChange={handleChange}
                    className="w-5 h-5 text-secondary-500 border-primary-300 rounded focus:ring-secondary-500"
                  />
                  <label htmlFor="vaccinated" className="text-primary-700 font-medium">
                    Vaccinated
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="neutered"
                    id="neutered"
                    checked={petData.neutered}
                    onChange={handleChange}
                    className="w-5 h-5 text-secondary-500 border-primary-300 rounded focus:ring-secondary-500"
                  />
                  <label htmlFor="neutered" className="text-primary-700 font-medium">
                    Spayed/Neutered
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="urgent"
                    id="urgent"
                    checked={petData.urgent}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-500 border-primary-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="urgent" className="text-primary-700 font-medium">
                    Urgent Rehoming
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Adoption Fee (Optional)
                </label>
                <input
                  type="text"
                  name="adoptionFee"
                  value={petData.adoptionFee}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  placeholder="e.g., ₹2,000 or Free"
                />
                <p className="text-sm text-primary-500 mt-1">
                  Leave blank if no fee required. Fees help cover medical expenses.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-primary-50 p-6 rounded-lg">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    required
                    value={petData.contactName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    required
                    value={petData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    placeholder="+91 9484844090"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={petData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-secondary-500 text-white font-semibold px-12 py-4 rounded-lg hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Submit Pet for Adoption
              </button>
              <p className="text-sm text-primary-500 mt-4">
                Our team will review your submission and contact you within 24 hours.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPet;