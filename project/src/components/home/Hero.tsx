import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-warm-100 overflow-hidden">
      <div className="absolute inset-0 bg-white/30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-heading font-bold text-4xl lg:text-6xl text-primary-800 leading-tight">
                Every Pet Deserves a 
                <span className="text-secondary-500"> Forever Home</span>
              </h1>
              <p className="text-lg lg:text-xl text-primary-600 leading-relaxed">
                Connect with loving pets in Rajkot, Gujarat. Whether you're ready to adopt or 
                want to foster, help us create more happy endings for furry friends in need.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/adoption"
                className="inline-flex items-center justify-center px-8 py-4 bg-secondary-500 text-white font-semibold rounded-lg hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Search className="h-5 w-5 mr-2" />
                Find Your Companion
              </Link>
              <Link
                to="/foster"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Heart className="h-5 w-5 mr-2" />
                Become a Foster Parent
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Join Community
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-primary-600">500+ Happy Adoptions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-accent-500" />
                <span className="text-sm text-primary-600">200+ Active Foster Families</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
                alt="Happy dog and cat together"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-red-500 fill-current" />
                <span className="font-semibold text-primary-800">2,500+ Lives Saved</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="font-bold text-2xl text-secondary-500">98%</div>
                <div className="text-sm text-primary-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;