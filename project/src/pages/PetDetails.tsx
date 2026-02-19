import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Calendar, User, Phone, Mail, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Banner from '../components/ui/Banner';

const PetDetails = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Mock pet data - in real app this would come from API
  const pet = {
    id: petId,
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    size: 'Large',
    gender: 'Male',
    location: 'Rajkot Central',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    description: 'Buddy is a friendly and energetic Golden Retriever who loves playing fetch and long walks. He\'s great with children and other pets, making him the perfect family companion. Buddy has been with us for 3 months and is fully vaccinated and neutered.',
    vaccinated: true,
    neutered: true,
    urgent: false,
    medicalHistory: 'Fully vaccinated, dewormed, and health checked. No known medical issues.',
    personality: 'Friendly, energetic, loyal, good with children, loves to play fetch',
    requirements: 'Needs daily exercise, prefers homes with yards, good with other pets',
    adoptionFee: '₹2,000',
    contactPerson: 'Priya Sharma',
    contactPhone: '+91 9484844090',
    contactEmail: 'priya@zoomiessnuggles.org'
  };

  const handleAdopt = () => {
    setShowSuccessBanner(true);
    toast.success(`Adoption application submitted for ${pet.name}!`);

    // Scroll to top to show banner
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavorite = () => {
    toast.success(`${pet.name} added to your favorites!`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Meet ${pet.name}`,
        text: `Check out this adorable ${pet.breed} looking for a home!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleContact = (method: string) => {
    if (method === 'phone') {
      window.open(`tel:${pet.contactPhone}`);
    } else if (method === 'email') {
      window.open(`mailto:${pet.contactEmail}?subject=Inquiry about ${pet.name}`);
    }
  };

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
              message={`Your adoption application for ${pet.name} has been submitted! Our team will contact you within 24 hours to discuss next steps.`}
              onClose={() => setShowSuccessBanner(false)}
            />
          </div>
        )}

        {/* Pet Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Pet Image */}
            <div className="relative">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-96 lg:h-full object-cover"
              />
              {pet.urgent && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Urgent
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-800">
                {pet.species}
              </div>
            </div>

            {/* Pet Information */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="font-heading font-bold text-3xl text-primary-800 mb-2">
                    {pet.name}
                  </h1>
                  <p className="text-lg text-secondary-600 font-medium">{pet.breed}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleFavorite}
                    className="p-2 bg-primary-100 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Heart className="h-5 w-5 text-red-500" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-primary-100 hover:bg-blue-100 rounded-full transition-colors"
                  >
                    <Share2 className="h-5 w-5 text-blue-500" />
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="text-sm text-primary-600 mb-1">Age</div>
                  <div className="font-semibold text-primary-800">{pet.age}</div>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="text-sm text-primary-600 mb-1">Size</div>
                  <div className="font-semibold text-primary-800">{pet.size}</div>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="text-sm text-primary-600 mb-1">Gender</div>
                  <div className="font-semibold text-primary-800">{pet.gender}</div>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="text-sm text-primary-600 mb-1">Adoption Fee</div>
                  <div className="font-semibold text-primary-800">{pet.adoptionFee}</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="h-5 w-5 text-primary-500" />
                <span className="text-primary-700">{pet.location}</span>
              </div>

              {/* Health Status */}
              <div className="flex space-x-4 mb-6">
                <span className={`text-xs px-3 py-1 rounded-full ${pet.vaccinated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {pet.vaccinated ? '✓ Vaccinated' : 'Vaccination Pending'}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full ${pet.neutered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {pet.neutered ? '✓ Neutered' : 'Not Neutered'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAdopt}
                  className="w-full bg-secondary-500 text-white font-semibold py-4 rounded-lg hover:bg-secondary-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Adopt {pet.name}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleContact('phone')}
                    className="flex items-center justify-center space-x-2 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => handleContact('email')}
                    className="flex items-center justify-center space-x-2 bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="p-8 border-t border-primary-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">About {pet.name}</h2>
                <p className="text-primary-600 leading-relaxed mb-6">{pet.description}</p>

                <h3 className="font-semibold text-lg text-primary-800 mb-3">Personality</h3>
                <p className="text-primary-600 mb-6">{pet.personality}</p>

                <h3 className="font-semibold text-lg text-primary-800 mb-3">Care Requirements</h3>
                <p className="text-primary-600">{pet.requirements}</p>
              </div>

              <div>
                <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">Medical History</h2>
                <p className="text-primary-600 mb-6">{pet.medicalHistory}</p>

                <h3 className="font-semibold text-lg text-primary-800 mb-3">Contact Information</h3>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="h-5 w-5 text-primary-500" />
                    <span className="text-primary-800 font-medium">{pet.contactPerson}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <Phone className="h-5 w-5 text-primary-500" />
                    <a href={`tel:${pet.contactPhone}`} className="text-primary-700 hover:text-secondary-600">
                      {pet.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-500" />
                    <a href="mailto:zoomiesnsnuggles@gmail.com" className="text-primary-700 hover:text-secondary-600">
                      zoomiesnsnuggles@gmail.com
                    </a>
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

export default PetDetails;
