# Troubleshooting Guide

## 🔧 Common Issues and Solutions

This guide covers the most frequently encountered issues when developing, deploying, or using the Zoomies & Snuggles platform.

## 🚀 Development Issues

### 1. Installation and Setup Problems

#### Node.js Version Issues
```bash
# Error: Node version not supported
Error: The engine "node" is incompatible with this module

# Solution: Use Node.js 18 or higher
nvm install 18
nvm use 18
npm install
```

#### Package Installation Failures
```bash
# Error: npm install fails
npm ERR! peer dep missing

# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### Port Already in Use
```bash
# Error: Port 5173 is already in use
Error: listen EADDRINUSE: address already in use :::5173

# Solution: Kill process or use different port
lsof -ti:5173 | xargs kill -9
# Or
npm run dev -- --port 3000
```

### 2. Build and Compilation Issues

#### TypeScript Errors
```typescript
// Error: Property does not exist on type
Property 'userType' does not exist on type 'User'

// Solution: Update type definitions
interface User {
  id: string;
  name: string;
  email: string;
  userType: 'adopter' | 'foster' | 'volunteer' | 'organization'; // Add missing property
}
```

#### Import/Export Issues
```typescript
// Error: Module not found
Cannot resolve module './components/PetCard'

// Solution: Check file paths and extensions
import { PetCard } from './components/PetCard'; // Correct
import { PetCard } from './components/PetCard.tsx'; // Remove extension
```

#### CSS/Tailwind Issues
```bash
# Error: Tailwind classes not working
Class 'bg-primary-500' not found

# Solution: Check Tailwind configuration
# Ensure tailwind.config.js includes all source files
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
```

### 3. Runtime Errors

#### React Hooks Errors
```typescript
// Error: Hooks can only be called inside function components
Invalid hook call

// Solution: Ensure hooks are used correctly
const MyComponent: React.FC = () => {
  const [state, setState] = useState(null); // ✅ Correct
  return <div>{state}</div>;
};

// ❌ Incorrect - hook outside component
const [globalState, setGlobalState] = useState(null);
```

#### State Management Issues
```typescript
// Error: Cannot read property of undefined
Cannot read property 'name' of undefined

// Solution: Add proper null checks
const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  if (!user) {
    return <div>Loading...</div>; // ✅ Handle loading state
  }
  
  return <div>{user.name}</div>; // Safe to access
};
```

## 🗄️ Database and API Issues

### 1. Supabase Connection Problems

#### Authentication Errors
```javascript
// Error: Invalid API key
AuthApiError: Invalid API key

// Solution: Check environment variables
console.log(import.meta.env.VITE_SUPABASE_URL); // Should not be undefined
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY); // Should not be undefined

// Verify .env file exists and has correct format
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Row Level Security Issues
```sql
-- Error: Permission denied for table
permission denied for table users

-- Solution: Check RLS policies
-- Ensure user can access their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Or temporarily disable RLS for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

#### Database Connection Timeout
```javascript
// Error: Connection timeout
FetchError: request timeout

// Solution: Check network and increase timeout
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' },
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});
```

### 2. Data Fetching Issues

#### Infinite Loading States
```typescript
// Problem: useEffect runs infinitely
useEffect(() => {
  fetchPets();
}, [fetchPets]); // ❌ fetchPets changes on every render

// Solution: Use useCallback or remove dependency
const fetchPets = useCallback(async () => {
  // fetch logic
}, []);

useEffect(() => {
  fetchPets();
}, [fetchPets]); // ✅ Now stable
```

#### Stale Data Issues
```typescript
// Problem: Data not updating after mutations
const { data: pets } = usePets();

// Solution: Invalidate queries after mutations
const adoptPet = async (petId: string) => {
  await petService.adoptPet(petId);
  // Refetch or update cache
  queryClient.invalidateQueries(['pets']);
};
```

## 🎨 UI and Styling Issues

### 1. Responsive Design Problems

#### Mobile Layout Issues
```css
/* Problem: Layout breaks on mobile */
.container {
  width: 1200px; /* ❌ Fixed width */
}

/* Solution: Use responsive units */
.container {
  width: 100%;
  max-width: 1200px; /* ✅ Responsive */
  padding: 0 1rem;
}
```

#### Tailwind Responsive Classes
```jsx
// Problem: Not responsive
<div className="grid-cols-4 gap-4">

// Solution: Use responsive prefixes
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

### 2. Component Rendering Issues

#### Hydration Mismatches
```typescript
// Problem: Server/client mismatch
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return null; // Avoid hydration mismatch
}
```

#### Key Prop Warnings
```jsx
// Problem: Missing keys in lists
{pets.map(pet => (
  <PetCard pet={pet} /> // ❌ Missing key
))}

// Solution: Add unique keys
{pets.map(pet => (
  <PetCard key={pet.id} pet={pet} /> // ✅ Unique key
))}
```

