import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-br from-secondary-500 to-accent-500 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-secondary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Whether you're ready to adopt a forever friend or want to provide temporary care as a foster parent, 
            your love can transform a life. Join our community of pet lovers in Rajkot today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Adoption CTA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
              <Heart className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-4">
                Adopt a Pet
              </h3>
              <p className="text-secondary-100 mb-6 leading-relaxed">
                Give a rescued pet the loving home they deserve. Browse our available companions and find your perfect match.
              </p>
              <Link
                to="/adoption"
                className="inline-flex items-center bg-white text-secondary-600 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Find Your Pet
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Foster CTA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
              <Users className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-4">
                Become a Foster Parent
              </h3>
              <p className="text-secondary-100 mb-6 leading-relaxed">
                Provide temporary care and help pets recover while they wait for their forever homes. Make a difference today.
              </p>
              <Link
                to="/foster"
                className="inline-flex items-center bg-white text-secondary-600 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Fostering
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Join Community CTA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
              <Heart className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-4">
                Join Our Community
              </h3>
              <p className="text-secondary-100 mb-6 leading-relaxed">
                Connect with fellow pet lovers, share experiences, and stay updated on events and resources.
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center bg-white text-secondary-600 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign Up Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-secondary-100 mb-4">
              Have questions? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8">
              <a
                href="tel:+919484844090"
                className="text-white hover:text-secondary-200 transition-colors"
              >
                📞 +91 9484844090
              </a>
              <a
                href="mailto:hello@zoomiessnuggles.org"
                className="text-white hover:text-secondary-200 transition-colors"
              >
                ✉️ hello@zoomiessnuggles.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;