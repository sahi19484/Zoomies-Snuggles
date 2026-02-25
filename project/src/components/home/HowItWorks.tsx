import React from 'react';
import { Search, Heart, Home, UserCheck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Browse & Discover',
      description: 'Explore our extensive database of pets available for adoption. Use filters to find your perfect match based on size, age, breed, and location.',
      color: 'bg-blue-500'
    },
    {
      icon: Heart,
      title: 'Connect & Meet',
      description: 'Schedule a meeting with your chosen pet. Our team will arrange a visit where you can interact and see if there\'s a connection.',
      color: 'bg-red-500'
    },
    {
      icon: UserCheck,
      title: 'Application Process',
      description: 'Complete our simple adoption application. We\'ll review your information and may conduct a brief interview to ensure the best match.',
      color: 'bg-green-500'
    },
    {
      icon: Home,
      title: 'Welcome Home',
      description: 'Once approved, take your new family member home! We provide ongoing support and resources to help with the transition.',
      color: 'bg-secondary-500'
    }
  ];

  return (
    <section className="bg-primary-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
            How Adoption Works
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Our simple 4-step process makes it easy to find and adopt your perfect companion. 
            We're here to guide you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-primary-200 transform -translate-y-1/2 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-300 rounded-full"></div>
                  </div>
                )}

                <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 relative z-10">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-200 text-primary-800 font-bold text-sm rounded-full mb-4">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${step.color} rounded-full mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading font-bold text-xl text-primary-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-primary-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-bold text-2xl text-secondary-500 mb-2">24-48 hrs</div>
              <div className="text-primary-600">Average Application Review Time</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-accent-500 mb-2">₹500-2000</div>
              <div className="text-primary-600">Adoption Fee Range</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-green-500 mb-2">Lifetime</div>
              <div className="text-primary-600">Support & Guidance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;