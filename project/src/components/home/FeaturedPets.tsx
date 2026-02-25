import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FeaturedPets = () => {
  const navigate = useNavigate();

  const featuredPets = [
    {
      id: 1,
      name: 'Buddy',
      type: 'Golden Retriever',
      age: '2 years',
      location: 'Rajkot Central',
      image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
      description: 'Friendly and energetic, loves playing fetch and long walks.',
      urgent: false
    },
    {
      id: 2,
      name: 'Luna',
      type: 'Persian Cat',
      age: '1 year',
      location: 'University Road',
      image: 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg',
      description: 'Gentle and affectionate, perfect for quiet homes.',
      urgent: true
    },
    {
      id: 3,
      name: 'Max',
      type: 'German Shepherd',
      age: '3 years',
      location: 'Morbi Road',
      image: 'https://images.pexels.com/photos/1346086/pexels-photo-1346086.jpeg',
      description: 'Loyal and protective, great with children and families.',
      urgent: false
    }
  ];

  const handleLearnMore = (petId: number, petName: string) => {
    navigate(`/adoption/${petId}`);
    toast.success(`Loading detailed information about ${petName}`);
  };

  return (
    <section className="bg-primary-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
            Meet Our Featured Friends
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            These special pets are looking for their forever homes. Each one has been 
            health-checked and is ready to bring joy to your family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPets.map((pet) => (
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
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-800">
                  {pet.type}
                </div>
              </div>

              {/* Pet Info */}
              <div className="p-6">
                <h3 className="font-heading font-bold text-xl text-primary-800 mb-2">
                  {pet.name}
                </h3>
                <p className="text-primary-600 mb-4 leading-relaxed">
                  {pet.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-primary-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {pet.age}
                  </div>
                  <div className="flex items-center text-sm text-primary-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {pet.location}
                  </div>
                </div>

                <button 
                  onClick={() => handleLearnMore(pet.id, pet.name)}
                  className="w-full bg-secondary-500 text-white font-semibold py-3 rounded-lg hover:bg-secondary-600 transition-colors duration-200 flex items-center justify-center"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/adoption"
            className="inline-flex items-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View All Available Pets
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPets;