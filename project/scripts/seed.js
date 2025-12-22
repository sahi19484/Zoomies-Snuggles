
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';

// Paste your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyCbGTJjVvIRW6HdLVJAUWCtUqoDZbmYNGM",
  authDomain: "zoomies-snuggles.firebaseapp.com",
  projectId: "zoomies-snuggles",
  storageBucket: "zoomies-snuggles.firebasestorage.app",
  messagingSenderId: "43405536742",
  appId: "1:43405536742:web:4a83d4c5f2f687811e7a27",
  measurementId: "G-PGVYN4Y5FC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedDatabase = async () => {
  console.log('Seeding database... This may take a moment.');

  try {
    const batch = writeBatch(db);

    // Seed each collection
    seedCollection(batch, 'users', users);
    seedCollection(batch, 'pets', pets);
    seedCollection(batch, 'adoptionApplications', adoptionApplications);
    seedCollection(batch, 'fosterApplications', fosterApplications);
    seedCollection(batch, 'forumCategories', forumCategories);
    seedCollection(batch, 'upcomingEvents', upcomingEvents);
    seedCollection(batch, 'communityPosts', communityPosts);
    seedCollection(batch, 'resourceCategories', resourceCategories);
    seedCollection(batch, 'resources', resources);
    seedCollection(batch, 'emergencyContacts', emergencyContacts);
    seedCollection(batch, 'resourceContents', Object.values(resourceContents));

    await batch.commit();

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // We should exit the process to avoid hanging
    process.exit(0);
  }
};

const seedCollection = (batch, collectionName, data) => {
  const collectionRef = collection(db, collectionName);
  data.forEach(item => {
    const docRef = doc(collectionRef); // Create a new doc with an auto-generated ID
    batch.set(docRef, item);
  });
};



// --- COMPREHENSIVE DATA TO BE SEEDED ---

