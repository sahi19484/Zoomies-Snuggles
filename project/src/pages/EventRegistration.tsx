import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users, User, Mail, Phone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Banner from '../components/ui/Banner';

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendees: 1,
    dietaryRestrictions: '',
    emergencyContact: '',
    emergencyPhone: '',
    specialRequests: '',
    agreeToTerms: false
  });

  // Mock event data - in real app this would come from API based on eventId
  const event = {
    id: eventId,
    title: 'Pet Adoption Drive',
    date: '15',
    month: 'Dec',
    location: 'Rajkot Municipal Garden',
    time: '10:00 AM - 4:00 PM',
    description: 'Join us for our biggest adoption event of the year! Meet dozens of loving pets looking for their forever homes.',
    attendees: 45,
    organizer: 'Zoomies & Snuggles Team',
    requirements: [
      'Valid ID required for adoption applications',
      'Bring family members who will interact with the pet',
      'Comfortable clothing recommended',
      'Parking available on-site'
    ]
  };

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    } else {
      navigate('/auth');
      toast.error('Please sign in to register for events');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    try {
      // Save registration to localStorage
      const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
      const newRegistration = {
        id: Date.now(),
        eventTitle: event.title,
        eventDate: `${event.date} ${event.month}`,
        eventId: event.id,
        userId: currentUser?.email || 'anonymous',
        ...formData,
        registeredAt: new Date().toISOString(),
        status: 'confirmed'
      };
      
      registrations.push(newRegistration);
      localStorage.setItem('eventRegistrations', JSON.stringify(registrations));

      setShowSuccessBanner(true);
      toast.success(`Successfully registered for ${event.title}!`);
      
      // Scroll to top to show banner
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Reset form
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        attendees: 1,
        dietaryRestrictions: '',
        emergencyContact: '',
        emergencyPhone: '',
        specialRequests: '',
        agreeToTerms: false
      });
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
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
          onClick={() => navigate('/community')}
          className="flex items-center space-x-2 text-primary-600 hover:text-secondary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Community</span>
        </button>

        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="mb-8">
            <Banner
              type="success"
              message={`Your registration for ${event.title} has been confirmed! Check your email for event details and updates.`}
              onClose={() => setShowSuccessBanner(false)}
            />
          </div>
        )}

        {/* Event Registration Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white p-8">
            <h1 className="font-heading font-bold text-3xl mb-4">
              Event Registration
            </h1>
            <p className="text-secondary-100 text-lg">
              {event.title}
            </p>
          </div>

          {/* Event Details */}
          <div className="p-8 bg-primary-50 border-b border-primary-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-secondary-500" />
                <div>
                  <div className="font-semibold text-primary-800 text-lg">{event.date} {event.month}</div>
                  <div className="text-primary-600">Event Date</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-accent-500" />
                <div>
                  <div className="font-semibold text-primary-800 text-lg">{event.time}</div>
                  <div className="text-primary-600">Time</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-green-500" />
                <div>
                  <div className="font-semibold text-primary-800 text-lg">{event.location}</div>
                  <div className="text-primary-600">Location</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-purple-500" />
                <div>
                  <div className="font-semibold text-primary-800 text-lg">{event.attendees} registered</div>
                  <div className="text-primary-600">Current Attendees</div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-primary-700 leading-relaxed text-lg">{event.description}</p>
            </div>
            
            {/* Event Requirements */}
            <div className="mt-6">
              <h3 className="font-heading font-bold text-lg text-primary-800 mb-3">Event Requirements</h3>
              <ul className="space-y-2">
                {event.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-primary-600">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                      placeholder="+91 9484844090"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Number of Attendees *
                  </label>
                  <select
                    name="attendees"
                    required
                    value={formData.attendees}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  >
                    <option value={1}>1 Person</option>
                    <option value={2}>2 People</option>
                    <option value={3}>3 People</option>
                    <option value={4}>4 People</option>
                    <option value={5}>5+ People</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                Emergency Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    placeholder="+91 9484844090"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                Additional Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Dietary Restrictions or Allergies
                  </label>
                  <textarea
                    name="dietaryRestrictions"
                    rows={3}
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                    placeholder="Please list any dietary restrictions, allergies, or special requirements..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Special Requests or Comments
                  </label>
                  <textarea
                    name="specialRequests"
                    rows={3}
                    value={formData.specialRequests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 resize-none"
                    placeholder="Any special requests, accessibility needs, or additional comments..."
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-primary-50 p-6 rounded-lg">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-5 h-5 text-secondary-500 border-primary-300 rounded focus:ring-secondary-500 mt-1"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-primary-700 leading-relaxed">
                  I agree to the terms and conditions and understand that:
                  <ul className="mt-2 ml-4 list-disc text-xs text-primary-600">
                    <li>Registration is required for event attendance</li>
                    <li>Event details may change with prior notice</li>
                    <li>Cancellation policy applies as per event guidelines</li>
                    <li>Photography/videography may occur during the event</li>
                  </ul>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-secondary-500 text-white font-semibold py-4 rounded-lg hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Complete Registration
              </button>
              <button
                type="button"
                onClick={() => navigate('/community')}
                className="px-8 py-4 bg-primary-200 text-primary-700 font-semibold rounded-lg hover:bg-primary-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;