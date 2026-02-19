import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Heart, Plus } from 'lucide-react';
import toast from 'react-hot-toast';


interface Pet {
  id: string;
  name: string;
  breed: string;
  species: string;
  image?: string;
  description?: string;
  age?: string;
  size?: string;
  gender?: string;
  location?: string;
  urgent?: boolean;
  vaccinated?: boolean;
  neutered?: boolean;
}

// Mock pet data
const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    species: 'Dog',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    description: 'Friendly and energetic Golden Retriever who loves playing fetch and long walks.',
    age: '2 years',
    size: 'Large',
    gender: 'Male',
    location: 'Rajkot Central',
    urgent: false,
    vaccinated: true,
    neutered: true
  },
  {
    id: '2',
    name: 'Whiskers',
    breed: 'Persian Cat',
    species: 'Cat',
    image: 'https://images.pexels.com/photos/1543466/pexels-photo-1543466.jpeg',
    description: 'Calm and affectionate Persian cat who enjoys gentle handling.',
    age: '3 years',
    size: 'Small',
    gender: 'Female',
    location: 'University Road',
    urgent: false,
    vaccinated: true,
    neutered: true
  },
  {
    id: '3',
    name: 'Max',
    breed: 'Labrador',
    species: 'Dog',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
    description: 'Energetic and playful Lab looking for an active family.',
    age: '1.5 years',
    size: 'Large',
    gender: 'Male',
    location: 'Morbi Road',
    urgent: true,
    vaccinated: true,
    neutered: false
  },
  {
    id: '4',
    name: 'Mittens',
    breed: 'Siamese Cat',
    species: 'Cat',
    image: 'https://images.pexels.com/photos/983409/pexels-photo-983409.jpeg',
    description: 'Vocal and social Siamese cat who loves attention.',
    age: '2 years',
    size: 'Small',
    gender: 'Female',
    location: 'Kalawad Road',
    urgent: false,
    vaccinated: true,
    neutered: true
  },
  {
    id: '5',
    name: 'Charlie',
    breed: 'Beagle',
    species: 'Dog',
    image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
    description: 'Curious and friendly Beagle puppy with lots of energy.',
    age: '6 months',
    size: 'Small',
    gender: 'Male',
    location: '150 Feet Ring Road',
    urgent: false,
    vaccinated: true,
    neutered: false
  }
];