## 🔐 Authentication and Authorization Issues

### 1. Login/Logout Problems

#### Session Persistence Issues
```javascript
// Problem: User logged out on refresh
// Solution: Check session persistence
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  // User is logged in
  setUser(session.user);
}

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    setUser(session.user);
  } else if (event === 'SIGNED_OUT') {
    setUser(null);
  }
});
```

#### Token Expiration
```javascript
// Problem: API calls fail with expired tokens
// Solution: Handle token refresh
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed');
    // Update API headers if needed
  }
});
```

### 2. Permission Issues

#### Unauthorized Access
```typescript
// Problem: Users accessing restricted content
// Solution: Add proper guards
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};
```

## 🚀 Deployment Issues

### 1. Build Failures

#### Environment Variables Not Found
```bash
# Problem: Build fails due to missing env vars
ReferenceError: process is not defined

# Solution: Ensure all env vars are prefixed with VITE_
# .env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# And set in deployment platform (Netlify, Vercel, etc.)
```

#### Import Path Issues
```typescript
// Problem: Imports work locally but fail in production
import { utils } from '../../../utils'; // ❌ Relative path issues

// Solution: Use absolute imports or path mapping
import { utils } from '@/utils'; // ✅ Absolute import

// Configure in vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 2. Runtime Issues in Production

#### Routing Problems
```
# Problem: 404 errors on page refresh
# Solution: Add _redirects file for SPA
# public/_redirects
/*    /index.html   200
```

#### Performance Issues
```typescript
// Problem: Large bundle size
// Solution: Implement code splitting
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
);
```

## 📱 Mobile and Cross-Browser Issues

### 1. Mobile-Specific Problems

#### Touch Events Not Working
```typescript
// Problem: Click events don't work on mobile
// Solution: Add touch event handlers
const handleInteraction = (e: React.TouchEvent | React.MouseEvent) => {
  e.preventDefault();
  // Handle interaction
};

<button
  onClick={handleInteraction}
  onTouchStart={handleInteraction}
>
  Click me
</button>
```

#### Viewport Issues
```html
<!-- Problem: Layout not responsive on mobile -->
<!-- Solution: Add proper viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 2. Browser Compatibility

#### Safari-Specific Issues
```css
/* Problem: Flexbox issues in Safari */
.flex-container {
  display: flex;
  flex-direction: column;
  min-height: 0; /* Fix for Safari */
}
```

#### Internet Explorer Support
```javascript
// Problem: Modern JS features not supported
// Solution: Add polyfills or transpilation
// Or show unsupported browser message
const isIE = /MSIE|Trident/.test(navigator.userAgent);
if (isIE) {
  alert('Please use a modern browser');
}
```

## 🔍 Debugging Tools and Techniques

### 1. React Developer Tools
```typescript
// Add display names for better debugging
const PetCard: React.FC<PetCardProps> = (props) => {
  // Component logic
};

PetCard.displayName = 'PetCard';
```

### 2. Console Debugging
```typescript
// Structured logging
const debugLog = (component: string, action: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.group(`[${component}] ${action}`);
    if (data) console.log(data);
    console.groupEnd();
  }
};

// Usage
debugLog('PetCard', 'Rendering', { pet, user });
```

### 3. Network Debugging
```typescript
// Log API calls
const apiCall = async (url: string, options?: RequestInit) => {
  console.log(`API Call: ${url}`, options);
  
  try {
    const response = await fetch(url, options);
    console.log(`API Response: ${url}`, response.status);
    return response;
  } catch (error) {
    console.error(`API Error: ${url}`, error);
    throw error;
  }
};
```

## 📞 Getting Help

### 1. Error Reporting Template
When reporting issues, include:

```
**Environment:**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96.0]
- Node.js: [e.g., 18.0.0]
- npm: [e.g., 8.0.0]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
A clear description of what you expected to happen.

**Actual Behavior:**
A clear description of what actually happened.

**Screenshots:**
If applicable, add screenshots to help explain your problem.

**Console Errors:**
```
[Paste any console errors here]
```

**Additional Context:**
Add any other context about the problem here.
```

### 2. Useful Resources
- **React Documentation**: https://react.dev/
- **Supabase Documentation**: https://supabase.com/docs
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Vite Documentation**: https://vitejs.dev/guide/
- **TypeScript Documentation**: https://www.typescriptlang.org/docs/

### 3. Community Support
- **GitHub Issues**: Report bugs and feature requests
- **Discord Community**: Real-time help and discussions
- **Stack Overflow**: Technical questions with `zoomies-snuggles` tag

This troubleshooting guide should help resolve most common issues encountered while working with the Zoomies & Snuggles platform. If you encounter an issue not covered here, please refer to the error reporting template above.