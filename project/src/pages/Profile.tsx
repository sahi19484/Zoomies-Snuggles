import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Heart, Users, Award, Settings, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Banner from '../components/ui/Banner';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showBanner, setShowBanner] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setEditData(user);
    } else {
      navigate('/auth');
    }

    // Load user's event registrations
    const userRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]')
      .filter(reg => reg.userId === JSON.parse(localStorage.getItem('currentUser') || '{}').email);
    setRegistrations(userRegistrations);
  }, [navigate]);

  const handleSaveProfile = () => {
    localStorage.setItem('currentUser', JSON.stringify(editData));
    setCurrentUser(editData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditData(currentUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success('You have been successfully logged out');
    navigate('/');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userStats = [
    { icon: Heart, label: 'Pets Adopted', value: currentUser.userType === 'adopter' ? '1' : '0', color: 'text-red-500' },
    { icon: Users, label: 'Pets Fostered', value: currentUser.userType === 'foster' ? '3' : '0', color: 'text-blue-500' },
    { icon: Calendar, label: 'Events Registered', value: registrations.length.toString(), color: 'text-green-500' },
    { icon: Award, label: 'Community Points', value: '150', color: 'text-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        {showBanner && (
          <div className="mb-8">
            <Banner
              type="success"
              message={`Welcome back, ${currentUser.name}! Your profile is ${currentUser.isDemo ? 'demo' : 'active'} and ready to use.`}
              onClose={() => setShowBanner(false)}
            />
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-secondary-200 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-secondary-600">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="font-heading font-bold text-3xl text-primary-800 mb-2">
                  {currentUser.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {currentUser.userType}
                  </span>
                  {currentUser.isDemo && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      Demo Account
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-primary-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    />
                  ) : (
                    <span className="text-primary-800">{currentUser.email}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-primary-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone || ''}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                      placeholder="+91 98765 43210"
                    />
                  ) : (
                    <span className="text-primary-800">{currentUser.phone || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-primary-700 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location || ''}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                      placeholder="Rajkot, Gujarat"
                    />
                  ) : (
                    <span className="text-primary-800">{currentUser.location || 'Rajkot, Gujarat'}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-primary-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-primary-700 mb-1">Account Type</label>
                  <span className="text-primary-800 capitalize">{currentUser.userType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="font-bold text-2xl text-primary-800 mb-1">{stat.value}</div>
                <div className="text-sm text-primary-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Recent Event Registrations */}
        {registrations.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Your Event Registrations
            </h2>
            <div className="space-y-4">
              {registrations.slice(0, 3).map((registration) => (
                <div key={registration.id} className="border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-primary-800">{registration.eventTitle}</h3>
                      <p className="text-sm text-primary-600">
                        {registration.eventDate} • {registration.attendees} attendee(s)
                      </p>
                      <p className="text-xs text-primary-500">
                        Registered on {new Date(registration.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {registration.status || 'Confirmed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {registrations.length > 3 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/community')}
                  className="text-secondary-500 hover:text-secondary-600 font-medium"
                >
                  View All Registrations ({registrations.length})
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="font-heading font-bold text-xl text-primary-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/adoption')}
              className="flex items-center justify-center space-x-3 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 p-4 rounded-lg transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span>Browse Pets</span>
            </button>
            <button
              onClick={() => navigate('/foster')}
              className="flex items-center justify-center space-x-3 bg-accent-50 hover:bg-accent-100 text-accent-700 p-4 rounded-lg transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Foster Program</span>
            </button>
            <button
              onClick={() => navigate('/community')}
              className="flex items-center justify-center space-x-3 bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition-colors"
            >
              <Award className="h-5 w-5" />
              <span>Community</span>
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="font-heading font-bold text-xl text-primary-800 mb-6 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Account Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-primary-200">
              <div>
                <h3 className="font-medium text-primary-800">Email Notifications</h3>
                <p className="text-sm text-primary-600">Receive updates about pets and events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-primary-200">
              <div>
                <h3 className="font-medium text-primary-800">SMS Notifications</h3>
                <p className="text-sm text-primary-600">Get text updates for urgent matters</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-500"></div>
              </label>
            </div>
            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={confirmLogout}
          title="Sign Out"
          message="Are you sure you want to sign out of your account? You'll need to sign in again to access your profile and account features."
          type="warning"
          confirmText="Sign Out"
          cancelText="Stay Signed In"
        />
      </div>
    </div>
  );
};

export default Profile;