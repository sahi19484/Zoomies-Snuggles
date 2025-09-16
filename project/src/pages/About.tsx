import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Award, Target, Eye, Handshake, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const About = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Sahil Mungara',
      role: 'Founder & Lead Developer',
      bio: 'Passionate about animal welfare and technology, Sahil leads our development team to create innovative solutions for pet adoption.',
      initials: 'SM'
    },
    {
      name: 'Yash Mehta',
      role: 'Operations Director',
      bio: 'With expertise in operations management, Yash ensures smooth coordination between rescue operations and adoption processes.',
      initials: 'YM'
    },
    {
      name: 'Ansh Rudani',
      role: 'Foster Program Coordinator',
      bio: 'Animal behaviorist specializing in rehabilitation and foster care programs. Ansh has personally coordinated over 100 successful foster placements.',
      initials: 'AR'
    },
    {
      name: 'Jaydeepsinh Rathod',
      role: 'Community Outreach Manager',
      bio: 'Social worker focused on building community awareness about animal welfare and responsible pet ownership across Rajkot.',
      initials: 'JR'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Compassion First',
      description: 'Every decision we make is guided by empathy and love for animals in need.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We believe in the power of community to create lasting change for animal welfare.'
    },
    {
      icon: Handshake,
      title: 'Transparency',
      description: 'Open communication and honest practices build trust with adopters and partners.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for the highest standards in animal care and adoption services.'
    }
  ];

  const achievements = [
    {
      number: '2,500+',
      label: 'Animals Rescued',
      description: 'Lives saved from streets and difficult situations'
    },
    {
      number: '2,100+',
      label: 'Successful Adoptions',
      description: 'Forever homes created across Rajkot and Gujarat'
    },
    {
      number: '245',
      label: 'Foster Families',
      description: 'Dedicated volunteers providing temporary care'
    },
    {
      number: '5',
      label: 'Years of Service',
      description: 'Serving the Rajkot community since 2019'
    }
  ];

  const handleAdoptPet = () => {
    navigate('/adoption');
    toast.success('Browse our available pets and find your perfect companion!');
  };

  const handleBecomeVolunteer = () => {
    navigate('/foster');
    toast.success('Thank you for your interest in volunteering! Explore our foster program.');
  };

  const handleContactTeam = () => {
    navigate('/contact');
  };

  const handleJoinMission = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary-500 to-accent-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl lg:text-6xl mb-6">
              About Zoomies & Snuggles
            </h1>
            <p className="text-xl text-secondary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Founded with love and driven by compassion, we're Rajkot's leading pet adoption 
              and foster care platform, dedicated to connecting hearts and creating forever families.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleJoinMission}
                className="bg-white text-secondary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg"
              >
                Join Our Mission
              </button>
              <button
                onClick={handleContactTeam}
                className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-secondary-600 transition-all duration-200"
              >
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex items-center">
              <img
                src="https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg"
                alt="Our mission"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="h-8 w-8 text-secondary-500" />
                  <h2 className="font-heading font-bold text-3xl text-primary-800">Our Mission</h2>
                </div>
                <p className="text-lg text-primary-600 leading-relaxed">

                  
                  To rescue, rehabilitate, and rehome abandoned and stray animals in Rajkot while 
                  building a compassionate community that values animal welfare. We strive to reduce 
                  the number of homeless pets through education, advocacy, and comprehensive adoption services.
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Eye className="h-8 w-8 text-accent-500" />
                  <h2 className="font-heading font-bold text-3xl text-primary-800">Our Vision</h2>
                </div>
                <p className="text-lg text-primary-600 leading-relaxed">


                  
                  A future where every pet in Rajkot has a loving home, where animal cruelty is eliminated, 
                  and where the bond between humans and animals is celebrated and protected. We envision 
                  a community where compassion for animals is a shared value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
              Our Story
            </h2>
            <div className="w-24 h-1 bg-secondary-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-primary-600 leading-relaxed">
                Zoomies & Snuggles began in 2024 when our founding team, led by Sahil Mungara, noticed 
                the increasing number of stray animals in Rajkot. What started as informal rescue efforts 
                quickly grew into a structured organization with the help of Yash Mehta, Ansh Rudani, and Jaydeepsinh Rathod.
              </p>
              <p className="text-lg text-primary-600 leading-relaxed">
                Our first adoption event placed 12 pets in loving homes. Word spread through social media 
                and community networks, and soon we had volunteers, foster families, and supporters from 
                across Gujarat joining our mission.
              </p>
              <p className="text-lg text-primary-600 leading-relaxed">
                Today, we operate comprehensive adoption and foster programs, maintain partnerships with 
                local veterinarians, and have built a thriving community of animal lovers who share our 
                commitment to animal welfare.
              </p>
              <p className="text-lg text-primary-600 leading-relaxed">
                Every success story fuels our passion. Every wagging tail and grateful purr reminds us 
                why we do this work. We're not just finding homes for pets – we're creating families 
                and building a more compassionate Rajkot.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg"
                alt="Our journey"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="font-bold text-2xl text-secondary-500">2024</div>
                  <div className="text-sm text-primary-600">Founded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              These core principles guide everything we do and shape our approach to animal welfare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-secondary-500" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-primary-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-primary-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Numbers that represent lives changed, families created, and hope restored.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="font-heading font-bold text-4xl text-secondary-500 mb-2">
                  {achievement.number}
                </div>
                <div className="font-semibold text-primary-800 mb-2">
                  {achievement.label}
                </div>
                <p className="text-sm text-primary-600 leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary-800 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Passionate individuals dedicated to making a difference in the lives of animals and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-primary-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-secondary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary-600">
                    {member.initials}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-primary-800 mb-1">
                  {member.name}
                </h3>
                <div className="text-secondary-500 font-medium mb-3">
                  {member.role}
                </div>
                <p className="text-sm text-primary-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="font-heading font-bold text-3xl text-primary-800 mb-4">
                Get in Touch with Our Team
              </h2>
              <p className="text-lg text-primary-600">
                Have questions or want to learn more about our work? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-secondary-500" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary-800 mb-2">Call Us</h3>
                <a 
                  href="tel:+919484844090"
                  className="text-primary-600 hover:text-secondary-600 transition-colors"
                >
                  +91 9484844090
                </a>
                <p className="text-sm text-primary-500 mt-1">Mon-Sat, 9 AM - 7 PM</p>
              </div>

              <div className="text-center">
                <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-accent-500" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary-800 mb-2">Email Us</h3>
                <a 
                  href="mailto:zoomiesnsnuggles@gmail.com"
                  className="text-primary-600 hover:text-accent-600 transition-colors"
                >
                  zoomiesnsnuggles@gmail.com
                </a>
                <p className="text-sm text-primary-500 mt-1">We respond within 24 hours</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary-800 mb-2">Visit Us</h3>
                <span className="text-primary-600">Rajkot, Gujarat</span>
                <p className="text-sm text-primary-500 mt-1">By appointment only</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleContactTeam}
                className="bg-secondary-500 text-white font-semibold px-8 py-4 rounded-lg hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-secondary-500 to-accent-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-secondary-100 mb-8 leading-relaxed">
            Whether you're ready to adopt, foster, volunteer, or support our cause, 
            there are many ways to be part of our animal-loving community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleAdoptPet}
              className="bg-white text-secondary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Adopt a Pet
            </button>
            <button 
              onClick={handleBecomeVolunteer}
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-secondary-600 transition-all duration-200"
            >
              Become a Foster Parent
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
