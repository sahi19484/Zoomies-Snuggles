# Security Considerations

## 🔒 Security Overview

The Zoomies & Snuggles platform implements comprehensive security measures to protect user data, prevent unauthorized access, and ensure compliance with data protection regulations.

## 🛡️ Authentication and Authorization

### 1. User Authentication

#### Supabase Authentication
```typescript
// Secure authentication implementation
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password
});

// Password requirements enforced
const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false // Optional for user experience
};
```

#### Session Management
```typescript
// Secure session handling
const { data: { session } } = await supabase.auth.getSession();

// Automatic token refresh
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    // Update application state with new token
    updateAuthToken(session?.access_token);
  }
});

// Session timeout configuration
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
```

### 2. Authorization and Access Control

#### Row Level Security (RLS)
```sql
-- Users can only access their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Pet access control
CREATE POLICY "Anyone can read available pets" ON pets
  FOR SELECT USING (status = 'available');

CREATE POLICY "Organizations can manage their pets" ON pets
  FOR ALL USING (
    source_organization_id IN (
      SELECT organization_id FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );
```

#### Role-Based Access Control
```typescript
// User role definitions
type UserRole = 'adopter' | 'foster' | 'volunteer' | 'organization' | 'admin';

// Permission checking
const hasPermission = (user: User, action: string, resource: string): boolean => {
  const permissions = {
    admin: ['*'], // Full access
    organization: ['pets:create', 'pets:update', 'applications:review'],
    foster: ['applications:create', 'placements:view'],
    adopter: ['applications:create', 'pets:view'],
    volunteer: ['events:view', 'community:participate']
  };

  const userPermissions = permissions[user.userType] || [];
  return userPermissions.includes('*') || userPermissions.includes(`${resource}:${action}`);
};

// Protected route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
}> = ({ children, requiredRole, requiredPermission }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user.userType !== requiredRole) {
    return <AccessDenied />;
  }

  if (requiredPermission && !hasPermission(user, ...requiredPermission.split(':'))) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
```

## 🔐 Data Protection

### 1. Input Validation and Sanitization

#### Client-Side Validation
```typescript
// Comprehensive input validation
const validateUserInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  name: (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  },

  petAge: (age: string): boolean => {
    const ageRegex = /^\d{1,2}\s?(years?|months?|weeks?)$/i;
    return ageRegex.test(age);
  }
};

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};
```

#### Server-Side Validation (Database Constraints)
```sql
-- Database-level validation
ALTER TABLE users ADD CONSTRAINT valid_email 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE users ADD CONSTRAINT valid_phone 
  CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');

ALTER TABLE pets ADD CONSTRAINT valid_age 
  CHECK (age_years >= 0 AND age_years <= 30);

-- Prevent SQL injection with parameterized queries
-- Supabase automatically handles this with their client library
```

### 2. Data Encryption

#### Data in Transit
```typescript
// HTTPS enforcement
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'zoomies-snuggles-web'
    }
  }
});

// Content Security Policy
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://images.pexels.com https://i.ytimg.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  frame-ancestors 'none';
`;
```

#### Data at Rest
```sql
-- Database encryption (handled by Supabase)
-- All data is encrypted at rest using AES-256
-- Automatic backup encryption
-- Point-in-time recovery with encryption

-- Sensitive data handling
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  -- Sensitive fields are handled with care
  emergency_contact_phone TEXT, -- Not exposed in logs
  references TEXT, -- Encrypted in application layer if needed
  background_check_status VARCHAR(20) DEFAULT 'pending'
);
```

### 3. Privacy Protection

#### Data Minimization
```typescript
// Only collect necessary data
interface UserRegistration {
  name: string;
  email: string;
  password: string;
  userType: UserRole;
  // Optional fields
  phone?: string;
  location?: string;
}

// Data retention policies
const DATA_RETENTION_POLICIES = {
  userAccounts: '7 years after account deletion',
  adoptionApplications: '7 years for legal compliance',
  communityPosts: '3 years or until user deletion',
  auditLogs: '2 years for security monitoring',
  sessionData: '30 days after last activity'
};
```

#### GDPR Compliance
```typescript
// Data subject rights implementation
const gdprCompliance = {
  // Right to access
  exportUserData: async (userId: string) => {
    const userData = await supabase
      .from('users')
      .select(`
        *,
        user_profiles(*),
        adoption_applications(*),
        community_posts(*),
        messages(*)
      `)
      .eq('id', userId)
      .single();
    
    return userData;
  },

  // Right to rectification
  updateUserData: async (userId: string, updates: Partial<User>) => {
    return await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
  },

  // Right to erasure
  deleteUserData: async (userId: string) => {
    // Anonymize instead of delete for legal compliance
    await supabase
      .from('users')
      .update({
        name: 'Deleted User',
        email: `deleted-${userId}@example.com`,
        phone: null,
        is_active: false,
        deleted_at: new Date().toISOString()
      })
      .eq('id', userId);
  },

  // Right to data portability
  exportDataPortable: async (userId: string) => {
    const data = await exportUserData(userId);
    return JSON.stringify(data, null, 2);
  }
};
```

## 🚨 Security Monitoring and Incident Response

### 1. Audit Logging
```sql
-- Comprehensive audit trail
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  user_id UUID REFERENCES users(id),
  user_ip_address INET,
  user_agent TEXT,
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  reason TEXT,
  session_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_values, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### 2. Error Handling and Logging