const Adoption = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState({
    species: '',
    age: '',
    size: '',
    gender: '',
    location: ''
  });
  const [pets, setPets] = useState<Pet[]>([]);

  const fetchPets = useCallback(async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setPets(MOCK_PETS);
    } catch (err: any) {
      console.error('Failed to load pets:', err);
      toast.error('Unable to load pets. Please try again later.');
    }
  }, []);

  useEffect(() => { fetchPets(); }, [fetchPets]);


  const filteredPets = pets.filter(pet => {
    const matchesSearch = (pet.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (pet.breed ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = !selectedFilters.species || pet.species === selectedFilters.species;
    const matchesAge = !selectedFilters.age || (pet.age ?? '').includes(selectedFilters.age);
    const matchesSize = !selectedFilters.size || pet.size === selectedFilters.size;
    const matchesGender = !selectedFilters.gender || pet.gender === selectedFilters.gender;
    const matchesLocation = !selectedFilters.location || (pet.location ?? '').includes(selectedFilters.location);

    return matchesSearch && matchesSpecies && matchesAge && matchesSize && matchesGender && matchesLocation;
  });

  const handleAdoptPet = (petId: string, petName: string) => {
    navigate(`/adoption/${petId}`);
    toast.success(`Viewing details for ${petName}`);
  };

  const handleLearnMore = (petId: string, petName: string) => {
    navigate(`/adoption/${petId}`);
    toast.success(`Loading detailed information about ${petName}`);
  };

  const handleFavorite = (petName: string) => {
    toast.success(`${petName} added to your favorites!`);
  };

  const handleAddPet = () => {
    navigate('/adoption/add');
    toast.success('Redirecting to add pet form');
  };

  const handleContactTeam = () => {
    navigate('/contact');
    toast.success('Redirecting to contact our adoption team');
  };

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
            Find Your Perfect Companion
          </h1>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Browse through our loving pets waiting for their forever homes in Rajkot, Gujarat.
          </p>
        </div>

        {/* Add Pet Button */}
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <button
            onClick={handleAddPet}
            className="inline-flex items-center bg-secondary-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Pet for Adoption
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
              <input
                type="text"
                placeholder="Search by name or breed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
              />
            </div>

            {/* Filters */}
            <select
              value={selectedFilters.species}
              onChange={(e) => setSelectedFilters({...selectedFilters, species: e.target.value})}
              className="px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
            >
              <option value="">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
            </select>

            <select
              value={selectedFilters.size}
              onChange={(e) => setSelectedFilters({...selectedFilters, size: e.target.value})}
              className="px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
            >
              <option value="">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>

            <select
              value={selectedFilters.gender}
              onChange={(e) => setSelectedFilters({...selectedFilters, gender: e.target.value})}
              className="px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              value={selectedFilters.location}
              onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
              className="px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
            >
              <option value="">All Locations</option>
              <option value="Central">Rajkot Central</option>
              <option value="University">University Road</option>
              <option value="Morbi">Morbi Road</option>
              <option value="Kalawad">Kalawad Road</option>
              <option value="Ring Road">150 Feet Ring Road</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-primary-600">
              Showing {filteredPets.length} of {pets.length} pets
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilters({
                  species: '',
                  age: '',
                  size: '',
                  gender: '',
                  location: ''
                });
              }}
              className="text-secondary-500 hover:text-secondary-600 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Pet Image */}
              <div className="relative">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-64 object-cover"
                />
                {pet.urgent && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Urgent
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-800">
                  {pet.species}
                </div>
                <button 
                  onClick={() => handleFavorite(pet.name)}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Heart className="h-5 w-5 text-red-500" />
                </button>
              </div>

              {/* Pet Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-xl text-primary-800">
                    {pet.name}
                  </h3>
                  <span className="text-sm text-primary-600 bg-primary-100 px-2 py-1 rounded">
                    {pet.breed}
                  </span>
                </div>

                <p className="text-primary-600 mb-4 leading-relaxed text-sm">
                  {pet.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-600">Age:</span>
                    <span className="font-medium text-primary-800">{pet.age}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-600">Size:</span>
                    <span className="font-medium text-primary-800">{pet.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-600">Gender:</span>
                    <span className="font-medium text-primary-800">{pet.gender}</span>
                  </div>
                  <div className="flex items-center text-sm text-primary-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {pet.location}
                  </div>
                </div>

                {/* Health Status */}
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`text-xs px-2 py-1 rounded ${pet.vaccinated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {pet.vaccinated ? '✓ Vaccinated' : 'Vaccination Pending'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${pet.neutered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {pet.neutered ? '✓ Neutered' : 'Not Neutered'}
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleAdoptPet(pet.id, pet.name)}
                    className="w-full bg-secondary-500 text-white font-semibold py-3 rounded-lg hover:bg-secondary-600 transition-colors duration-200"
                  >
                    Adopt {pet.name}
                  </button>
                  <button 
                    onClick={() => handleLearnMore(pet.id, pet.name)}
                    className="w-full bg-primary-100 text-primary-700 font-semibold py-2 rounded-lg hover:bg-primary-200 transition-colors duration-200"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="font-heading font-bold text-xl text-primary-800 mb-2">
              No pets found
            </h3>
            <p className="text-primary-600 mb-4">
              Try adjusting your search criteria or check back later for new arrivals.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilters({
                  species: '',
                  age: '',
                  size: '',
                  gender: '',
                  location: ''
                });
              }}
              className="bg-secondary-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Contact Team Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleContactTeam}
            className="inline-flex items-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Heart className="h-5 w-5 mr-2" />
            Contact Our Adoption Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Adoption;
