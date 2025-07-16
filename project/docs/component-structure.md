# Component Structure and Hierarchy

## 🏗️ Component Architecture Overview

The Zoomies & Snuggles platform follows a hierarchical component structure with clear separation of concerns, reusability, and maintainability.

## 📁 Directory Structure

```
src/
├── components/
│   ├── home/              # Homepage-specific components
│   ├── ui/                # Reusable UI components
│   ├── Navbar.tsx         # Global navigation
│   └── Footer.tsx         # Global footer
├── pages/                 # Route-level page components
├── services/              # API and external service integrations
└── types/                 # TypeScript type definitions
```

## 🔄 Component Hierarchy

### Root Application Structure
```
App
├── Router (React Router DOM)
├── Navbar
├── Main Content (Routes)
│   ├── Home
│   ├── Adoption
│   ├── Foster
│   ├── Community
│   ├── Resources
│   ├── About
│   ├── Contact
│   ├── Auth
│   └── Profile
├── Footer
└── Toast (Global notifications)
```

## 🏠 Homepage Components (`src/components/home/`)

### Hero Component
```typescript
// src/components/home/Hero.tsx
interface HeroProps {
  // No props - self-contained component
}

Features:
- Call-to-action buttons
- Trust indicators
- Responsive design
- Animated elements
```

### StatsSection Component
```typescript
// src/components/home/StatsSection.tsx
interface StatsSectionProps {
  // No props - fetches data internally
}

Features:
- Real-time statistics display
- Animated counters
- Responsive grid layout
- Icon integration
```

### FeaturedPets Component
```typescript
// src/components/home/FeaturedPets.tsx
interface FeaturedPetsProps {
  // No props - manages own data fetching
}

Features:
- Pet card display
- Navigation to detailed views
- Responsive grid
- Loading states
```

### HowItWorks Component
```typescript
// src/components/home/HowItWorks.tsx
interface HowItWorksProps {
  // No props - static content with dynamic styling
}

Features:
- Step-by-step process visualization
- Progressive disclosure
- Icon-based navigation
- Mobile-optimized layout
```

### SuccessStories Component
```typescript
// src/components/home/SuccessStories.tsx
interface SuccessStoriesProps {
  // No props - manages testimonial data
}

Features:
- Testimonial carousel
- User avatars and pet images
- Call-to-action integration
- Social proof elements
```

### CallToAction Component
```typescript
// src/components/home/CallToAction.tsx
interface CallToActionProps {
  // No props - static promotional content
}

Features:
- Multiple action buttons
- Gradient backgrounds
- Contact information display
- Responsive design
```

## 🎨 UI Components (`src/components/ui/`)

### Toast Component
```typescript
// src/components/ui/Toast.tsx
interface ToastProps {
  // Uses react-hot-toast configuration
}

Features:
- Global notification system
- Multiple toast types (success, error, info)
- Auto-dismiss functionality
- Custom styling
```

### Banner Component
```typescript
// src/components/ui/Banner.tsx
interface BannerProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
  className?: string;
}

Features:
- Contextual messaging
- Dismissible alerts
- Icon integration
- Consistent styling
```

### ConfirmationDialog Component
```typescript
// src/components/ui/ConfirmationDialog.tsx
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
}

Features:
- Modal dialog functionality
- Customizable actions
- Type-based styling
- Accessibility support
```

## 🌐 Global Components

### Navbar Component
```typescript
// src/components/Navbar.tsx
interface NavbarProps {
  // No props - manages global navigation state
}

Features:
- Responsive navigation menu
- User authentication state
- Mobile hamburger menu
- Dynamic user menu
- Route highlighting
```

### Footer Component
```typescript
// src/components/Footer.tsx
interface FooterProps {
  // No props - static footer content
}

Features:
- Contact information
- Quick links
- Social media links
- Legal page navigation
- Responsive layout
```

## 📄 Page Components (`src/pages/`)

### Home Page
```typescript
// src/pages/Home.tsx
interface HomeProps {
  // No props - composes homepage sections
}

Composition:
- Hero
- StatsSection
- FeaturedPets
- HowItWorks
- SuccessStories
- CallToAction
```

### Adoption Page
```typescript
// src/pages/Adoption.tsx
interface AdoptionProps {
  // No props - manages pet browsing state
}

Features:
- Pet filtering and search
- Grid/list view toggle
- Pagination
- Pet detail navigation
- Add pet functionality
```

