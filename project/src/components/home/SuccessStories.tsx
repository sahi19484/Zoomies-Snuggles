import React from 'react';
import { Heart, Quote } from 'lucide-react';

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      petName: 'Charlie',
      petImage: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
      ownerName: 'Priya Patel',
      ownerImage: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg',
      story: 'Charlie has brought so much joy to our family. He\'s gentle with our children and has become the perfect companion. The adoption process was smooth and the team was incredibly supportive.',
      location: 'Rajkot',
      adoptionDate: '3 months ago'
    },
    {
      id: 2,
      petName: 'Whiskers',
      petImage: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
      ownerName: 'Arjun Shah',
      ownerImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      story: 'Whiskers was shy at first, but with patience and love, she\'s become the most affectionate cat. She follows me everywhere and purrs constantly. Best decision I\'ve ever made!',
      location: 'Rajkot',
      adoptionDate: '6 months ago'
    },
    {
      id: 3,
      petName: 'Rocky',
      petImage: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg',
      ownerName: 'Meera Joshi',
      ownerImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      story: 'Rocky was a rescue from the streets, and now he\'s living his best life. He\'s protective, loving, and has learned so many tricks. Every day with him is a blessing.',
      location: 'Rajkot',
      adoptionDate: '1 year ago'
    }
  ];

  const handleShareStory = () => {
    alert('We\'d love to hear your success story! Please create an account to share how adoption or fostering has impacted your life.');
  };

  const handleStartAdopting = () => {
    window.location.href = '/adoption';
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-red-500 fill-current" />
            <span className="text-secondary-500 font-semibold">Success Stories</span>
          </div>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
            Happy Endings in Rajkot
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Nothing makes us happier than seeing our rescued pets thrive in their new homes. 
            Here are some heartwarming stories from our community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-primary-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-secondary-400 mb-4" />

              {/* Story Text */}
              <blockquote className="text-primary-700 leading-relaxed mb-6 italic">
                "{story.story}"
              </blockquote>

              {/* Pet & Owner Info */}
              <div className="space-y-4">
                {/* Pet */}
                <div className="flex items-center space-x-3">
                  <img
                    src={story.petImage}
                    alt={story.petName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-primary-800">{story.petName}</div>
                    <div className="text-sm text-primary-600">The Lucky Pet</div>
                  </div>
                </div>

                {/* Owner */}
                <div className="flex items-center space-x-3">
                  <img
                    src={story.ownerImage}
                    alt={story.ownerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-primary-800">{story.ownerName}</div>
                    <div className="text-sm text-primary-600">
                      {story.location} • {story.adoptionDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-secondary-500 to-accent-500 rounded-xl p-8 text-white">
            <h3 className="font-heading font-bold text-2xl mb-4">
              Ready to Create Your Own Success Story?
            </h3>
            <p className="text-secondary-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of families in Rajkot who have found their perfect companions. 
              Start your journey today and make a difference in a pet's life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleShareStory}
                className="bg-white text-secondary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                Share Your Story
              </button>
              <button 
                onClick={handleStartAdopting}
                className="bg-secondary-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-secondary-700 transition-colors duration-200"
              >
                Start Adopting
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;