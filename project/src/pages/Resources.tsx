import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Video, Eye, Search, Heart, Shield, Stethoscope, GraduationCap, Phone, MapPin, ExternalLink, Play } from 'lucide-react';
import toast from 'react-hot-toast';

const Resources = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { id: '', name: 'All Resources', icon: Book },
    { id: 'pet-care', name: 'Pet Care', icon: Heart },
    { id: 'health', name: 'Health & Medical', icon: Stethoscope },
    { id: 'training', name: 'Training & Behavior', icon: GraduationCap },
    { id: 'safety', name: 'Safety & Emergency', icon: Shield }
  ];

  const resources = [
    {
      id: 1,
      title: 'New Pet Owner Guide',
      description: 'Complete guide for first-time pet owners covering basics of pet care, feeding, and bonding.',
      category: 'pet-care',
      type: 'Guide',
      format: 'PDF',
      icon: Eye,
      pdfUrl: '/resources/new-pet-owner-guide.pdf',
      content: `
        <h1>New Pet Owner Guide</h1>
        <h2>Welcome to Pet Parenthood!</h2>
        <p>Congratulations on your new furry family member! This comprehensive guide will help you navigate the exciting journey of pet ownership.</p>
        
        <h3>Chapter 1: Preparing Your Home</h3>
        <p>Before bringing your pet home, ensure your space is safe and welcoming:</p>
        <ul>
          <li>Remove toxic plants and hazardous items</li>
          <li>Set up a comfortable sleeping area</li>
          <li>Install safety gates if needed</li>
          <li>Purchase essential supplies (food, water bowls, toys, etc.)</li>
        </ul>
        
        <h3>Chapter 2: Feeding Guidelines</h3>
        <p>Proper nutrition is crucial for your pet's health:</p>
        <ul>
          <li>Choose age-appropriate food</li>
          <li>Establish regular feeding schedules</li>
          <li>Monitor portion sizes</li>
          <li>Always provide fresh water</li>
        </ul>
        
        <h3>Chapter 3: Building a Bond</h3>
        <p>Creating a strong relationship with your pet takes time and patience:</p>
        <ul>
          <li>Spend quality time together daily</li>
          <li>Use positive reinforcement</li>
          <li>Be consistent with routines</li>
          <li>Respect your pet's personality</li>
        </ul>
        
        <h3>Chapter 4: Health and Wellness</h3>
        <p>Regular veterinary care is essential:</p>
        <ul>
          <li>Schedule initial health check-up</li>
          <li>Keep up with vaccinations</li>
          <li>Monitor for signs of illness</li>
          <li>Maintain dental hygiene</li>
        </ul>
      `,
      featured: true
    },
    {
      id: 2,
      title: 'Pet Vaccination Schedule',
      description: 'Essential vaccination timeline for dogs and cats in India with local veterinary recommendations.',
      category: 'health',
      type: 'Chart',
      format: 'PDF',
      icon: Eye,
      pdfUrl: '/resources/pet-vaccination-schedule.pdf',
      content: `
        <h1>Pet Vaccination Schedule</h1>
        <h2>Protecting Your Pet's Health</h2>
        <p>Vaccinations are crucial for preventing serious diseases in pets. Follow this schedule for optimal protection.</p>
        
        <h3>Dog Vaccination Schedule</h3>
        <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px; border: 1px solid #ddd;">Age</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Vaccine</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Description</th>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">6-8 weeks</td>
            <td style="padding: 10px; border: 1px solid #ddd;">DHPP</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Distemper, Hepatitis, Parvovirus, Parainfluenza</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">10-12 weeks</td>
            <td style="padding: 10px; border: 1px solid #ddd;">DHPP + Rabies</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Second round + Rabies vaccination</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">14-16 weeks</td>
            <td style="padding: 10px; border: 1px solid #ddd;">DHPP Booster</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Final puppy vaccination</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Annual</td>
            <td style="padding: 10px; border: 1px solid #ddd;">DHPP + Rabies</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Yearly boosters</td>
          </tr>
        </table>
        
        <h3>Cat Vaccination Schedule</h3>
        <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px; border: 1px solid #ddd;">Age</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Vaccine</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Description</th>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">6-8 weeks</td>
            <td style="padding: 10px; border: 1px solid #ddd;">FVRCP</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">10-12 weeks</td>
            <td style="padding: 10px; border: 1px solid #ddd;">FVRCP + Rabies</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Second round + Rabies vaccination</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">14-16 weeks</td>
            <td style="padding: 10px; border: 1px solid #ddd;">FVRCP Booster</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Final kitten vaccination</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Annual</td>
            <td style="padding: 10px; border: 1px solid #ddd;">FVRCP + Rabies</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Yearly boosters</td>
          </tr>
        </table>
        
        <h3>Important Notes</h3>
        <ul>
          <li>Always consult with your veterinarian for personalized vaccination schedules</li>
          <li>Keep vaccination records safe and accessible</li>
          <li>Some vaccines may require additional boosters based on risk factors</li>
          <li>Report any adverse reactions to your veterinarian immediately</li>
        </ul>
      `,
      featured: true
    },
    {
      id: 3,
      title: 'Basic Dog Training Techniques',
      description: 'Video series covering fundamental training commands and positive reinforcement methods.',
      category: 'training',
      type: 'Video Series',
      format: 'Video',
      icon: Play,
      youtubeUrl: 'https://youtu.be/FWCnvgMCDcU?si=lVQWZoJYdTinY3hi',
      thumbnail: 'https://i.ytimg.com/vi/FWCnvgMCDcU/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDVRwBh5jMebZUX2VI5Er6qg7LJRw',
      featured: false
    },
    {
      id: 4,
      title: 'Pet Emergency First Aid',
      description: 'Critical first aid steps for common pet emergencies. Essential knowledge for every pet owner.',
      category: 'safety',
      type: 'Emergency Guide',
      format: 'PDF',
      icon: Eye,
      pdfUrl: '/resources/pet-emergency-first-aid.pdf',
      content: `
        <h1>Pet Emergency First Aid Guide</h1>
        <h2>Be Prepared to Save Lives</h2>
        <p>Knowing basic first aid can make the difference between life and death for your pet. This guide covers essential emergency procedures.</p>
        
        <h3>Emergency Contact Information</h3>
        <div style="background-color: #ffebee; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0;">
          <p><strong>Emergency Veterinary Clinic:</strong> +91 9484844090</p>
          <p><strong>Animal Poison Control:</strong> +91 98765 33333</p>
          <p><strong>24/7 Pet Emergency Hotline:</strong> +91 9484844090</p>
        </div>
        
        <h3>Common Emergency Situations</h3>
        
        <h4>1. Choking</h4>
        <p><strong>Signs:</strong> Difficulty breathing, pawing at mouth, blue gums</p>
        <p><strong>Action:</strong></p>
        <ul>
          <li>Open the mouth and look for visible objects</li>
          <li>Use tweezers to remove visible objects (be careful not to push further)</li>
          <li>For small dogs: Hold upside down and give 5 sharp taps between shoulder blades</li>
          <li>For large dogs: Lift hind legs and give 5 sharp taps between shoulder blades</li>
          <li>Rush to veterinarian immediately</li>
        </ul>
        
        <h4>2. Bleeding</h4>
        <p><strong>Action:</strong></p>
        <ul>
          <li>Apply direct pressure with clean cloth or gauze</li>
          <li>Elevate the injured area if possible</li>
          <li>Do not remove embedded objects</li>
          <li>Apply pressure around the object instead</li>
          <li>Seek immediate veterinary care</li>
        </ul>
        
        <h4>3. Poisoning</h4>
        <p><strong>Signs:</strong> Vomiting, diarrhea, difficulty breathing, seizures</p>
        <p><strong>Action:</strong></p>
        <ul>
          <li>Remove pet from source of poison</li>
          <li>Do NOT induce vomiting unless instructed by veterinarian</li>
          <li>Collect sample of poison if safe to do so</li>
          <li>Call poison control hotline immediately</li>
          <li>Rush to emergency veterinary clinic</li>
        </ul>
        
        <h4>4. Heatstroke</h4>
        <p><strong>Signs:</strong> Heavy panting, drooling, weakness, vomiting</p>
        <p><strong>Action:</strong></p>
        <ul>
          <li>Move pet to cool, shaded area</li>
          <li>Apply cool (not cold) water to paws and belly</li>
          <li>Offer small amounts of cool water</li>
          <li>Use fan to increase air circulation</li>
          <li>Transport to veterinarian immediately</li>
        </ul>
        
        <h3>First Aid Kit Essentials</h3>
        <ul>
          <li>Gauze pads and bandages</li>
          <li>Medical tape</li>
          <li>Scissors</li>
          <li>Tweezers</li>
          <li>Digital thermometer</li>
          <li>Antiseptic wipes</li>
          <li>Emergency contact numbers</li>
          <li>Muzzle (even friendly pets may bite when injured)</li>
        </ul>
      `,
      featured: true
    },
    {
      id: 5,
      title: 'Cat Behavior Understanding',
      description: 'Comprehensive guide to understanding cat body language, sounds, and behavioral patterns.',
      category: 'training',
      type: 'Guide',
      format: 'PDF',
      icon: Eye,
      pdfUrl: '/resources/cat-behavior-understanding.pdf',
      content: `
        <h1>Understanding Cat Behavior</h1>
        <h2>Decoding Your Feline Friend</h2>
        <p>Cats communicate in subtle ways. Understanding their behavior helps build a stronger bond and ensures their well-being.</p>
        
        <h3>Body Language</h3>
        
        <h4>Tail Positions</h4>
        <ul>
          <li><strong>Upright with slight curve:</strong> Happy and confident</li>
          <li><strong>Puffed up:</strong> Scared or aggressive</li>
          <li><strong>Low or tucked:</strong> Anxious or submissive</li>
          <li><strong>Twitching tip:</strong> Focused or mildly irritated</li>
          <li><strong>Thrashing:</strong> Agitated or overstimulated</li>
        </ul>
        
        <h4>Ear Positions</h4>
        <ul>
          <li><strong>Forward:</strong> Alert and interested</li>
          <li><strong>Flattened back:</strong> Scared or aggressive</li>
          <li><strong>Swiveling:</strong> Listening to sounds</li>
        </ul>
        
        <h4>Eye Expressions</h4>
        <ul>
          <li><strong>Slow blinking:</strong> Sign of trust and affection</li>
          <li><strong>Wide eyes:</strong> Alert or startled</li>
          <li><strong>Half-closed:</strong> Relaxed and content</li>
          <li><strong>Dilated pupils:</strong> Excited, scared, or aggressive</li>
        </ul>
        
        <h3>Vocalizations</h3>
        
        <h4>Common Sounds</h4>
        <ul>
          <li><strong>Purring:</strong> Usually contentment, sometimes self-soothing when stressed</li>
          <li><strong>Meowing:</strong> Communication with humans (cats rarely meow at other cats)</li>
          <li><strong>Chirping/Chattering:</strong> Excitement, often when watching birds</li>
          <li><strong>Hissing:</strong> Warning signal, feeling threatened</li>
          <li><strong>Yowling:</strong> Distress, pain, or mating calls</li>
        </ul>
        
        <h3>Common Behaviors Explained</h3>
        
        <h4>Kneading</h4>
        <p>Pushing paws against soft surfaces mimics nursing behavior. It's a sign of comfort and affection.</p>
        
        <h4>Head Butting</h4>
        <p>Cats have scent glands on their heads. Head butting marks you as part of their family.</p>
        
        <h4>Bringing "Gifts"</h4>
        <p>Dead mice or birds are offerings showing love and teaching behavior (you're seen as family).</p>
        
        <h4>Hiding in Boxes</h4>
        <p>Boxes provide security and warmth. It's natural instinct to seek enclosed spaces.</p>
        
        <h3>Signs of Stress</h3>
        <ul>
          <li>Excessive grooming or lack of grooming</li>
          <li>Changes in eating habits</li>
          <li>Hiding more than usual</li>
          <li>Inappropriate elimination</li>
          <li>Excessive vocalization</li>
          <li>Aggressive behavior</li>
        </ul>
        
        <h3>Creating a Cat-Friendly Environment</h3>
        <ul>
          <li>Provide vertical spaces (cat trees, shelves)</li>
          <li>Offer multiple hiding spots</li>
          <li>Keep litter boxes clean and accessible</li>
          <li>Provide scratching posts</li>
          <li>Maintain consistent routines</li>
          <li>Respect their need for alone time</li>
        </ul>
      `,
      featured: false
    },
    {
      id: 6,
      title: 'Pet-Proofing Your Home',
      description: 'Safety checklist and tips to make your home safe for new pets, covering hazards and precautions.',
      category: 'safety',
      type: 'Checklist',
      format: 'PDF',
      icon: Eye,
      pdfUrl: '/resources/pet-proofing-your-home.pdf',
      content: `
        <h1>Pet-Proofing Your Home</h1>
        <h2>Creating a Safe Haven</h2>
        <p>Making your home pet-safe is crucial for preventing accidents and ensuring your furry friend's well-being.</p>
        
        <h3>Kitchen Safety</h3>
        <h4>✓ Checklist:</h4>
        <ul>
          <li>☐ Secure cabinets containing cleaning supplies</li>
          <li>☐ Install childproof latches on lower cabinets</li>
          <li>☐ Remove toxic foods from accessible areas</li>
          <li>☐ Secure trash cans with tight-fitting lids</li>
          <li>☐ Store sharp objects safely</li>
          <li>☐ Unplug small appliances when not in use</li>
        </ul>
        
        <h4>Toxic Foods to Remove:</h4>
        <ul>
          <li>Chocolate</li>
          <li>Grapes and raisins</li>
          <li>Onions and garlic</li>
          <li>Xylitol (artificial sweetener)</li>
          <li>Avocado</li>
          <li>Macadamia nuts</li>
        </ul>
        
        <h3>Living Areas</h3>
        <h4>✓ Checklist:</h4>
        <ul>
          <li>☐ Secure or remove breakable decorations</li>
          <li>☐ Cover electrical cords or use cord protectors</li>
          <li>☐ Remove small objects that could be swallowed</li>
          <li>☐ Secure heavy furniture that could tip over</li>
          <li>☐ Install safety gates if needed</li>
          <li>☐ Remove or secure toxic plants</li>
        </ul>
        
        <h4>Toxic Plants to Remove:</h4>
        <ul>
          <li>Lilies (especially toxic to cats)</li>
          <li>Azaleas</li>
          <li>Oleander</li>
          <li>Sago palm</li>
          <li>Tulips</li>
          <li>Daffodils</li>
        </ul>
        
        <h3>Bathroom Safety</h3>
        <h4>✓ Checklist:</h4>
        <ul>
          <li>☐ Secure medicine cabinets</li>
          <li>☐ Keep toilet lids closed</li>
          <li>☐ Store razors and small items safely</li>
          <li>☐ Remove or secure cleaning products</li>
          <li>☐ Install non-slip mats</li>
        </ul>
        
        <h3>Bedroom Safety</h3>
        <h4>✓ Checklist:</h4>
        <ul>
          <li>☐ Secure jewelry and small accessories</li>
          <li>☐ Remove mothballs and air fresheners</li>
          <li>☐ Secure dresser drawers</li>
          <li>☐ Check for loose buttons on clothing</li>
        </ul>
        
        <h3>Garage and Basement</h3>
        <h4>✓ Checklist:</h4>
        <ul>
          <li>☐ Store antifreeze and chemicals on high shelves</li>
          <li>☐ Secure tools and sharp objects</li>
          <li>☐ Remove or secure pest control products</li>
          <li>☐ Check for gaps where pets could get stuck</li>
          <li>☐ Ensure proper ventilation</li>
        </ul>
        
        <h3>Outdoor Areas</h3>
        <h4>✓ Checklist:</h4>
        <ul>
          <li>☐ Secure fencing with no gaps</li>
          <li>☐ Remove toxic plants from yard</li>
          <li>☐ Secure pool areas</li>
          <li>☐ Check for holes or escape routes</li>
          <li>☐ Remove or secure garden chemicals</li>
          <li>☐ Provide shade and water access</li>
        </ul>
        
        <h3>Emergency Preparedness</h3>
        <h4>✓ Checklist:</h4>
        <ul>
          <li>☐ Create pet emergency kit</li>
          <li>☐ Keep emergency contact numbers accessible</li>
          <li>☐ Ensure pets have proper identification</li>
          <li>☐ Know location of nearest emergency vet</li>
          <li>☐ Keep recent photos of pets</li>
        </ul>
        
        <h3>Regular Maintenance</h3>
        <p>Pet-proofing is an ongoing process. Regularly inspect your home for new hazards and adjust as your pet grows and explores new areas.</p>
      `,
      featured: false
    },
    {
      id: 7,
      title: 'Nutrition Guidelines for Dogs',
      description: 'Detailed nutrition guide covering feeding schedules, food types, and dietary requirements by age.',
      category: 'health',
      type: 'Guide',
      format: 'PDF',
      icon: Eye,
      pdfUrl: '/resources/dog-nutrition-guidelines.pdf',
      content: `
        <h1>Dog Nutrition Guidelines</h1>
        <h2>Feeding Your Best Friend</h2>
        <p>Proper nutrition is the foundation of your dog's health and happiness. This guide covers everything you need to know about feeding your canine companion.</p>
        
        <h3>Life Stage Nutrition</h3>
        
        <h4>Puppy Nutrition (0-12 months)</h4>
        <ul>
          <li><strong>Frequency:</strong> 3-4 meals per day until 6 months, then 2 meals</li>
          <li><strong>Food Type:</strong> High-quality puppy formula with DHA for brain development</li>
          <li><strong>Portion:</strong> Follow package guidelines based on expected adult weight</li>
          <li><strong>Special Needs:</strong> Higher protein and fat content for growth</li>
        </ul>
        
        <h4>Adult Dog Nutrition (1-7 years)</h4>
        <ul>
          <li><strong>Frequency:</strong> 2 meals per day</li>
          <li><strong>Food Type:</strong> Balanced adult maintenance formula</li>
          <li><strong>Portion:</strong> Based on current weight and activity level</li>
          <li><strong>Special Needs:</strong> Maintain ideal body weight</li>
        </ul>
        
        <h4>Senior Dog Nutrition (7+ years)</h4>
        <ul>
          <li><strong>Frequency:</strong> 2 meals per day, possibly smaller portions</li>
          <li><strong>Food Type:</strong> Senior formula with joint support</li>
          <li><strong>Portion:</strong> May need reduction due to decreased activity</li>
          <li><strong>Special Needs:</strong> Easier to digest, joint support supplements</li>
        </ul>
        
        <h3>Essential Nutrients</h3>
        
        <h4>Proteins</h4>
        <p><strong>Function:</strong> Building and repairing tissues, immune function</p>
        <p><strong>Sources:</strong> Chicken, beef, fish, lamb, eggs</p>
        <p><strong>Requirements:</strong> Minimum 18% for adults, 22% for puppies</p>
        
        <h4>Fats</h4>
        <p><strong>Function:</strong> Energy, skin and coat health, vitamin absorption</p>
        <p><strong>Sources:</strong> Fish oil, chicken fat, flaxseed</p>
        <p><strong>Requirements:</strong> Minimum 5% for adults, 8% for puppies</p>
        
        <h4>Carbohydrates</h4>
        <p><strong>Function:</strong> Energy, fiber for digestion</p>
        <p><strong>Sources:</strong> Rice, sweet potatoes, oats, barley</p>
        <p><strong>Note:</strong> Not required but beneficial for energy and fiber</p>
        
        <h4>Vitamins and Minerals</h4>
        <p><strong>Function:</strong> Various metabolic processes</p>
        <p><strong>Sources:</strong> Balanced commercial foods, supplements if needed</p>
        <p><strong>Note:</strong> Over-supplementation can be harmful</p>
        
        <h3>Feeding Guidelines by Size</h3>
        
        <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px; border: 1px solid #ddd;">Dog Size</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Weight Range</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Daily Food Amount</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Feeding Frequency</th>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Small</td>
            <td style="padding: 10px; border: 1px solid #ddd;">2-10 kg</td>
            <td style="padding: 10px; border: 1px solid #ddd;">1/4 - 3/4 cup</td>
            <td style="padding: 10px; border: 1px solid #ddd;">2-3 times daily</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Medium</td>
            <td style="padding: 10px; border: 1px solid #ddd;">10-25 kg</td>
            <td style="padding: 10px; border: 1px solid #ddd;">3/4 - 1.5 cups</td>
            <td style="padding: 10px; border: 1px solid #ddd;">2 times daily</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Large</td>
            <td style="padding: 10px; border: 1px solid #ddd;">25-45 kg</td>
            <td style="padding: 10px; border: 1px solid #ddd;">1.5 - 2.5 cups</td>
            <td style="padding: 10px; border: 1px solid #ddd;">2 times daily</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Giant</td>
            <td style="padding: 10px; border: 1px solid #ddd;">45+ kg</td>
            <td style="padding: 10px; border: 1px solid #ddd;">2.5+ cups</td>
            <td style="padding: 10px; border: 1px solid #ddd;">2 times daily</td>
          </tr>
        </table>
        
        <h3>Foods to Avoid</h3>
        <div style="background-color: #ffebee; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0;">
          <h4>Toxic Foods:</h4>
          <ul>
            <li>Chocolate</li>
            <li>Grapes and raisins</li>
            <li>Onions and garlic</li>
            <li>Xylitol (artificial sweetener)</li>
            <li>Avocado</li>
            <li>Macadamia nuts</li>
            <li>Cooked bones</li>
            <li>High-fat foods</li>
          </ul>
        </div>
        
        <h3>Signs of Good Nutrition</h3>
        <ul>
          <li>Shiny, healthy coat</li>
          <li>Clear, bright eyes</li>
          <li>Healthy weight (ribs easily felt but not visible)</li>
          <li>Good energy levels</li>
          <li>Regular, firm stools</li>
          <li>Good appetite</li>
        </ul>
        
        <h3>When to Consult Your Veterinarian</h3>
        <ul>
          <li>Sudden changes in appetite</li>
          <li>Rapid weight gain or loss</li>
          <li>Digestive issues</li>
          <li>Food allergies or sensitivities</li>
          <li>Special dietary needs due to health conditions</li>
        </ul>
      `,
      featured: false
    },
    {
      id: 8,
      title: 'Grooming Basics Tutorial',
      description: 'Step-by-step video tutorials for basic pet grooming including bathing, brushing, and nail care.',
      category: 'pet-care',
      type: 'Video Tutorial',
      format: 'Video',
      icon: Play,
      youtubeUrl: 'https://youtu.be/3GIbxJJMbCw?si=kxoyTzhhuSYz7ci5',
      thumbnail: 'https://i.ytimg.com/vi/3GIbxJJMbCw/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCu44bCCGdHZmelpClg4ofH2zR_FA',
      featured: false
    },
    {
      id: 9,
      title: 'Puppy Training Fundamentals',
      description: 'Essential training techniques for puppies including house training, basic commands, and socialization.',
      category: 'training',
      type: 'Video Series',
      format: 'Video',
      icon: Play,
      youtubeUrl: 'https://youtu.be/eHbcb2EQC88?si=srAsZ-kJeCwHeOQT',
      thumbnail: 'https://i.ytimg.com/vi/eHbcb2EQC88/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDngYn7Y5bpYvm2J6vjZjPu7RZBww',
      featured: false
    },
    {
      id: 10,
      title: 'Cat Health and Wellness',
      description: 'Comprehensive guide to maintaining your cat\'s health including preventive care and common health issues.',
      category: 'health',
      type: 'Video Guide',
      format: 'Video',
      icon: Play,
      youtubeUrl: 'https://youtu.be/D-pytN9D-ow?si=I_arxnQBdZth86xZ',
      thumbnail: 'https://i.ytimg.com/vi/D-pytN9D-ow/hq720.jpg?sqp=-oaymwFBCNAFEJQDSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGGAgYChgMA8=&rs=AOn4CLAWqdfKSKlClCwZL_B2yPUhqF3Djw',
      featured: false
    }
  ];

  const emergencyContacts = [
    {
      name: 'Pet Emergency Hospital',
      phone: '+91 9484844090',
      address: 'University Road, Rajkot',
      hours: '24/7',
      type: 'Emergency'
    },
    {
      name: 'Rajkot Veterinary Clinic',
      phone: '+91 98765 22222',
      address: 'Kalawad Road, Rajkot',
      hours: '9 AM - 8 PM',
      type: 'General Care'
    },
    {
      name: 'Animal Poison Control',
      phone: '+91 9484844090',
      address: 'Hotline Service',
      hours: '24/7',
      type: 'Poison Control'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredResources = resources.filter(resource => resource.featured);

  const handleViewDocument = (resource) => {
    if (resource.format === 'Video') {
      window.open(resource.youtubeUrl, '_blank');
      toast.success(`Opening ${resource.title} on YouTube`);
    } else {
      // Create proper resource ID mapping
      const resourceIdMap = {
        1: 'new-pet-owner-guide',
        2: 'pet-vaccination-schedule',
        4: 'pet-emergency-first-aid',
        5: 'cat-behavior-understanding',
        6: 'pet-proofing-your-home',
        7: 'dog-nutrition-guidelines'
      };
      
      const resourceId = resourceIdMap[resource.id] || resource.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      navigate(`/pdf-viewer/${resourceId}`);
      toast.success(`Opening ${resource.title}`);
    }
  };

  const handleSubscribe = () => {
    const emailInput = document.getElementById('newsletter-email') as HTMLInputElement;
    const email = emailInput?.value?.trim();
    
    if (email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      
      // Save subscription to localStorage
      const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
      if (!subscriptions.includes(email)) {
        subscriptions.push({
          email,
          subscribedAt: new Date().toISOString(),
          preferences: ['pet-care', 'health', 'training', 'safety']
        });
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
      }
      
      emailInput.value = '';
      toast.success('Successfully subscribed to newsletter!');
    } else {
      toast.error('Please enter your email address');
    }
  };

  const handleEmergencyCall = (phone) => {
    try {
      window.open(`tel:${phone}`, '_self');
      toast.success(`Calling ${phone}`);
    } catch (error) {
      toast.error('Unable to make call. Please dial manually.');
      console.error('Call error:', error);
    }
  };

  const handleEmergencyLocation = (address) => {
    try {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
      toast.success('Opening location in maps');
    } catch (error) {
      toast.error('Unable to open maps. Please search manually.');
      console.error('Maps error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-500 to-secondary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">
              Pet Care Resources
            </h1>
            <p className="text-xl text-accent-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Access our comprehensive library of guides, videos, and tools to help you provide 
              the best care for your furry family members in Rajkot.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-secondary-500 text-white'
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Resources */}
            {!searchQuery && !selectedCategory && (
              <div>
                <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                  Featured Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {featuredResources.map((resource) => {
                    const IconComponent = resource.icon;
                    return (
                      <div
                        key={resource.id}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-secondary-200"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-secondary-100 p-2 rounded-lg">
                            <IconComponent className="h-6 w-6 text-secondary-500" />
                          </div>
                          <div>
                            <span className="text-xs text-secondary-500 font-semibold uppercase tracking-wider">
                              {resource.type}
                            </span>
                            <div className="text-xs text-primary-500">{resource.format}</div>
                          </div>
                        </div>
                        {resource.format === 'Video' && resource.thumbnail && (
                          <div className="relative mb-4">
                            <img
                              src={resource.thumbnail}
                              alt={resource.title}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-50 rounded-full p-3">
                                <Play className="h-8 w-8 text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                        <h3 className="font-heading font-bold text-lg text-primary-800 mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-primary-600 mb-4 leading-relaxed text-sm">
                          {resource.description}
                        </p>
                        <button 
                          onClick={() => handleViewDocument(resource)}
                          className="w-full bg-secondary-500 text-white font-semibold py-3 rounded-lg hover:bg-secondary-600 transition-colors duration-200 flex items-center justify-center"
                          aria-label={`${resource.format === 'Video' ? 'Watch' : 'View'} ${resource.title}`}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {resource.format === 'Video' ? 'Watch Video' : 'See Document'}
                          {resource.format === 'Video' && <ExternalLink className="h-4 w-4 ml-2" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Resources */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary-800 mb-6">
                {searchQuery || selectedCategory ? 'Search Results' : 'All Resources'}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {filteredResources.map((resource) => {
                  const IconComponent = resource.icon;
                  return (
                    <div
                      key={resource.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        {resource.format === 'Video' && resource.thumbnail ? (
                          <div className="relative w-24 h-16 flex-shrink-0">
                            <img
                              src={resource.thumbnail}
                              alt={resource.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-50 rounded-full p-1">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-accent-100 p-3 rounded-lg">
                            <IconComponent className="h-6 w-6 text-accent-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-heading font-bold text-lg text-primary-800">
                              {resource.title}
                            </h3>
                            <span className="text-xs text-accent-500 font-semibold bg-accent-100 px-2 py-1 rounded">
                              {resource.type}
                            </span>
                          </div>
                          <p className="text-primary-600 mb-4 leading-relaxed">
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-primary-500">{resource.format}</span>
                            <button 
                              onClick={() => handleViewDocument(resource)}
                              className="bg-accent-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors duration-200 flex items-center"
                              aria-label={`${resource.format === 'Video' ? 'Watch' : 'View'} ${resource.title}`}
                            >
                              <IconComponent className="h-4 w-4 mr-2" />
                              {resource.format === 'Video' ? 'Watch' : 'See'}
                              {resource.format === 'Video' && <ExternalLink className="h-4 w-4 ml-2" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-12 w-12 text-primary-500" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-primary-800 mb-2">
                    No resources found
                  </h3>
                  <p className="text-primary-600 mb-4">
                    Try adjusting your search terms or browse different categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                    }}
                    className="bg-secondary-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors duration-200"
                    aria-label="Clear all filters and show all resources"
                  >
                    View All Resources
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-6 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-red-500" />
                Emergency Contacts
              </h2>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="border border-primary-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-primary-800">{contact.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        contact.type === 'Emergency' 
                          ? 'bg-red-100 text-red-800' 
                          : contact.type === 'Poison Control'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {contact.type}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-primary-600">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        <button 
                          onClick={() => handleEmergencyCall(contact.phone)}
                          className="hover:text-secondary-600 transition-colors text-left"
                          aria-label={`Call ${contact.name} at ${contact.phone}`}
                        >
                          {contact.phone}
                        </button>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2" />
                        <button 
                          onClick={() => handleEmergencyLocation(contact.address)}
                          className="hover:text-secondary-600 transition-colors text-left"
                          aria-label={`View ${contact.name} location: ${contact.address}`}
                        >
                          {contact.address}
                        </button>
                      </div>
                      <div className="text-xs text-primary-500">
                        Hours: {contact.hours}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-heading font-bold text-xl text-primary-800 mb-4">
                Quick Pet Care Tips
              </h2>
              <ul className="space-y-3 text-sm text-primary-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Always keep fresh water available for your pets
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Regular grooming helps maintain your pet's health
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Exercise is essential for both physical and mental well-being
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Schedule regular veterinary check-ups
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Create a safe, comfortable space for your pet
                </li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-secondary-500 to-accent-500 rounded-xl p-6 text-white">
              <h2 className="font-heading font-bold text-xl mb-4">
                Stay Updated
              </h2>
              <p className="text-secondary-100 mb-4 text-sm">
                Get the latest pet care tips, resources, and community updates delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg text-primary-800 focus:ring-2 focus:ring-white focus:outline-none"
                  aria-label="Email address for newsletter subscription"
                  required
                />
                <button 
                  onClick={handleSubscribe}
                  className="w-full bg-white text-secondary-600 font-semibold py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;