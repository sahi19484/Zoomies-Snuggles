# Testing Guidelines

## 🧪 Testing Strategy Overview

The Zoomies & Snuggles platform follows a comprehensive testing strategy to ensure reliability, performance, and user satisfaction across all features.

## 🎯 Testing Pyramid

```
                    /\
                   /  \
                  / E2E \
                 /______\
                /        \
               /Integration\
              /__________\
             /            \
            /     Unit      \
           /________________\
```

### Testing Levels
1. **Unit Tests (70%)** - Individual component and function testing
2. **Integration Tests (20%)** - Component interaction and API testing
3. **End-to-End Tests (10%)** - Full user workflow testing

## 🛠️ Testing Tools and Setup

### Core Testing Dependencies
```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "vitest": "^0.34.0",
    "jsdom": "^22.1.0",
    "cypress": "^13.0.0",
    "msw": "^1.3.0"
  }
}
```

### Test Configuration

#### Vitest Configuration (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  }
});
```

#### Test Setup (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

// Mock Service Worker setup
beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

// Mock environment variables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

## 🔬 Unit Testing

### Component Testing Best Practices

#### 1. Testing React Components
```typescript
// src/components/__tests__/PetCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PetCard } from '../PetCard';
import { mockPet } from '../../test/mocks/data';

const renderPetCard = (props = {}) => {
  return render(
    <BrowserRouter>
      <PetCard pet={mockPet} {...props} />
    </BrowserRouter>
  );
};

describe('PetCard', () => {
  it('renders pet information correctly', () => {
    renderPetCard();
    
    expect(screen.getByText(mockPet.name)).toBeInTheDocument();
    expect(screen.getByText(mockPet.breed)).toBeInTheDocument();
    expect(screen.getByText(mockPet.age)).toBeInTheDocument();
    expect(screen.getByAltText(mockPet.name)).toBeInTheDocument();
  });

  it('calls onAdopt when adopt button is clicked', async () => {
    const mockOnAdopt = vi.fn();
    renderPetCard({ onAdopt: mockOnAdopt });
    
    const adoptButton = screen.getByRole('button', { name: /adopt/i });
    fireEvent.click(adoptButton);
    
    expect(mockOnAdopt).toHaveBeenCalledWith(mockPet.id);
  });

  it('shows urgent badge for urgent pets', () => {
    renderPetCard({ pet: { ...mockPet, urgent: true } });
    
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });
});
```

#### 2. Testing Custom Hooks
```typescript
// src/hooks/__tests__/usePets.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { usePets } from '../usePets';
import { server } from '../../test/mocks/server';
import { rest } from 'msw';

describe('usePets', () => {
  it('fetches pets successfully', async () => {
    const { result } = renderHook(() => usePets());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.pets).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    server.use(
      rest.get('/api/pets', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    const { result } = renderHook(() => usePets());
    
    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch pets');
    });
  });
});
```

#### 3. Testing Utility Functions
```typescript
// src/utils/__tests__/validation.test.ts
import { validateEmail, validatePhone, validatePetAge } from '../validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('validates Indian phone numbers', () => {
      expect(validatePhone('+91 9876543210')).toBe(true);
      expect(validatePhone('9876543210')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abcdefghij')).toBe(false);
    });
  });
});
```

### Testing Patterns

#### 1. Arrange-Act-Assert Pattern
```typescript
it('should update pet status when adoption is completed', () => {
  // Arrange
  const pet = createMockPet({ status: 'available' });
  const mockUpdatePet = vi.fn();
  
  // Act
  adoptPet(pet.id, mockUpdatePet);
  
  // Assert
  expect(mockUpdatePet).toHaveBeenCalledWith(pet.id, { status: 'adopted' });
});
```

#### 2. Test Data Builders
```typescript
// src/test/builders/petBuilder.ts
export class PetBuilder {
  private pet: Partial<Pet> = {
    id: '1',
    name: 'Test Pet',
    species: 'dog',
    breed: 'Test Breed',
    age: '2 years',
    status: 'available'
  };

  withName(name: string): PetBuilder {
    this.pet.name = name;
    return this;
  }

