import React, { useState } from 'react';
import { Heart, Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';

function SeedData() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  // --- DATA TO BE SEEDED ---

  // 1. Users
  const users = [
    { name: 'Priya Patel', email: 'priya.patel@example.com', userType: 'Adopter', joinDate: '2023-10-15T00:00:00Z', profilePic: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg' },
    { name: 'Arjun Shah', email: 'arjun.shah@example.com', userType: 'Foster Parent', joinDate: '2023-09-22T00:00:00Z', profilePic: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
    { name: 'Meera Joshi', email: 'meera.joshi@example.com', userType: 'Volunteer', joinDate: '2024-01-05T00:00:00Z', profilePic: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' }
  ];

  // 2. Pets
  const pets = [
    { name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', age: 2, gender: 'Male', size: 'Large', location: 'Rajkot', status: 'Available', photos: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'], medicalHistory: ['Vaccinated', 'Neutered'], personality: ['Friendly', 'Active'], description: 'Buddy is a happy and energetic Golden Retriever looking for a loving home.' },
    { name: 'Whiskers', species: 'Cat', breed: 'Siamese', age: 1, gender: 'Female', size: 'Medium', location: 'Rajkot', status: 'Fostered', photos: ['https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg'], medicalHistory: ['Vaccinated', 'Spayed'], personality: ['Playful', 'Affectionate'], description: 'Whiskers is a curious and loving Siamese cat.' },
    { name: 'Rocky', species: 'Dog', breed: 'German Shepherd', age: 3, gender: 'Male', size: 'Large', location: 'Rajkot', status: 'Available', photos: ['https://images.pexels.com/photos/33053/dog-young-dog-small-dog-maltese.jpg'], medicalHistory: ['Vaccinated'], personality: ['Loyal', 'Intelligent'], description: 'Rocky is a brave and smart German Shepherd.' }
  ];

  // 3. Adoption Applications
  const adoptionApplications = [
    { userId: 'priya.patel@example.com', petId: 'Buddy', applicationDate: '2024-02-01T00:00:00Z', status: 'Pending', notes: 'Has a large yard and experience with dogs.' }
  ];

  // 4. Foster Applications
  const fosterApplications = [
    { userId: 'arjun.shah@example.com', applicationDate: '2023-11-10T00:00:00Z', fosterType: 'Medical', status: 'Approved', experience: 'Fostered 3 dogs previously.' }
  ];

  // 5. Forum Categories
  const forumCategories = [
    { icon: 'MessageCircle', title: 'General Discussion', description: 'Share experiences and connect with other pet parents', posts: 342, lastActivity: '2 minutes ago' },
    { icon: 'Award', title: 'Success Stories', description: 'Celebrate adoption and foster success stories', posts: 128, lastActivity: '1 hour ago' },
    { icon: 'Users', title: 'Foster Parents', description: 'Support and advice for foster families', posts: 89, lastActivity: '3 hours ago' },
    { icon: 'TrendingUp', title: 'Training Tips', description: 'Pet training advice and behavioral guidance', posts: 156, lastActivity: '30 minutes ago' }
  ];

  // 6. Upcoming Events
  const upcomingEvents = [
    { date: '15', month: 'Dec', title: 'Pet Adoption Drive', location: 'Rajkot Municipal Garden', time: '10:00 AM - 4:00 PM', attendees: 45 },
    { date: '22', month: 'Dec', title: 'Foster Family Meet & Greet', location: 'Community Center, University Road', time: '5:00 PM - 7:00 PM', attendees: 23 },
  ];

  // 7. Community Posts
  const communityPosts = [
    { author: 'Priya Patel', avatar: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg', title: 'Tips for first-time dog owners in Rajkot?', content: 'I just adopted my first dog and would love some advice from experienced pet parents in our community. What are the essential things I should know?', category: 'General Discussion', replies: 12, likes: 24, timeAgo: '2 hours ago', image: null },
    { author: 'Arjun Shah', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', title: 'My rescue cat Whiskers found her forever home! 🎉', content: 'After 3 months of fostering, Whiskers has been adopted by the most wonderful family. Seeing her happy and settled brings so much joy to my heart!', category: 'Success Stories', replies: 8, likes: 45, timeAgo: '4 hours ago', image: 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg' }
  ];

  // 8. Resource Categories
  const resourceCategories = [
    { id: 'pet-care', name: 'Pet Care', icon: 'Heart' },
    { id: 'health', name: 'Health & Medical', icon: 'Stethoscope' },
    { id: 'training', name: 'Training & Behavior', icon: 'GraduationCap' },
    { id: 'safety', name: 'Safety & Emergency', icon: 'Shield' }
  ];

  // 9. Resources
  const resources = [
    { slug: 'new-pet-owner-guide', title: 'New Pet Owner Guide', description: 'Complete guide for first-time pet owners covering basics of pet care, feeding, and bonding.', category: 'pet-care', type: 'Guide', format: 'PDF', icon: 'Eye', featured: true },
    { slug: 'pet-vaccination-schedule', title: 'Pet Vaccination Schedule', description: 'Essential vaccination timeline for dogs and cats in India with local veterinary recommendations.', category: 'health', type: 'Chart', format: 'PDF', icon: 'Eye', featured: true },
    { slug: 'pet-emergency-first-aid', title: 'Pet Emergency First Aid', description: 'Critical first aid steps for common pet emergencies. Essential knowledge for every pet owner.', category: 'safety', type: 'Emergency Guide', format: 'PDF', icon: 'Eye', featured: true },
    { slug: 'cat-behavior-understanding', title: 'Cat Behavior Understanding', description: 'Comprehensive guide to understanding cat body language, sounds, and behavioral patterns.', category: 'training', type: 'Guide', format: 'PDF', icon: 'Eye', featured: false },
  ];

  // 10. Emergency Contacts
  const emergencyContacts = [
    { name: 'Pet Emergency Hospital', phone: '+91 9484844090', address: 'University Road, Rajkot', hours: '24/7', type: 'Emergency' },
    { name: 'Rajkot Veterinary Clinic', phone: '+91 98765 22222', address: 'Kalawad Road, Rajkot', hours: '9 AM - 8 PM', type: 'General Care' },
    { name: 'Animal Poison Control', phone: '+91 9484844090', address: 'Hotline Service', hours: '24/7', type: 'Poison Control' }
  ];

  // 11. Resource Contents
  const resourceContents = [
    {
      slug: 'new-pet-owner-guide',
      htmlContent: '<div style="max-width: 800px; margin: 0 auto; padding: 40px;"><h1>New Pet Owner Guide</h1><p>Welcome to pet ownership! This comprehensive guide will help you get started.</p></div>'
    },
    {
      slug: 'pet-emergency-first-aid',
      htmlContent: '<div style="max-width: 800px; margin: 0 auto; padding: 40px;"><h1>Pet Emergency First Aid</h1><p>Essential emergency procedures for pet owners.</p></div>'
    },
    {
      slug: 'cat-behavior-understanding',
      htmlContent: '<div style="max-width: 800px; margin: 0 auto; padding: 40px;"><h1>Understanding Cat Behavior</h1><p>Learn to read your cat\'s body language and behavior.</p></div>'
    },
    {
      slug: 'pet-vaccination-schedule',
      htmlContent: '<div style="max-width: 800px; margin: 0 auto; padding: 40px;"><h1>Pet Vaccination Schedule</h1><p>Keep your pet healthy with this vaccination timeline.</p></div>'
    }
  ];

  const seedCollection = async (batch, collectionName, data) => {
    const collectionRef = collection(db, collectionName);
    data.forEach(item => {
      const docRef = doc(collectionRef);
      batch.set(docRef, item);
    });
  };

  const handleSeedData = async () => {
    setStatus('loading');
    setMessage('Initializing database seeding...');
    setProgress(0);

    try {
      const batch = writeBatch(db);
      const collections = [
        { name: 'users', data: users },
        { name: 'pets', data: pets },
        { name: 'adoptionApplications', data: adoptionApplications },
        { name: 'fosterApplications', data: fosterApplications },
        { name: 'forumCategories', data: forumCategories },
        { name: 'upcomingEvents', data: upcomingEvents },
        { name: 'communityPosts', data: communityPosts },
        { name: 'resourceCategories', data: resourceCategories },
        { name: 'resources', data: resources },
        { name: 'emergencyContacts', data: emergencyContacts },
        { name: 'resourceContents', data: resourceContents }
      ];

      // Seed each collection
      for (let i = 0; i < collections.length; i++) {
        const { name, data } = collections[i];
        setMessage(`Seeding ${name}...`);
        await seedCollection(batch, name, data);
        setProgress(((i + 1) / collections.length) * 100);
      }

      setMessage('Committing changes to database...');
      await batch.commit();

      setStatus('success');
      setMessage('Database seeded successfully! All data has been added.');
      setProgress(100);
    } catch (error) {
      console.error('Error seeding database:', error);
      setStatus('error');
      setMessage(`Error seeding database: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Database className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seed Database</h1>
            <p className="text-gray-600">
              Initialize your database with sample data for testing and development
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900 mb-1">
                  Warning: Development Tool
                </h3>
                <p className="text-sm text-amber-800">
                  This tool will add sample data to your database. Only use this in development environments.
                  Do not use in production.
                </p>
              </div>
            </div>
          </div>

          {/* Data Overview */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data to be seeded:</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Users', count: 3 },
                { label: 'Pets', count: 3 },
                { label: 'Applications', count: 2 },
                { label: 'Forum Posts', count: 2 },
                { label: 'Events', count: 2 },
                { label: 'Resources', count: 4 },
                { label: 'Categories', count: 4 },
                { label: 'Emergency Contacts', count: 3 },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary-600">{item.count}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          {status === 'loading' && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {status !== 'idle' && (
            <div
              className={`rounded-lg p-4 mb-6 ${
                status === 'loading'
                  ? 'bg-blue-50 border border-blue-200'
                  : status === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center">
                {status === 'loading' && (
                  <Loader className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                )}
                {status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                )}
                {status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                )}
                <p
                  className={`text-sm font-medium ${
                    status === 'loading'
                      ? 'text-blue-900'
                      : status === 'success'
                      ? 'text-green-900'
                      : 'text-red-900'
                  }`}
                >
                  {message}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleSeedData}
            disabled={status === 'loading'}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              status === 'loading'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
            }`}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center">
                <Loader className="w-5 h-5 animate-spin mr-2" />
                Seeding Database...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />
                Seed Database
              </span>
            )}
          </button>

          {/* Note */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Note: This feature is for development purposes only. Make sure you're connected to a development database.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SeedData;