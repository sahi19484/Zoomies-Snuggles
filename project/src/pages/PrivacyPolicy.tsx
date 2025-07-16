import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
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
            <Shield className="h-12 w-12 text-accent-500 mx-auto mb-4" />
            <h1 className="font-heading font-bold text-3xl text-primary-800 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-primary-600">
              Last updated: December 2024
            </p>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="font-heading font-bold text-2xl text-primary-800 mb-4 flex items-center">
              <Eye className="h-6 w-6 text-accent-500 mr-2" />
              Our Commitment to Your Privacy
            </h2>
            <p className="text-primary-600 leading-relaxed mb-4">
              At Zoomies & Snuggles, we are committed to protecting your privacy and ensuring the 
              security of your personal information. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our website and services.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                We believe in transparency and want you to understand exactly how your information 
                is handled when you trust us with your pet adoption and foster care needs.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4 flex items-center">
              <Database className="h-5 w-5 text-green-500 mr-2" />
              1. Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-primary-800 mb-3">Personal Information You Provide</h3>
                <ul className="list-disc list-inside text-primary-600 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, phone number, location</li>
                  <li><strong>Profile Details:</strong> Pet preferences, experience with animals, living situation</li>
                  <li><strong>Application Data:</strong> Adoption and foster application responses</li>
                  <li><strong>Communication Records:</strong> Messages, support requests, feedback</li>
                  <li><strong>Event Registration:</strong> Information for workshops and community events</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-primary-800 mb-3">Information Collected Automatically</h3>
                <ul className="list-disc list-inside text-primary-600 space-y-2">
                  <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                  <li><strong>Cookies:</strong> Preferences, session data, analytics information</li>
                  <li><strong>Location Data:</strong> General location for local pet matching (with consent)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-primary-800 mb-3">Information from Third Parties</h3>
                <ul className="list-disc list-inside text-primary-600 space-y-2">
                  <li><strong>Social Media:</strong> Profile information when you sign in with Google/Facebook</li>
                  <li><strong>References:</strong> Information provided by your references during applications</li>
                  <li><strong>Veterinary Records:</strong> Pet health information (with your consent)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4 flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              2. How We Use Your Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-3">Core Services</h3>
                <ul className="list-disc list-inside text-purple-700 space-y-1 text-sm">
                  <li>Process adoption and foster applications</li>
                  <li>Match pets with suitable families</li>
                  <li>Facilitate communication between parties</li>
                  <li>Provide customer support</li>
                  <li>Organize community events</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">Communication</h3>
                <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                  <li>Send adoption updates and notifications</li>
                  <li>Share educational content and resources</li>
                  <li>Notify about events and opportunities</li>
                  <li>Provide emergency alerts</li>
                  <li>Send newsletters (with consent)</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">Improvement</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                  <li>Analyze usage patterns and preferences</li>
                  <li>Improve our website and services</li>
                  <li>Develop new features</li>
                  <li>Conduct research on pet welfare</li>
                  <li>Optimize user experience</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-3">Legal & Safety</h3>
                <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm">
                  <li>Comply with legal obligations</li>
                  <li>Protect against fraud and abuse</li>
                  <li>Ensure animal welfare standards</li>
                  <li>Resolve disputes</li>
                  <li>Maintain security</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4 flex items-center">
              <Globe className="h-5 w-5 text-blue-500 mr-2" />
              3. How We Share Your Information
            </h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">We DO NOT sell your personal information</h3>
                <p className="text-red-700 text-sm">
                  Your privacy is not for sale. We never sell, rent, or trade your personal information 
                  to third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-primary-800 mb-3">We may share information in these situations:</h3>
                <ul className="list-disc list-inside text-primary-600 space-y-2">
                  <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                  <li><strong>Service Providers:</strong> Trusted partners who help us operate our services</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
                  <li><strong>Emergency Situations:</strong> To protect the welfare of animals or people</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4 flex items-center">
              <Lock className="h-5 w-5 text-green-500 mr-2" />
              4. Data Security and Protection
            </h2>
            
            <div className="space-y-4">
              <p className="text-primary-600 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect 
                your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Technical Safeguards</h3>
                  <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Secure servers and databases</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Organizational Measures</h3>
                  <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                    <li>Staff training on data protection</li>
                    <li>Limited access on need-to-know basis</li>
                    <li>Regular privacy impact assessments</li>
                    <li>Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              5. Your Privacy Rights
            </h2>
            
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-6">
              <h3 className="font-semibold text-accent-800 mb-4">You have the right to:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="list-disc list-inside text-accent-700 space-y-2">
                  <li><strong>Access:</strong> Request copies of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate information</li>
                  <li><strong>Erasure:</strong> Request deletion of your data</li>
                  <li><strong>Portability:</strong> Receive your data in a portable format</li>
                </ul>
                <ul className="list-disc list-inside text-accent-700 space-y-2">
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Withdraw Consent:</strong> Revoke previously given consent</li>
                  <li><strong>Complaint:</strong> File complaints with supervisory authorities</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              6. Cookies and Tracking Technologies
            </h2>
            
            <div className="space-y-4">
              <p className="text-primary-600 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage, 
                and provide personalized content.
              </p>
              
              <div className="space-y-3">
                <div className="border border-primary-200 rounded-lg p-4">
                  <h3 className="font-semibold text-primary-800 mb-2">Essential Cookies</h3>
                  <p className="text-primary-600 text-sm">Required for basic website functionality and security.</p>
                </div>
                
                <div className="border border-primary-200 rounded-lg p-4">
                  <h3 className="font-semibold text-primary-800 mb-2">Analytics Cookies</h3>
                  <p className="text-primary-600 text-sm">Help us understand how visitors use our website.</p>
                </div>
                
                <div className="border border-primary-200 rounded-lg p-4">
                  <h3 className="font-semibold text-primary-800 mb-2">Preference Cookies</h3>
                  <p className="text-primary-600 text-sm">Remember your settings and preferences.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              7. Data Retention
            </h2>
            <p className="text-primary-600 leading-relaxed mb-4">
              We retain your personal information only as long as necessary to fulfill the purposes 
              for which it was collected, comply with legal obligations, and resolve disputes.
            </p>
            <ul className="list-disc list-inside text-primary-600 space-y-2">
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Application Records:</strong> Kept for 7 years for legal compliance</li>
              <li><strong>Communication Logs:</strong> Retained for 3 years for support purposes</li>
              <li><strong>Analytics Data:</strong> Anonymized and retained for statistical analysis</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              8. Children's Privacy
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium mb-2">
                Our services are not intended for children under 18 years of age.
              </p>
              <p className="text-yellow-700 text-sm">
                We do not knowingly collect personal information from children under 18. If you 
                believe we have collected information from a child, please contact us immediately.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              9. International Data Transfers
            </h2>
            <p className="text-primary-600 leading-relaxed">
              Your information is primarily stored and processed in India. If we transfer data 
              internationally, we ensure appropriate safeguards are in place to protect your privacy 
              in accordance with applicable data protection laws.
            </p>
          </section>

          {/* Updates to Policy */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              10. Updates to This Privacy Policy
            </h2>
            <p className="text-primary-600 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices 
              or applicable laws. We will notify you of any material changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p className="text-primary-600 leading-relaxed">
              We encourage you to review this Privacy Policy periodically to stay informed about 
              how we protect your information.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
              11. Contact Us
            </h2>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <p className="text-primary-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, 
                please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">General Inquiries</h3>
                  <ul className="text-primary-600 space-y-1 text-sm">
                    <li><strong>Email:</strong> privacy@zoomiessnuggles.org</li>
                    <li><strong>Phone:</strong> +91 9484844090</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">Data Protection Officer</h3>
                  <ul className="text-primary-600 space-y-1 text-sm">
                    <li><strong>Email:</strong> dpo@zoomiessnuggles.org</li>
                    <li><strong>Address:</strong> Rajkot, Gujarat, India</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="border-t border-primary-200 pt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                By using our service, you acknowledge that you have read and understood this 
                Privacy Policy and consent to the collection and use of your information as described herein.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;