  withStatus(status: PetStatus): PetBuilder {
    this.pet.status = status;
    return this;
  }

  urgent(): PetBuilder {
    this.pet.urgent = true;
    return this;
  }

  build(): Pet {
    return this.pet as Pet;
  }
}

// Usage in tests
const urgentPet = new PetBuilder()
  .withName('Urgent Pet')
  .urgent()
  .build();
```

## 🔗 Integration Testing

### API Integration Tests
```typescript
// src/services/__tests__/petService.test.ts
import { petService } from '../petService';
import { server } from '../../test/mocks/server';
import { rest } from 'msw';

describe('Pet Service', () => {
  it('fetches pets with filters', async () => {
    const filters = { species: 'dog', size: 'large' };
    const pets = await petService.getPets(filters);
    
    expect(pets).toHaveLength(2);
    expect(pets.every(pet => pet.species === 'dog')).toBe(true);
  });

  it('handles network errors gracefully', async () => {
    server.use(
      rest.get('/api/pets', (req, res, ctx) => {
        return res.networkError('Network error');
      })
    );

    await expect(petService.getPets()).rejects.toThrow('Network error');
  });
});
```

### Component Integration Tests
```typescript
// src/pages/__tests__/AdoptionPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdoptionPage } from '../AdoptionPage';

const renderAdoptionPage = () => {
  return render(
    <BrowserRouter>
      <AdoptionPage />
    </BrowserRouter>
  );
};

describe('AdoptionPage Integration', () => {
  it('filters pets by species', async () => {
    renderAdoptionPage();
    
    // Wait for pets to load
    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });
    
    // Apply filter
    const speciesFilter = screen.getByLabelText('Species');
    fireEvent.change(speciesFilter, { target: { value: 'cat' } });
    
    // Verify filtered results
    await waitFor(() => {
      expect(screen.queryByText('Buddy')).not.toBeInTheDocument();
      expect(screen.getByText('Whiskers')).toBeInTheDocument();
    });
  });
});
```

## 🎭 End-to-End Testing

### Cypress Configuration (`cypress.config.ts`)
```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  }
});
```

### E2E Test Examples

#### 1. User Authentication Flow
```typescript
// cypress/e2e/auth.cy.ts
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('allows user to sign up and sign in', () => {
    // Navigate to auth page
    cy.get('[data-cy=sign-in-button]').click();
    cy.url().should('include', '/auth');

    // Switch to sign up
    cy.get('[data-cy=sign-up-tab]').click();

    // Fill registration form
    cy.get('[data-cy=name-input]').type('Test User');
    cy.get('[data-cy=email-input]').type('test@example.com');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=user-type-select]').select('adopter');

    // Submit form
    cy.get('[data-cy=submit-button]').click();

    // Verify successful registration
    cy.url().should('include', '/profile');
    cy.get('[data-cy=welcome-message]').should('contain', 'Test User');
  });
});
```

#### 2. Pet Adoption Workflow
```typescript
// cypress/e2e/adoption.cy.ts
describe('Pet Adoption Workflow', () => {
  beforeEach(() => {
    cy.login('adopter@example.com', 'password123');
    cy.visit('/adoption');
  });

  it('completes full adoption process', () => {
    // Browse pets
    cy.get('[data-cy=pet-card]').should('have.length.greaterThan', 0);

    // Filter pets
    cy.get('[data-cy=species-filter]').select('dog');
    cy.get('[data-cy=pet-card]').should('contain', 'Dog');

    // View pet details
    cy.get('[data-cy=pet-card]').first().click();
    cy.url().should('include', '/adoption/');

    // Start adoption process
    cy.get('[data-cy=adopt-button]').click();

    // Fill adoption application
    cy.get('[data-cy=reason-textarea]').type('Looking for a family companion');
    cy.get('[data-cy=experience-textarea]').type('Had dogs for 10 years');
    cy.get('[data-cy=living-situation-textarea]').type('House with large yard');

    // Submit application
    cy.get('[data-cy=submit-application]').click();

    // Verify success
    cy.get('[data-cy=success-message]').should('be.visible');
    cy.url().should('include', '/profile');
  });
});
```

#### 3. Community Features
```typescript
// cypress/e2e/community.cy.ts
describe('Community Features', () => {
  beforeEach(() => {
    cy.login('user@example.com', 'password123');
    cy.visit('/community');
  });

  it('creates and interacts with forum posts', () => {
    // Create new post
    cy.get('[data-cy=create-post-button]').click();
    cy.get('[data-cy=post-title]').type('Tips for new dog owners');
    cy.get('[data-cy=post-content]').type('Here are some helpful tips...');
    cy.get('[data-cy=post-category]').select('training_tips');
    cy.get('[data-cy=submit-post]').click();

    // Verify post appears
    cy.get('[data-cy=post-title]').should('contain', 'Tips for new dog owners');

    // Like post
    cy.get('[data-cy=like-button]').click();
    cy.get('[data-cy=like-count]').should('contain', '1');

    // Add reply
    cy.get('[data-cy=reply-button]').click();
    cy.get('[data-cy=reply-content]').type('Great advice! Thanks for sharing.');
    cy.get('[data-cy=submit-reply]').click();

    // Verify reply appears
    cy.get('[data-cy=post-reply]').should('contain', 'Great advice!');
  });
});
```

### Custom Cypress Commands
```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createPet(petData: Partial<Pet>): Chainable<void>;
      seedDatabase(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/auth');
    cy.get('[data-cy=email-input]').type(email);
    cy.get('[data-cy=password-input]').type(password);
    cy.get('[data-cy=submit-button]').click();
    cy.url().should('not.include', '/auth');
  });
});

