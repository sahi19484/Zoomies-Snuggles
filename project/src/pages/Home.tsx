import React from 'react';
import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import FeaturedPets from '../components/home/FeaturedPets';
import SuccessStories from '../components/home/SuccessStories';
import HowItWorks from '../components/home/HowItWorks';
import CallToAction from '../components/home/CallToAction';

const Home = () => {
  return (
    <div className="space-y-16">
      <Hero />
      <StatsSection />
      <FeaturedPets />
      <HowItWorks />
      <SuccessStories />
      <CallToAction />
    </div>
  );
};

export default Home;