import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Video, Eye, Search, Heart, Shield, Stethoscope, GraduationCap, Phone, MapPin, ExternalLink, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, limit } from 'firebase/firestore';

const Resources = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  useEffect(() => {
    const seedAndFetchData = async () => {
      await seedAndFetchCategories();
      await seedAndFetchResources();
      await seedAndFetchEmergencyContacts();
    };

    seedAndFetchData();
  }, []);

  const seedAndFetchCategories = async () => {
    const categoriesCollection = collection(db, 'resourceCategories');
    const snapshot = await getDocs(query(categoriesCollection, limit(1)));
    if (snapshot.empty) {
      const defaultCategories = [
        { id: '', name: 'All Resources', icon: 'Book' },
        { id: 'pet-care', name: 'Pet Care', icon: 'Heart' },
        { id: 'health', name: 'Health & Medical', icon: 'Stethoscope' },
        { id: 'training', name: 'Training & Behavior', icon: 'GraduationCap' },
        { id: 'safety', name: 'Safety & Emergency', icon: 'Shield' }
      ];
      for (const category of defaultCategories) {
        await addDoc(categoriesCollection, category);
      }
    }
    const categoriesSnapshot = await getDocs(categoriesCollection);
    const categoriesList = categoriesSnapshot.docs.map(doc => doc.data());
    // The 'All Resources' category is handled locally, not in the DB
    setCategories(categoriesList.filter(c => c.id)); 
  };

  const seedAndFetchResources = async () => {
    const resourcesCollection = collection(db, 'resources');
    const snapshot = await getDocs(query(resourcesCollection, limit(1)));
    if (snapshot.empty) {
      const defaultResources = [
        { id: 1, title: 'New Pet Owner Guide', slug: 'new-pet-owner-guide', description: 'Complete guide for first-time pet owners covering basics of pet care, feeding, and bonding.', category: 'pet-care', type: 'Guide', format: 'PDF', icon: 'Eye', featured: true },
        { id: 2, title: 'Pet Vaccination Schedule', slug: 'pet-vaccination-schedule', description: 'Essential vaccination timeline for dogs and cats in India.', category: 'health', type: 'Chart', format: 'PDF', icon: 'Eye', featured: true },
        { id: 3, title: 'Basic Dog Training Techniques', slug: 'basic-dog-training', description: 'Video series covering fundamental training commands.', category: 'training', type: 'Video Series', format: 'Video', icon: 'Play', youtubeUrl: 'https://youtu.be/FWCnvgMCDcU?si=lVQWZoJYdTinY3hi', thumbnail: 'https://i.ytimg.com/vi/FWCnvgMCDcU/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDVRwBh5jMebZUX2VI5Er6qg7LJRw', featured: false },
        { id: 4, title: 'Pet Emergency First Aid', slug: 'pet-emergency-first-aid', description: 'Critical first aid steps for common pet emergencies.', category: 'safety', type: 'Emergency Guide', format: 'PDF', icon: 'Eye', featured: true },
        { id: 5, title: 'Cat Behavior Understanding', slug: 'cat-behavior-understanding', description: 'Comprehensive guide to understanding cat body language and sounds.', category: 'training', type: 'Guide', format: 'PDF', icon: 'Eye', featured: false },
        { id: 6, title: 'Pet-Proofing Your Home', slug: 'pet-proofing-your-home', description: 'Safety checklist and tips to make your home safe for new pets.', category: 'safety', type: 'Checklist', format: 'PDF', icon: 'Eye', featured: false },
      ];
      for (const resource of defaultResources) {
        const { id, ...resourceData } = resource;
        await addDoc(resourcesCollection, resourceData);
      }
    }
    const resourcesSnapshot = await getDocs(resourcesCollection);
    const resourcesList = resourcesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setResources(resourcesList);
  };

  const seedAndFetchEmergencyContacts = async () => {
    const contactsCollection = collection(db, 'emergencyContacts');
    const snapshot = await getDocs(query(contactsCollection, limit(1)));
    if (snapshot.empty) {
      const defaultContacts = [
        { name: 'Pet Emergency Hospital', phone: '+91 9484844090', address: 'University Road, Rajkot', hours: '24/7', type: 'Emergency' },
        { name: 'Rajkot Veterinary Clinic', phone: '+91 98765 22222', address: 'Kalawad Road, Rajkot', hours: '9 AM - 8 PM', type: 'General Care' },
        { name: 'Animal Poison Control', phone: '+91 9484844090', address: 'Hotline Service', hours: '24/7', type: 'Poison Control' }
      ];
      for (const contact of defaultContacts) {
        await addDoc(contactsCollection, contact);
      }
    }
    const contactsSnapshot = await getDocs(contactsCollection);
    const contactsList = contactsSnapshot.docs.map(doc => doc.data());
    setEmergencyContacts(contactsList);
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Book': return Book;
      case 'Heart': return Heart;
      case 'Stethoscope': return Stethoscope;
      case 'GraduationCap': return GraduationCap;
      case 'Shield': return Shield;
      case 'Eye': return Eye;
      case 'Play': return Play;
      default: return Book;
    }
  };

  const allCategories = [{ id: '', name: 'All Resources', icon: 'Book' }, ...categories];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredResources = resources.filter(resource => resource.featured);

  const handleViewDocument = (resource) => {
    if (resource.format === 'Video') {
      window.open(resource.youtubeUrl, '_blank');
      toast.success(`Opening ${resource.title} on YouTube`);
    } else {
      navigate(`/pdf-viewer/${resource.slug}`);
      toast.success(`Opening ${resource.title}`);
    }
  };

  // ... other handlers like handleSubscribe, handleEmergencyCall, etc. remain the same

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-500 to-secondary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">
              Pet Care Resources
            </h1>
            <p className="text-xl text-accent-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Access our comprehensive library of guides, videos, and tools to help you provide 
              the best care for your furry family members in Rajkot.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto">
                {allCategories.map((category) => {
                  const IconComponent = getIconComponent(category.icon);
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-secondary-500 text-white'
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Resources */}
            {!searchQuery && !selectedCategory && (
              <div>
                <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                  Featured Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {featuredResources.map((resource) => {
                    const IconComponent = getIconComponent(resource.icon);
                    return (
                      <div
                        key={resource.id}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-secondary-200"
                      >
                        {/* ... content for featured resources ... */}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Resources */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                {searchQuery || selectedCategory ? 'Search Results' : 'All Resources'}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {filteredResources.map((resource) => {
                  const IconComponent = getIconComponent(resource.icon);
                  return (
                    <div
                      key={resource.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200"
                    >
                       {/* ... content for all resources ... */}
                    </div>
                  );
                })}
              </div>

              {filteredResources.length === 0 && (
                 <div className="text-center py-12">
                   {/* ... no results content ... */}
                 </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-6 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-red-500" />
                Emergency Contacts
              </h2>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="border border-primary-200 rounded-lg p-4">
                     {/* ... emergency contact content ... */}
                  </div>
                ))}
              </div>
            </div>

            {/* ... Other sidebar sections ... */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
