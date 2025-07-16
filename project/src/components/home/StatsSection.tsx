import React from 'react';
import { Heart, Home, Users, Award } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Heart,
      number: '2,547',
      label: 'Pets Rescued',
      description: 'Loving animals saved from streets and shelters',
      color: 'text-red-500'
    },
    {
      icon: Home,
      number: '2,103',
      label: 'Successful Adoptions',
      description: 'Forever homes created with loving families',
      color: 'text-green-500'
    },
    {
      icon: Users,
      number: '245',
      label: 'Active Foster Families',
      description: 'Dedicated volunteers providing temporary care',
      color: 'text-blue-500'
    },
    {
      icon: Award,
      number: '98%',
      label: 'Success Rate',
      description: 'Pets successfully placed in loving homes',
      color: 'text-secondary-500'
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
            Making a Difference in Rajkot
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Our community's dedication has created countless success stories. Together, we're 
            transforming lives one adoption at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-primary-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-md">
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="font-heading font-bold text-3xl text-primary-800 mb-2">
                  {stat.number}
                </div>
                <div className="font-semibold text-primary-700 mb-2">
                  {stat.label}
                </div>
                <p className="text-sm text-primary-600 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Real-time indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Updated in real-time</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;