### Foster Page
```typescript
// src/pages/Foster.tsx
interface FosterProps {
  // No props - foster program information
}

Features:
- Foster type selection
- Application process
- Requirements checklist
- Event integration
- Contact information
```

### Community Page
```typescript
// src/pages/Community.tsx
interface CommunityProps {
  // No props - community hub functionality
}

Features:
- Forum categories
- Post creation
- Event listings
- Community statistics
- User interactions
```

### Resources Page
```typescript
// src/pages/Resources.tsx
interface ResourcesProps {
  // No props - resource library management
}

Features:
- Resource categorization
- Search functionality
- PDF viewer integration
- Download tracking
- Emergency contacts
```

### Auth Page
```typescript
// src/pages/Auth.tsx
interface AuthProps {
  // No props - authentication management
}

Features:
- Login/register toggle
- User type selection
- Form validation
- Social login integration
- Password recovery
```

### Profile Page
```typescript
// src/pages/Profile.tsx
interface ProfileProps {
  // No props - user profile management
}

Features:
- Profile editing
- Activity history
- Statistics display
- Quick actions
- Account settings
```

## 🔧 Component Patterns

### 1. Container/Presentational Pattern
```typescript
// Container Component (manages state and logic)
const AdoptionContainer: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  
  // Logic and state management
  
  return <AdoptionView pets={pets} filters={filters} onFilterChange={setFilters} />;
};

// Presentational Component (renders UI)
interface AdoptionViewProps {
  pets: Pet[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const AdoptionView: React.FC<AdoptionViewProps> = ({ pets, filters, onFilterChange }) => {
  // Pure rendering logic
  return <div>{/* UI elements */}</div>;
};
```

### 2. Compound Component Pattern
```typescript
// Main component with sub-components
const PetCard: React.FC<PetCardProps> & {
  Image: React.FC<PetCardImageProps>;
  Info: React.FC<PetCardInfoProps>;
  Actions: React.FC<PetCardActionsProps>;
} = ({ children }) => {
  return <div className="pet-card">{children}</div>;
};

PetCard.Image = ({ src, alt }) => <img src={src} alt={alt} />;
PetCard.Info = ({ name, breed, age }) => <div>{/* Info display */}</div>;
PetCard.Actions = ({ onAdopt, onFavorite }) => <div>{/* Action buttons */}</div>;

// Usage
<PetCard>
  <PetCard.Image src={pet.image} alt={pet.name} />
  <PetCard.Info name={pet.name} breed={pet.breed} age={pet.age} />
  <PetCard.Actions onAdopt={handleAdopt} onFavorite={handleFavorite} />
</PetCard>
```

### 3. Custom Hooks Pattern
```typescript
// Custom hook for pet data management
const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await petService.getAllPets();
      setPets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return { pets, loading, error, refetch: fetchPets };
};

// Usage in component
const AdoptionPage: React.FC = () => {
  const { pets, loading, error } = usePets();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return <PetGrid pets={pets} />;
};
```

## 🎯 Component Best Practices

### 1. Single Responsibility Principle
Each component should have one clear purpose and responsibility.

### 2. Props Interface Design
```typescript
// Good: Clear, specific props
interface PetCardProps {
  pet: Pet;
  onAdopt: (petId: string) => void;
  onFavorite: (petId: string) => void;
  showActions?: boolean;
}

// Avoid: Generic or unclear props
interface PetCardProps {
  data: any;
  onClick: () => void;
  config: object;
}
```

### 3. Error Boundaries
```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### 4. Performance Optimization
```typescript
// Memoization for expensive calculations
const ExpensiveComponent: React.FC<Props> = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveDataProcessing(data);
  }, [data]);

  return <div>{processedData}</div>;
});

// Callback memoization
const ParentComponent: React.FC = () => {
  const handleClick = useCallback((id: string) => {
    // Handle click logic
  }, []);

  return <ChildComponent onClick={handleClick} />;
};
```

## 📱 Responsive Component Design

### Breakpoint-Aware Components
```typescript
const ResponsiveGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
};
```

### Mobile-First Approach
```typescript
const MobileOptimizedComponent: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
};
```

This component structure ensures maintainability, reusability, and scalability while providing a clear development experience for the Zoomies & Snuggles platform.