// 1. Users
const users = [
  { name: 'Priya Patel', email: 'priya.patel@example.com', userType: 'Adopter', joinDate: '2023-10-15T00:00:00Z', profilePic: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg' },
  { name: 'Arjun Shah', email: 'arjun.shah@example.com', userType: 'Foster Parent', joinDate: '2023-09-22T00:00:00Z', profilePic: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
  { name: 'Meera Joshi', email: 'meera.joshi@example.com', userType: 'Volunteer', joinDate: '2024-01-05T00:00:00Z', profilePic: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' }
];

// 2. Pets
const pets = [
    { name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', age: 2, gender: 'Male', size: 'Large', location: 'Rajkot', status: 'Available', photos: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'], medicalHistory: ['Vaccinated', 'Neutered'], personality: ['Friendly', 'Active'], description: 'Buddy is a happy and energetic Golden Retriever looking for a loving home.' },
    { name: 'Whiskers', species: 'Cat', breed: 'Siamese', age: 1, gender: 'Female', size: 'Medium', location: 'Rajkot', status: 'Fostered', photos: ['https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg'], medicalHistory: ['Vaccinated', 'Spayed'], personality: ['Playful', 'Affectionate'], description: 'Whiskers is a curious and loving Siamese cat.' },
    { name: 'Rocky', species: 'Dog', breed: 'German Shepherd', age: 3, gender: 'Male', size: 'Large', location: 'Rajkot', status: 'Available', photos: ['https://images.pexels.com/photos/33053/dog-young-dog-small-dog-maltese.jpg'], medicalHistory: ['Vaccinated'], personality: ['Loyal', 'Intelligent'], description: 'Rocky is a brave and smart German Shepherd.' }
];

// 3. Adoption Applications
const adoptionApplications = [
    { userId: 'priya.patel@example.com', petId: 'Buddy', applicationDate: '2024-02-01T00:00:00Z', status: 'Pending', notes: 'Has a large yard and experience with dogs.' }
];

// 4. Foster Applications
const fosterApplications = [
    { userId: 'arjun.shah@example.com', applicationDate: '2023-11-10T00:00:00Z', fosterType: 'Medical', status: 'Approved', experience: 'Fostered 3 dogs previously.' }
];

// 5. Forum Categories
const forumCategories = [
    { icon: 'MessageCircle', title: 'General Discussion', description: 'Share experiences and connect with other pet parents', posts: 342, lastActivity: '2 minutes ago' },
    { icon: 'Award', title: 'Success Stories', description: 'Celebrate adoption and foster success stories', posts: 128, lastActivity: '1 hour ago' },
    { icon: 'Users', title: 'Foster Parents', description: 'Support and advice for foster families', posts: 89, lastActivity: '3 hours ago' },
    { icon: 'TrendingUp', title: 'Training Tips', description: 'Pet training advice and behavioral guidance', posts: 156, lastActivity: '30 minutes ago' }
];

// 6. Upcoming Events
const upcomingEvents = [
    { date: '15', month: 'Dec', title: 'Pet Adoption Drive', location: 'Rajkot Municipal Garden', time: '10:00 AM - 4:00 PM', attendees: 45 },
    { date: '22', month: 'Dec', title: 'Foster Family Meet & Greet', location: 'Community Center, University Road', time: '5:00 PM - 7:00 PM', attendees: 23 },
];

// 7. Community Posts
const communityPosts = [
  { author: 'Priya Patel', avatar: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg', title: 'Tips for first-time dog owners in Rajkot?', content: 'I just adopted my first dog and would love some advice from experienced pet parents in our community. What are the essential things I should know?', category: 'General Discussion', replies: 12, likes: 24, timeAgo: '2 hours ago', image: null },
  { author: 'Arjun Shah', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', title: 'My rescue cat Whiskers found her forever home! 🎉', content: 'After 3 months of fostering, Whiskers has been adopted by the most wonderful family. Seeing her happy and settled brings so much joy to my heart!', category: 'Success Stories', replies: 8, likes: 45, timeAgo: '4 hours ago', image: 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg' }
];

// 8. Resource Categories
const resourceCategories = [
    { id: 'pet-care', name: 'Pet Care', icon: 'Heart' },
    { id: 'health', name: 'Health & Medical', icon: 'Stethoscope' },
    { id: 'training', name: 'Training & Behavior', icon: 'GraduationCap' },
    { id: 'safety', name: 'Safety & Emergency', icon: 'Shield' }
];

// 9. Resources
const resources = [
    { slug: 'new-pet-owner-guide', title: 'New Pet Owner Guide', description: 'Complete guide for first-time pet owners covering basics of pet care, feeding, and bonding.', category: 'pet-care', type: 'Guide', format: 'PDF', icon: 'Eye', featured: true },
    { slug: 'pet-vaccination-schedule', title: 'Pet Vaccination Schedule', description: 'Essential vaccination timeline for dogs and cats in India with local veterinary recommendations.', category: 'health', type: 'Chart', format: 'PDF', icon: 'Eye', featured: true },
    { slug: 'pet-emergency-first-aid', title: 'Pet Emergency First Aid', description: 'Critical first aid steps for common pet emergencies. Essential knowledge for every pet owner.', category: 'safety', type: 'Emergency Guide', format: 'PDF', icon: 'Eye', featured: true },
    { slug: 'cat-behavior-understanding', title: 'Cat Behavior Understanding', description: 'Comprehensive guide to understanding cat body language, sounds, and behavioral patterns.', category: 'training', type: 'Guide', format: 'PDF', icon: 'Eye', featured: false },
];

// 10. Emergency Contacts
const emergencyContacts = [
    { name: 'Pet Emergency Hospital', phone: '+91 9484844090', address: 'University Road, Rajkot', hours: '24/7', type: 'Emergency' },
    { name: 'Rajkot Veterinary Clinic', phone: '+91 98765 22222', address: 'Kalawad Road, Rajkot', hours: '9 AM - 8 PM', type: 'General Care' },
    { name: 'Animal Poison Control', phone: '+91 9484844090', address: 'Hotline Service', hours: '24/7', type: 'Poison Control' }
];

// 11. Resource Contents (with full HTML)
const resourceContents = {
    'new-pet-owner-guide': {
        slug: 'new-pet-owner-guide',
        htmlContent: `<div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">...</div>`
    },
    'pet-emergency-first-aid': {
        slug: 'pet-emergency-first-aid',
        htmlContent: `<div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">...</div>`
    },
    'cat-behavior-understanding': {
        slug: 'cat-behavior-understanding',
        htmlContent: `<div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">...</div>`
    },
    'dog-nutrition-guidelines': {
        slug: 'dog-nutrition-guidelines',
        htmlContent: `<div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">...</div>`
    },
    'pet-vaccination-schedule': {
        slug: 'pet-vaccination-schedule',
        htmlContent: `<div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">...</div>`
    },
    'pet-proofing-your-home': {
        slug: 'pet-proofing-your-home',
        htmlContent: `<div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;">...</div>`
    }
};

seedDatabase();
