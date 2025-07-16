import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Printer as Print, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import toast from 'react-hot-toast';

const PDFViewer = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Mock resource data - in real app this would come from API
  const resources = {
    'new-pet-owner-guide': {
      id: 'new-pet-owner-guide',
      title: 'New Pet Owner Guide',
      description: 'Complete guide for first-time pet owners covering basics of pet care, feeding, and bonding.',
      category: 'pet-care',
      type: 'Guide',
      format: 'PDF',
      pdfUrl: '/resources/new-pet-owner-guide.pdf',
      content: `
        <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">
          <header style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #F97316; padding-bottom: 20px;">
            <h1 style="font-size: 2.5rem; font-weight: bold; color: #1F2937; margin-bottom: 10px;">New Pet Owner Guide</h1>
            <h2 style="font-size: 1.5rem; color: #F97316; margin-bottom: 20px;">Welcome to Pet Parenthood!</h2>
            <p style="font-size: 1.1rem; color: #6B7280;">Congratulations on your new furry family member! This comprehensive guide will help you navigate the exciting journey of pet ownership.</p>
          </header>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #F97316; padding-left: 15px;">Chapter 1: Preparing Your Home</h3>
            <p style="margin-bottom: 15px;">Before bringing your pet home, ensure your space is safe and welcoming:</p>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 8px;">Remove toxic plants and hazardous items</li>
              <li style="margin-bottom: 8px;">Set up a comfortable sleeping area</li>
              <li style="margin-bottom: 8px;">Install safety gates if needed</li>
              <li style="margin-bottom: 8px;">Purchase essential supplies (food, water bowls, toys, etc.)</li>
            </ul>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #F97316; padding-left: 15px;">Chapter 2: Feeding Guidelines</h3>
            <p style="margin-bottom: 15px;">Proper nutrition is crucial for your pet's health:</p>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 8px;">Choose age-appropriate food</li>
              <li style="margin-bottom: 8px;">Establish regular feeding schedules</li>
              <li style="margin-bottom: 8px;">Monitor portion sizes</li>
              <li style="margin-bottom: 8px;">Always provide fresh water</li>
            </ul>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #F97316; padding-left: 15px;">Chapter 3: Building a Bond</h3>
            <p style="margin-bottom: 15px;">Creating a strong relationship with your pet takes time and patience:</p>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 8px;">Spend quality time together daily</li>
              <li style="margin-bottom: 8px;">Use positive reinforcement</li>
              <li style="margin-bottom: 8px;">Be consistent with routines</li>
              <li style="margin-bottom: 8px;">Respect your pet's personality</li>
            </ul>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #F97316; padding-left: 15px;">Chapter 4: Health and Wellness</h3>
            <p style="margin-bottom: 15px;">Regular veterinary care is essential:</p>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 8px;">Schedule initial health check-up</li>
              <li style="margin-bottom: 8px;">Keep up with vaccinations</li>
              <li style="margin-bottom: 8px;">Monitor for signs of illness</li>
              <li style="margin-bottom: 8px;">Maintain dental hygiene</li>
            </ul>
          </section>
          
          <footer style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center;">
            <p style="color: #6B7280; font-size: 0.9rem;">© 2024 Zoomies & Snuggles - Pet Care Resource Center</p>
            <p style="color: #6B7280; font-size: 0.9rem; margin-top: 5px;">For more resources, visit our website or contact us at +91 9484844090</p>
          </footer>
        </div>
      `
    },
    'pet-emergency-first-aid': {
      id: 'pet-emergency-first-aid',
      title: 'Pet Emergency First Aid',
      description: 'Critical first aid steps for common pet emergencies. Essential knowledge for every pet owner.',
      category: 'safety',
      type: 'Emergency Guide',
      format: 'PDF',
      pdfUrl: '/resources/pet-emergency-first-aid.pdf',
      content: `
        <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">
          <header style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #EF4444; padding-bottom: 20px;">
            <h1 style="font-size: 2.5rem; font-weight: bold; color: #1F2937; margin-bottom: 10px;">Pet Emergency First Aid Guide</h1>
            <h2 style="font-size: 1.5rem; color: #EF4444; margin-bottom: 20px;">Be Prepared to Save Lives</h2>
            <p style="font-size: 1.1rem; color: #6B7280;">Knowing basic first aid can make the difference between life and death for your pet.</p>
          </header>
          
          <section style="margin-bottom: 40px; background-color: #FEF2F2; padding: 20px; border-radius: 8px; border-left: 4px solid #EF4444;">
            <h3 style="font-size: 1.5rem; font-weight: bold; color: #DC2626; margin-bottom: 15px;">Emergency Contact Information</h3>
            <p style="color: #DC2626; margin-bottom: 8px;"><strong>Emergency Veterinary Clinic:</strong> +91 9484844090</p>
            <p style="color: #DC2626; margin-bottom: 8px;"><strong>Animal Poison Control:</strong> +91 98765 33333</p>
            <p style="color: #DC2626;"><strong>24/7 Pet Emergency Hotline:</strong> +91 9484844090</p>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #EF4444; padding-left: 15px;">Common Emergency Situations</h3>
            
            <h4 style="font-size: 1.3rem; font-weight: bold; color: #374151; margin: 20px 0 10px 0;">1. Choking</h4>
            <p style="margin-bottom: 8px;"><strong>Signs:</strong> Difficulty breathing, pawing at mouth, blue gums</p>
            <p style="margin-bottom: 8px;"><strong>Action:</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 5px;">Open the mouth and look for visible objects</li>
              <li style="margin-bottom: 5px;">Use tweezers to remove visible objects (be careful not to push further)</li>
              <li style="margin-bottom: 5px;">For small dogs: Hold upside down and give 5 sharp taps between shoulder blades</li>
              <li style="margin-bottom: 5px;">For large dogs: Lift hind legs and give 5 sharp taps between shoulder blades</li>
              <li style="margin-bottom: 5px;">Rush to veterinarian immediately</li>
            </ul>
            
            <h4 style="font-size: 1.3rem; font-weight: bold; color: #374151; margin: 20px 0 10px 0;">2. Bleeding</h4>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 5px;">Apply direct pressure with clean cloth or gauze</li>
              <li style="margin-bottom: 5px;">Elevate the injured area if possible</li>
              <li style="margin-bottom: 5px;">Do not remove embedded objects</li>
              <li style="margin-bottom: 5px;">Apply pressure around the object instead</li>
              <li style="margin-bottom: 5px;">Seek immediate veterinary care</li>
            </ul>
            
            <h4 style="font-size: 1.3rem; font-weight: bold; color: #374151; margin: 20px 0 10px 0;">3. Poisoning</h4>
            <p style="margin-bottom: 8px;"><strong>Signs:</strong> Vomiting, diarrhea, difficulty breathing, seizures</p>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 5px;">Remove pet from source of poison</li>
              <li style="margin-bottom: 5px;">Do NOT induce vomiting unless instructed by veterinarian</li>
              <li style="margin-bottom: 5px;">Collect sample of poison if safe to do so</li>
              <li style="margin-bottom: 5px;">Call poison control hotline immediately</li>
              <li style="margin-bottom: 5px;">Rush to emergency veterinary clinic</li>
            </ul>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #EF4444; padding-left: 15px;">First Aid Kit Essentials</h3>
            <ul style="margin-left: 20px;">
              <li style="margin-bottom: 8px;">Gauze pads and bandages</li>
              <li style="margin-bottom: 8px;">Medical tape and scissors</li>
              <li style="margin-bottom: 8px;">Digital thermometer</li>
              <li style="margin-bottom: 8px;">Antiseptic wipes</li>
              <li style="margin-bottom: 8px;">Emergency contact numbers</li>
              <li style="margin-bottom: 8px;">Muzzle (even friendly pets may bite when injured)</li>
            </ul>
          </section>
          
          <footer style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center;">
            <p style="color: #6B7280; font-size: 0.9rem;">© 2024 Zoomies & Snuggles - Emergency Care Resource Center</p>
            <p style="color: #6B7280; font-size: 0.9rem; margin-top: 5px;">For emergencies, call +91 9484844090 immediately</p>
          </footer>
        </div>
      `
    },
    'cat-behavior-understanding': {
      id: 'cat-behavior-understanding',
      title: 'Cat Behavior Understanding',
      description: 'Comprehensive guide to understanding cat body language, sounds, and behavioral patterns.',
      category: 'training',
      type: 'Guide',
      format: 'PDF',
      pdfUrl: '/resources/cat-behavior-understanding.pdf',
      content: `
        <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">
          <header style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #8B5CF6; padding-bottom: 20px;">
            <h1 style="font-size: 2.5rem; font-weight: bold; color: #1F2937; margin-bottom: 10px;">Understanding Cat Behavior</h1>
            <h2 style="font-size: 1.5rem; color: #8B5CF6; margin-bottom: 20px;">Decoding Your Feline Friend</h2>
            <p style="font-size: 1.1rem; color: #6B7280;">Cats communicate in subtle ways. Understanding their behavior helps build a stronger bond.</p>
          </header>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #8B5CF6; padding-left: 15px;">Body Language</h3>
            
            <h4 style="font-size: 1.3rem; font-weight: bold; color: #374151; margin: 20px 0 10px 0;">Tail Positions</h4>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 8px;"><strong>Upright with curve:</strong> Happy and confident</li>
              <li style="margin-bottom: 8px;"><strong>Puffed up:</strong> Scared or aggressive</li>
              <li style="margin-bottom: 8px;"><strong>Low or tucked:</strong> Anxious or submissive</li>
              <li style="margin-bottom: 8px;"><strong>Twitching tip:</strong> Focused or mildly irritated</li>
            </ul>
            
            <h4 style="font-size: 1.3rem; font-weight: bold; color: #374151; margin: 20px 0 10px 0;">Ear Positions</h4>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 8px;"><strong>Forward:</strong> Alert and interested</li>
              <li style="margin-bottom: 8px;"><strong>Flattened back:</strong> Scared or aggressive</li>
              <li style="margin-bottom: 8px;"><strong>Swiveling:</strong> Listening to sounds</li>
            </ul>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #8B5CF6; padding-left: 15px;">Vocalizations</h3>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 8px;"><strong>Purring:</strong> Usually contentment, sometimes self-soothing</li>
              <li style="margin-bottom: 8px;"><strong>Meowing:</strong> Communication with humans</li>
              <li style="margin-bottom: 8px;"><strong>Hissing:</strong> Warning signal, feeling threatened</li>
              <li style="margin-bottom: 8px;"><strong>Chirping:</strong> Excitement, often when watching birds</li>
            </ul>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #8B5CF6; padding-left: 15px;">Common Behaviors Explained</h3>
            <ul style="margin-left: 20px;">
              <li style="margin-bottom: 12px;"><strong>Kneading:</strong> Pushing paws against soft surfaces mimics nursing behavior. Sign of comfort.</li>
              <li style="margin-bottom: 12px;"><strong>Head Butting:</strong> Cats have scent glands on their heads. Marking you as family.</li>
              <li style="margin-bottom: 12px;"><strong>Bringing Gifts:</strong> Dead mice or birds are offerings showing love and teaching behavior.</li>
              <li style="margin-bottom: 12px;"><strong>Hiding in Boxes:</strong> Provides security and warmth. Natural instinct for enclosed spaces.</li>
            </ul>
          </section>
          
          <footer style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center;">
            <p style="color: #6B7280; font-size: 0.9rem;">© 2024 Zoomies & Snuggles - Cat Behavior Resource Center</p>
            <p style="color: #6B7280; font-size: 0.9rem; margin-top: 5px;">For behavioral consultations, contact us at +91 9484844090</p>
          </footer>
        </div>
      `
    },
    'dog-nutrition-guidelines': {
      id: 'dog-nutrition-guidelines',
      title: 'Dog Nutrition Guidelines',
      description: 'Detailed nutrition guide covering feeding schedules, food types, and dietary requirements by age.',
      category: 'health',
      type: 'Guide',
      format: 'PDF',
      pdfUrl: '/resources/dog-nutrition-guidelines.pdf',
      content: `
        <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">
          <header style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #10B981; padding-bottom: 20px;">
            <h1 style="font-size: 2.5rem; font-weight: bold; color: #1F2937; margin-bottom: 10px;">Dog Nutrition Guidelines</h1>
            <h2 style="font-size: 1.5rem; color: #10B981; margin-bottom: 20px;">Feeding Your Best Friend</h2>
            <p style="font-size: 1.1rem; color: #6B7280;">Proper nutrition is the foundation of your dog's health and happiness.</p>
          </header>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #10B981; padding-left: 15px;">Life Stage Nutrition</h3>
            
            <h4 style="font-size: 1.3rem; font-weight: bold; color: #374151; margin: 20px 0 10px 0;">Puppy Nutrition (0-12 months)</h4>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 8px;"><strong>Frequency:</strong> 3-4 meals per day until 6 months</li>
              <li style="margin-bottom: 8px;"><strong>Food Type:</strong> High-quality puppy formula with DHA</li>
              <li style="margin-bottom: 8px;"><strong>Special Needs:</strong> Higher protein and fat content for growth</li>
            </ul>
            
            <h4 style="font-size: 1.3rem; font-weight: bold; color: #374151; margin: 20px 0 10px 0;">Adult Dog Nutrition (1-7 years)</h4>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 8px;"><strong>Frequency:</strong> 2 meals per day</li>
              <li style="margin-bottom: 8px;"><strong>Food Type:</strong> Balanced adult maintenance formula</li>
              <li style="margin-bottom: 8px;"><strong>Focus:</strong> Maintain ideal body weight</li>
            </ul>
            
            <h4 style="font-size: 1.3rem; font-weight: bold; color: #374151; margin: 20px 0 10px 0;">Senior Dog Nutrition (7+ years)</h4>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
              <li style="margin-bottom: 8px;"><strong>Frequency:</strong> 2 smaller meals per day</li>
              <li style="margin-bottom: 8px;"><strong>Food Type:</strong> Senior formula with joint support</li>
              <li style="margin-bottom: 8px;"><strong>Special Needs:</strong> Easier to digest, joint supplements</li>
            </ul>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #10B981; padding-left: 15px;">Essential Nutrients</h3>
            
            <div style="margin-bottom: 20px;">
              <h4 style="font-size: 1.2rem; font-weight: bold; color: #374151; margin-bottom: 8px;">Proteins</h4>
              <p style="margin-bottom: 5px;"><strong>Function:</strong> Building and repairing tissues, immune function</p>
              <p style="margin-bottom: 5px;"><strong>Sources:</strong> Chicken, beef, fish, lamb, eggs</p>
              <p><strong>Requirements:</strong> Minimum 18% for adults, 22% for puppies</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h4 style="font-size: 1.2rem; font-weight: bold; color: #374151; margin-bottom: 8px;">Fats</h4>
              <p style="margin-bottom: 5px;"><strong>Function:</strong> Energy, skin and coat health</p>
              <p style="margin-bottom: 5px;"><strong>Sources:</strong> Fish oil, chicken fat, flaxseed</p>
              <p><strong>Requirements:</strong> Minimum 5% for adults, 8% for puppies</p>
            </div>
          </section>
          
          <section style="margin-bottom: 40px; background-color: #FEF2F2; padding: 20px; border-radius: 8px; border-left: 4px solid #EF4444;">
            <h3 style="font-size: 1.5rem; font-weight: bold; color: #DC2626; margin-bottom: 15px;">Foods to Avoid</h3>
            <ul style="margin-left: 20px; color: #DC2626;">
              <li style="margin-bottom: 5px;">Chocolate, grapes, onions</li>
              <li style="margin-bottom: 5px;">Xylitol, avocado, macadamia nuts</li>
              <li style="margin-bottom: 5px;">Cooked bones, high-fat foods</li>
            </ul>
          </section>
          
          <footer style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center;">
            <p style="color: #6B7280; font-size: 0.9rem;">© 2024 Zoomies & Snuggles - Nutrition Resource Center</p>
            <p style="color: #6B7280; font-size: 0.9rem; margin-top: 5px;">For nutrition consultations, contact us at +91 9484844090</p>
          </footer>
        </div>
      `
    },
    'pet-vaccination-schedule': {
      id: 'pet-vaccination-schedule',
      title: 'Pet Vaccination Schedule',
      description: 'Essential vaccination timeline for dogs and cats in India with local veterinary recommendations.',
      category: 'health',
      type: 'Chart',
      format: 'PDF',
      pdfUrl: '/resources/pet-vaccination-schedule.pdf',
      content: `
        <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">
          <header style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3B82F6; padding-bottom: 20px;">
            <h1 style="font-size: 2.5rem; font-weight: bold; color: #1F2937; margin-bottom: 10px;">Pet Vaccination Schedule</h1>
            <h2 style="font-size: 1.5rem; color: #3B82F6; margin-bottom: 20px;">Protecting Your Pet's Health</h2>
            <p style="font-size: 1.1rem; color: #6B7280;">Vaccinations are crucial for preventing serious diseases in pets. Follow this schedule for optimal protection.</p>
          </header>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #3B82F6; padding-left: 15px;">Dog Vaccination Schedule</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background-color: #EFF6FF;">
                  <th style="padding: 15px; border: 1px solid #D1D5DB; text-align: left; font-weight: bold; color: #1F2937;">Age</th>
                  <th style="padding: 15px; border: 1px solid #D1D5DB; text-align: left; font-weight: bold; color: #1F2937;">Vaccine</th>
                  <th style="padding: 15px; border: 1px solid #D1D5DB; text-align: left; font-weight: bold; color: #1F2937;">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">6-8 weeks</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB; font-weight: 600; color: #3B82F6;">DHPP</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">Distemper, Hepatitis, Parvovirus, Parainfluenza</td>
                </tr>
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">10-12 weeks</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB; font-weight: 600; color: #3B82F6;">DHPP + Rabies</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">Second round + Rabies vaccination</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">14-16 weeks</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB; font-weight: 600; color: #3B82F6;">DHPP Booster</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">Final puppy vaccination</td>
                </tr>
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">Annual</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB; font-weight: 600; color: #3B82F6;">DHPP + Rabies</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">Yearly boosters</td>
                </tr>
              </tbody>
            </table>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #1F2937; margin-bottom: 20px; border-left: 4px solid #3B82F6; padding-left: 15px;">Cat Vaccination Schedule</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background-color: #EFF6FF;">
                  <th style="padding: 15px; border: 1px solid #D1D5DB; text-align: left; font-weight: bold; color: #1F2937;">Age</th>
                  <th style="padding: 15px; border: 1px solid #D1D5DB; text-align: left; font-weight: bold; color: #1F2937;">Vaccine</th>
                  <th style="padding: 15px; border: 1px solid #D1D5DB; text-align: left; font-weight: bold; color: #1F2937;">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">6-8 weeks</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB; font-weight: 600; color: #3B82F6;">FVRCP</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia</td>
                </tr>
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">10-12 weeks</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB; font-weight: 600; color: #3B82F6;">FVRCP + Rabies</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">Second round + Rabies vaccination</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">14-16 weeks</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB; font-weight: 600; color: #3B82F6;">FVRCP Booster</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">Final kitten vaccination</td>
                </tr>
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">Annual</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB; font-weight: 600; color: #3B82F6;">FVRCP + Rabies</td>
                  <td style="padding: 12px 15px; border: 1px solid #D1D5DB;">Yearly boosters</td>
                </tr>
              </tbody>
            </table>
          </section>
          
          <section style="margin-bottom: 40px; background-color: #FEF3C7; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B;">
            <h3 style="font-size: 1.5rem; font-weight: bold; color: #92400E; margin-bottom: 15px;">Important Notes</h3>
            <ul style="margin-left: 20px; color: #92400E;">
              <li style="margin-bottom: 8px;">Always consult with your veterinarian for personalized vaccination schedules</li>
              <li style="margin-bottom: 8px;">Keep vaccination records safe and accessible</li>
              <li style="margin-bottom: 8px;">Some vaccines may require additional boosters based on risk factors</li>
              <li style="margin-bottom: 8px;">Report any adverse reactions to your veterinarian immediately</li>
            </ul>
          </section>
          
          <footer style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center;">
            <p style="color: #6B7280; font-size: 0.9rem;">© 2024 Zoomies & Snuggles - Pet Health Resource Center</p>
            <p style="color: #6B7280; font-size: 0.9rem; margin-top: 5px;">For veterinary consultations, contact us at +91 9484844090</p>
          </footer>
        </div>
      `
    }
  };

  useEffect(() => {
    if (resourceId && resources[resourceId]) {
      setResource(resources[resourceId]);
    } else {
      navigate('/resources');
      toast.error('Resource not found');
    }
  }, [resourceId, navigate]);

  const handleDownload = () => {
    if (resource.pdfUrl) {
      const link = document.createElement('a');
      link.href = resource.pdfUrl;
      link.download = `${resource.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${resource.title} downloaded successfully!`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(prev => prev + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(prev => prev - 25);
    }
  };

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-primary-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/resources')}
                className="flex items-center space-x-2 text-primary-600 hover:text-secondary-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Resources</span>
              </button>
              <div className="hidden md:block h-6 w-px bg-primary-300"></div>
              <div className="hidden md:block">
                <h1 className="font-heading font-bold text-lg text-primary-800">{resource.title}</h1>
                <p className="text-sm text-primary-600">{resource.type} • {resource.format}</p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <div className="hidden md:flex items-center space-x-1 bg-primary-100 rounded-lg p-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="p-2 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 text-sm font-medium text-primary-700 min-w-[60px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 200}
                  className="p-2 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Print className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Title */}
      <div className="md:hidden bg-white border-b border-primary-200 px-4 py-3">
        <h1 className="font-heading font-bold text-lg text-primary-800">{resource.title}</h1>
        <p className="text-sm text-primary-600">{resource.type} • {resource.format}</p>
      </div>

      {/* Document Content */}
      <div className="max-w-5xl mx-auto py-8">
        <div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: resource.content }}
          />
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-primary-200 p-4">
        <div className="flex space-x-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-2 bg-secondary-500 text-white py-3 rounded-lg hover:bg-secondary-600 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center space-x-2 bg-accent-500 text-white py-3 rounded-lg hover:bg-accent-600 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;