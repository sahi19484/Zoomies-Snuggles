import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Heart, AlertTriangle } from 'lucide-react';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-primary-600 hover:text-secondary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-secondary-500 mx-auto mb-4" />
            <h1 className="font-heading font-bold text-3xl text-primary-800 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-primary-600">
              Last updated: December 2024
            </p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="font-heading font-bold text-2xl text-primary-800 mb-4 flex items-center">
              <Heart className="h-6 w-6 text-secondary-500 mr-2" />
              Welcome to Zoomies & Snuggles
            </h2>
            <p className="text-primary-600 leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your use of the Zoomies & Snuggles website and services 
              operated by Zoomies & Snuggles ("we," "us," or "our"). By accessing or using our service, 
              you agree to be bound by these Terms.
            </p>
            <p className="text-primary-600 leading-relaxed">
              If you disagree with any part of these terms, then you may not access the service.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-primary-600 leading-relaxed mb-4">
              By creating an account, accessing, or using our services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
            <ul className="list-disc list-inside text-primary-600 space-y-2">
              <li>You must be at least 18 years old to use our services</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the security of your account</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4 flex items-center">
              <Users className="h-5 w-5 text-accent-500 mr-2" />
              2. User Accounts and Registration
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary-800 mb-2">Account Types</h3>
                <ul className="list-disc list-inside text-primary-600 space-y-1">
                  <li><strong>Adopters:</strong> Individuals seeking to adopt pets</li>
                  <li><strong>Foster Parents:</strong> Individuals providing temporary care</li>
                  <li><strong>Volunteers:</strong> Community members supporting our mission</li>
                  <li><strong>Partner Organizations:</strong> Verified organizations with special access</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-primary-800 mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside text-primary-600 space-y-1">
                  <li>Maintain accurate and up-to-date information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Use the service only for lawful purposes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Pet Adoption Services */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              3. Pet Adoption and Foster Services
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary-800 mb-2">Adoption Process</h3>
                <ul className="list-disc list-inside text-primary-600 space-y-1">
                  <li>All adoptions are subject to our screening process</li>
                  <li>We reserve the right to deny any adoption application</li>
                  <li>Adoption fees are non-refundable once the pet is placed</li>
                  <li>Post-adoption support is provided for the welfare of the pet</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-primary-800 mb-2">Foster Care</h3>
                <ul className="list-disc list-inside text-primary-600 space-y-1">
                  <li>Foster parents must complete our training program</li>
                  <li>We provide medical care and supplies for foster pets</li>
                  <li>Foster agreements can be terminated by either party</li>
                  <li>Emergency support is available 24/7</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              4. User Conduct and Prohibited Activities
            </h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p className="text-orange-800 font-medium mb-2">You agree NOT to:</p>
              <ul className="list-disc list-inside text-orange-700 space-y-1">
                <li>Provide false or misleading information</li>
                <li>Use the service for commercial breeding or selling</li>
                <li>Harass, abuse, or harm animals or other users</li>
                <li>Violate any local, state, or federal laws</li>
                <li>Attempt to circumvent our screening processes</li>
                <li>Share your account credentials with others</li>
              </ul>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              5. Privacy and Data Protection
            </h2>
            <p className="text-primary-600 leading-relaxed mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, 
              and protect your information when you use our service.
            </p>
            <ul className="list-disc list-inside text-primary-600 space-y-2">
              <li>We collect only necessary information for our services</li>
              <li>Your data is stored securely and never sold to third parties</li>
              <li>You can request access to or deletion of your data</li>
              <li>We comply with applicable data protection regulations</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              6. Intellectual Property Rights
            </h2>
            <p className="text-primary-600 leading-relaxed mb-4">
              The service and its original content, features, and functionality are and will remain 
              the exclusive property of Zoomies & Snuggles and its licensors.
            </p>
            <ul className="list-disc list-inside text-primary-600 space-y-2">
              <li>Our logo, trademarks, and brand elements are protected</li>
              <li>You may not reproduce or distribute our content without permission</li>
              <li>User-generated content remains your property but grants us usage rights</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              7. Limitation of Liability
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 leading-relaxed mb-2">
                <strong>Important:</strong> While we strive to provide accurate information about pets 
                and facilitate successful adoptions, we cannot guarantee:
              </p>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                <li>The health, temperament, or behavior of any pet</li>
                <li>The accuracy of all information provided by users</li>
                <li>Compatibility between pets and adopters</li>
                <li>Outcomes of adoption or foster placements</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              8. Termination
            </h2>
            <p className="text-primary-600 leading-relaxed mb-4">
              We may terminate or suspend your account and access to the service immediately, 
              without prior notice, for conduct that we believe violates these Terms or is harmful 
              to other users, us, or third parties.
            </p>
            <p className="text-primary-600 leading-relaxed">
              You may also terminate your account at any time by contacting us or using the 
              account deletion feature in your settings.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              9. Changes to Terms
            </h2>
            <p className="text-primary-600 leading-relaxed mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision 
              is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p className="text-primary-600 leading-relaxed">
              Your continued use of the service after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              10. Contact Information
            </h2>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-primary-700 mb-2">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="text-primary-600 space-y-1">
                <li><strong>Email:</strong> legal@zoomiessnuggles.org</li>
                <li><strong>Phone:</strong> +91 9484844090</li>
                <li><strong>Address:</strong> Rajkot, Gujarat, India</li>
              </ul>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              11. Governing Law
            </h2>
            <p className="text-primary-600 leading-relaxed">
              These Terms shall be interpreted and governed by the laws of India. Any disputes 
              arising from these Terms or your use of the service shall be subject to the 
              jurisdiction of the courts in Gujarat, India.
            </p>
          </section>

          {/* Acknowledgment */}
          <section className="border-t border-primary-200 pt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                By using our service, you acknowledge that you have read and understood these 
                Terms of Service and agree to be bound by them.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;