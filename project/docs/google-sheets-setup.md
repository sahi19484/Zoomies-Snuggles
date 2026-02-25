# Google Sheets Integration Setup Guide

## 📋 **Account Setup Instructions**

### **Step 1: Google Account Configuration**
1. **Use Account**: `zoomiesnsnuggles@gmail.com`
2. **Sign in** to [Google Cloud Console](https://console.cloud.google.com/)
3. **Create New Project** or select existing project

### **Step 2: Enable Google Sheets API**
1. Navigate to **APIs & Services** → **Library**
2. Search for **"Google Sheets API"**
3. Click **Enable**
4. Also enable **"Google Drive API"** for backup functionality

### **Step 3: Create Service Account (Recommended)**
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in details:
   - **Name**: `Zoomies Snuggles Sync Service`
   - **Description**: `Service account for real-time data synchronization`
4. **Grant Roles**:
   - `Editor` (for full spreadsheet access)
   - `Service Account User`
5. **Create and Download JSON Key**
6. **Save securely** - this file contains your credentials

### **Step 4: Alternative OAuth 2.0 Setup**
If you prefer user-based authentication:
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Configure:
   - **Application Type**: Web Application
   - **Authorized Origins**: Your domain
   - **Authorized Redirect URIs**: Your callback URLs
4. **Download Client Configuration**

### **Step 5: Create Google Spreadsheet**
1. Go to [Google Sheets](https://sheets.google.com)
2. **Create New Spreadsheet**
3. **Name**: `Zoomies & Snuggles - Data Sync`
4. **Share with Service Account**:
   - Click **Share** button
   - Add service account email (from JSON key file)
   - Grant **Editor** permissions
5. **Copy Spreadsheet ID** from URL

## 🔧 **Environment Configuration**

### **Required Environment Variables**
Create `.env` file with:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=path/to/service-account-key.json

# Alternative OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here

# Sync Configuration
SYNC_INTERVAL_SECONDS=30
MAX_RETRY_ATTEMPTS=3
ENABLE_AUTO_BACKUP=true
BACKUP_FREQUENCY_HOURS=24
```

## 📊 **Spreadsheet Structure**

The integration automatically creates these sheets:

### **Core Data Sheets**
- **Users**: User accounts and profiles
- **Pets**: Pet information and status
- **Adoption Applications**: Application tracking
- **Foster Placements**: Foster care management
- **Events**: Community events
- **Event Registrations**: Event attendance
- **Medical Records**: Pet health tracking
- **Donations**: Financial contributions
- **Community Posts**: Forum discussions
- **Messages**: Direct communications

### **System Sheets**
- **Sync Log**: Synchronization activity tracking
- **Conflicts**: Data conflict resolution
- **Backups**: Backup management

## 🚀 **Implementation Usage**

### **Basic Integration**
```javascript
import syncManager from './services/syncManager.js';

// Automatic sync starts on import
// Manual sync trigger
await syncManager.triggerManualSync();

// Queue individual changes
syncManager.queueChange('user', 'create', userData);
syncManager.queueChange('pet', 'update', petData);
syncManager.queueChange('adoption_application', 'create', appData);
```

### **Event Listeners for Real-time Sync**
```javascript
// Listen for form submissions
document.addEventListener('submit', async (e) => {
  if (e.target.id === 'adoption-form') {
    const formData = new FormData(e.target);
    const applicationData = Object.fromEntries(formData);
    
    // Queue for sync
    syncManager.queueChange('adoption_application', 'create', applicationData);
  }
});

// Listen for pet status changes
function updatePetStatus(petId, newStatus) {
  const petData = { id: petId, status: newStatus };
  syncManager.queueChange('pet', 'update', petData);
}
```

## 🔒 **Security Best Practices**

### **Service Account Security**
- **Never commit** service account JSON files to version control
- **Use environment variables** for all credentials
- **Rotate keys** regularly (every 90 days)
- **Limit permissions** to minimum required

### **Data Protection**
- **Encrypt sensitive data** before syncing
- **Implement field-level permissions**
- **Regular security audits**
- **Monitor access logs**

## 📈 **Monitoring & Analytics**

### **Sync Statistics**
```javascript
// Get sync performance metrics
const stats = await syncManager.getSyncStatistics();
console.log('Sync Statistics:', stats);
/*
{
  totalOperations: 1250,
  successfulOperations: 1230,
  failedOperations: 20,
  operationsByType: {
    'INSERT': 800,
    'UPDATE': 400,
    'DELETE': 50
  },
  operationsByDirection: {
    'WEBSITE_TO_SHEETS': 900,
    'SHEETS_TO_WEBSITE': 350
  }
}
*/
```

### **Error Monitoring**
- **Sync Log Sheet**: Tracks all operations
- **Conflict Resolution**: Handles data conflicts
- **Retry Logic**: Automatic retry for failed operations
- **Alert System**: Notifications for critical failures

## 🔄 **Backup & Recovery**

### **Automatic Backups**
```javascript
// Create manual backup
const backupId = await syncManager.createBackup();
console.log('Backup created:', backupId);

// Scheduled backups run automatically every 24 hours
```

### **Data Recovery**
1. **Identify backup** from Google Drive
2. **Restore spreadsheet** from backup
3. **Update spreadsheet ID** in environment
4. **Restart sync service**

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Authentication Errors**
- **Check service account permissions**
- **Verify spreadsheet sharing settings**
- **Confirm API is enabled**

#### **Rate Limiting**
- **Built-in rate limiting** (100 requests/minute)
- **Automatic retry** with exponential backoff
- **Queue management** for high-volume operations

#### **Data Conflicts**
- **Conflict resolution strategies**:
  - `latest_wins`: Most recent timestamp wins
  - `website_wins`: Website data takes precedence
  - `sheets_wins`: Sheets data takes precedence
  - `manual_review`: Log for manual resolution

### **Debug Mode**
```javascript
// Enable detailed logging
process.env.DEBUG_SYNC = 'true';

// Check sync queue status
console.log('Queue length:', syncManager.syncQueue.length);
console.log('Processing:', syncManager.isProcessingQueue);
```

## 📋 **Testing Checklist**

### **Pre-deployment Testing**
- [ ] Service account authentication works
- [ ] Spreadsheet creation and formatting
- [ ] Bi-directional sync functionality
- [ ] Error handling and retry logic
- [ ] Rate limiting compliance
- [ ] Backup creation and restoration
- [ ] Conflict resolution strategies
- [ ] Performance under load

### **Production Monitoring**
- [ ] Sync success rates
- [ ] Error frequency and types
- [ ] Performance metrics
- [ ] Data consistency checks
- [ ] Backup integrity
- [ ] Security audit logs

## 🎯 **Performance Optimization**

### **Best Practices**
- **Batch operations** when possible
- **Use incremental sync** for large datasets
- **Implement caching** for frequently accessed data
- **Monitor API quotas** and usage
- **Optimize sheet structure** for performance

### **Scaling Considerations**
- **Horizontal scaling** with multiple service accounts
- **Data partitioning** for large datasets
- **Caching layers** for read-heavy operations
- **Queue management** for write-heavy operations

This comprehensive setup ensures reliable, secure, and performant real-time synchronization between your website and Google Sheets using the `zoomiesnsnuggles@gmail.com` account.