Cypress.Commands.add('createPet', (petData: Partial<Pet>) => {
  cy.request({
    method: 'POST',
    url: '/api/pets',
    body: petData,
    headers: {
      'Authorization': `Bearer ${Cypress.env('authToken')}`
    }
  });
});
```

## 🎯 Testing Best Practices

### 1. Test Organization
```
src/
├── components/
│   ├── __tests__/
│   │   ├── PetCard.test.tsx
│   │   └── Navbar.test.tsx
│   └── PetCard.tsx
├── hooks/
│   ├── __tests__/
│   │   └── usePets.test.ts
│   └── usePets.ts
└── test/
    ├── mocks/
    ├── builders/
    └── setup.ts
```

### 2. Test Naming Conventions
```typescript
// Good: Descriptive test names
describe('PetCard Component', () => {
  it('displays pet information correctly', () => {});
  it('calls onAdopt when adopt button is clicked', () => {});
  it('shows urgent badge for urgent pets', () => {});
});

// Avoid: Generic test names
describe('PetCard', () => {
  it('works', () => {});
  it('test 1', () => {});
});
```

### 3. Mock Data Management
```typescript
// src/test/mocks/data.ts
export const mockPet: Pet = {
  id: '1',
  name: 'Buddy',
  species: 'dog',
  breed: 'Golden Retriever',
  age: '2 years',
  size: 'large',
  gender: 'male',
  status: 'available',
  description: 'Friendly and energetic',
  vaccinated: true,
  neutered: true,
  urgent: false
};

export const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  userType: 'adopter',
  location: 'Rajkot, Gujarat'
};
```

## 📊 Test Coverage and Reporting

### Coverage Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/main.tsx'
      ]
    }
  }
});
```

### Running Tests
```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - run: npm ci
    - run: npm run test:coverage
    - run: npm run test:e2e
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

## 🐛 Debugging Tests

### 1. Debug Unit Tests
```typescript
// Add debug statements
it('should handle user interaction', () => {
  render(<Component />);
  screen.debug(); // Prints current DOM
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  screen.debug(); // Prints DOM after interaction
});
```

### 2. Debug E2E Tests
```typescript
// cypress/e2e/debug.cy.ts
it('debugs the application state', () => {
  cy.visit('/adoption');
  cy.pause(); // Pauses execution for inspection
  cy.debug(); // Opens debugger
  cy.get('[data-cy=pet-card]').debug(); // Debugs specific element
});
```

This comprehensive testing strategy ensures the Zoomies & Snuggles platform maintains high quality, reliability, and user satisfaction across all features and user interactions.