```typescript
// Secure error handling
const handleError = (error: Error, context: string) => {
  // Log error details for debugging (server-side only)
  if (typeof window === 'undefined') {
    console.error(`[${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context
    });
  }

  // Return user-friendly error messages
  const userFriendlyErrors: Record<string, string> = {
    'PGRST116': 'No data found',
    '23505': 'This information already exists',
    '23503': 'Invalid reference data',
    '42501': 'Access denied',
    'auth/user-not-found': 'Invalid login credentials',
    'auth/wrong-password': 'Invalid login credentials'
  };

  const userMessage = userFriendlyErrors[error.message] || 'An unexpected error occurred';
  
  return {
    success: false,
    message: userMessage,
    // Never expose sensitive error details to users
    details: import.meta.env.DEV ? error.message : undefined
  };
};

// Rate limiting for API calls
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (identifier: string, limit: number = 100, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const userLimit = rateLimiter.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimiter.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
};
```

### 3. Security Headers
```typescript
// Security headers configuration
const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https://images.pexels.com https://i.ytimg.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim(),
  
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};
```

## 🔍 Vulnerability Management

### 1. Dependency Security
```bash
# Regular security audits
npm audit
npm audit fix

# Automated dependency updates
npm update

# Security-focused package management
npm install --package-lock-only
```

### 2. Code Security Scanning
```typescript
// ESLint security rules
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:security/recommended'
  ],
  plugins: ['security'],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error'
  }
};
```

### 3. Regular Security Reviews
```typescript
// Security checklist for code reviews
const securityChecklist = {
  authentication: [
    'Are authentication tokens properly validated?',
    'Is session management secure?',
    'Are password requirements enforced?'
  ],
  authorization: [
    'Are user permissions properly checked?',
    'Is access control implemented correctly?',
    'Are admin functions protected?'
  ],
  dataValidation: [
    'Is all user input validated?',
    'Are SQL injection attacks prevented?',
    'Is XSS protection in place?'
  ],
  dataProtection: [
    'Is sensitive data encrypted?',
    'Are API keys properly secured?',
    'Is PII handled correctly?'
  ],
  errorHandling: [
    'Do error messages avoid exposing sensitive information?',
    'Is logging implemented securely?',
    'Are stack traces hidden in production?'
  ]
};
```

## 🚨 Incident Response Plan

### 1. Security Incident Classification
```typescript
enum SecurityIncidentLevel {
  LOW = 'low',           // Minor security issue, no immediate threat
  MEDIUM = 'medium',     // Potential security risk, requires attention
  HIGH = 'high',         // Active security threat, immediate action needed
  CRITICAL = 'critical'  // Severe security breach, emergency response
}

interface SecurityIncident {
  id: string;
  level: SecurityIncidentLevel;
  description: string;
  affectedSystems: string[];
  detectedAt: Date;
  reportedBy: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  actions: string[];
}
```

### 2. Response Procedures
```typescript
const incidentResponse = {
  // Immediate response (0-1 hour)
  immediate: [
    'Assess the severity and scope of the incident',
    'Contain the threat if possible',
    'Notify the security team',
    'Document initial findings'
  ],

  // Short-term response (1-24 hours)
  shortTerm: [
    'Investigate the root cause',
    'Implement temporary fixes',
    'Notify affected users if necessary',
    'Monitor for additional threats'
  ],

  // Long-term response (1-7 days)
  longTerm: [
    'Implement permanent fixes',
    'Update security policies',
    'Conduct post-incident review',
    'Update incident response procedures'
  ]
};
```

## 📋 Security Compliance

### 1. Data Protection Regulations
- **GDPR Compliance**: Right to access, rectification, erasure, and data portability
- **CCPA Compliance**: California Consumer Privacy Act requirements
- **Local Regulations**: Compliance with Indian data protection laws

### 2. Security Standards
- **OWASP Top 10**: Protection against common web vulnerabilities
- **ISO 27001**: Information security management standards
- **SOC 2**: Security, availability, and confidentiality controls

### 3. Regular Security Assessments
```typescript
const securityAssessments = {
  monthly: [
    'Dependency vulnerability scan',
    'Access control review',
    'Log analysis and monitoring'
  ],
  quarterly: [
    'Penetration testing',
    'Security policy review',
    'Incident response drill'
  ],
  annually: [
    'Comprehensive security audit',
    'Compliance assessment',
    'Security training update'
  ]
};
```

This comprehensive security framework ensures the Zoomies & Snuggles platform maintains the highest standards of security, protecting user data and maintaining trust within the pet adoption community.