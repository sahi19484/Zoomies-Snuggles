/**
 * Sync Manager for coordinating real-time synchronization
 * between website and Google Sheets
 */

import GoogleSheetsService from './googleSheetsService.js';

class SyncManager {
  constructor() {
    this.sheetsService = new GoogleSheetsService();
    this.syncInterval = 30000; // 30 seconds
    this.isRunning = false;
    this.lastSyncTimestamp = {};
    this.syncQueue = [];
    this.isProcessingQueue = false;
    
    // Initialize last sync timestamps for each sheet
    this.initializeTimestamps();
    
    // Start automatic sync
    this.startAutoSync();
  }

  /**
   * Initialize last sync timestamps
   */
  initializeTimestamps() {
    const sheets = [
      'Users', 'Pets', 'Adoption Applications', 'Foster Placements',
      'Events', 'Event Registrations', 'Medical Records', 'Donations',
      'Community Posts', 'Messages'
    ];

    sheets.forEach(sheet => {
      this.lastSyncTimestamp[sheet] = localStorage.getItem(`lastSync_${sheet}`) || new Date(0).toISOString();
    });
  }

  /**
   * Start automatic synchronization
   */
  startAutoSync() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Starting automatic sync...');
    
    // Initial sync
    this.performFullSync();
    
    // Set up interval for regular syncing
    this.syncIntervalId = setInterval(() => {
      this.performIncrementalSync();
    }, this.syncInterval);
  }

  /**
   * Stop automatic synchronization
   */
  stopAutoSync() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
    }
    console.log('Automatic sync stopped');
  }

  /**
   * Perform full synchronization
   */
  async performFullSync() {
    try {
      console.log('Starting full synchronization...');
      
      // Sync all data from website to sheets
      await this.syncWebsiteToSheets();
      
      // Sync changes from sheets to website
      await this.syncSheetsToWebsite();
      
      console.log('Full synchronization completed');
    } catch (error) {
      console.error('Error during full sync:', error);
    }
  }

  /**
   * Perform incremental synchronization
   */
  async performIncrementalSync() {
    try {
      // Only sync changes since last sync
      await this.syncSheetsToWebsite();
      
      // Process any queued changes from website
      await this.processQueuedChanges();
      
    } catch (error) {
      console.error('Error during incremental sync:', error);
    }
  }

  /**
   * Sync website data to Google Sheets
   */
  async syncWebsiteToSheets() {
    try {
      // Get data from localStorage (simulating database)
      const users = this.getUsersFromStorage();
      const pets = this.getPetsFromStorage();
      const applications = this.getApplicationsFromStorage();
      const events = this.getEventsFromStorage();
      const registrations = this.getRegistrationsFromStorage();

      // Sync each data type
      if (users.length > 0) {
        await this.sheetsService.syncUsersToSheets(users);
      }
      
      if (pets.length > 0) {
        await this.sheetsService.syncPetsToSheets(pets);
      }
      
      if (applications.length > 0) {
        await this.sheetsService.syncAdoptionApplicationsToSheets(applications);
      }

      // Update sync timestamps
      this.updateSyncTimestamp('Users');
      this.updateSyncTimestamp('Pets');
      this.updateSyncTimestamp('Adoption Applications');
      
    } catch (error) {
      console.error('Error syncing website to sheets:', error);
      throw error;
    }
  }

  /**
   * Sync Google Sheets data to website
   */
  async syncSheetsToWebsite() {
    try {
      const sheets = ['Users', 'Pets', 'Adoption Applications', 'Events'];
      
      for (const sheetName of sheets) {
        const lastSync = this.lastSyncTimestamp[sheetName];
        const changes = await this.sheetsService.syncFromSheetsToWebsite(sheetName, lastSync);
        
        if (changes.length > 0) {
          await this.applyChangesToWebsite(changes);
          this.updateSyncTimestamp(sheetName);
        }
      }
      
    } catch (error) {
      console.error('Error syncing sheets to website:', error);
      throw error;
    }
  }

  /**
   * Apply changes from sheets to website
   */
  async applyChangesToWebsite(changes) {
    for (const change of changes) {
      try {
        switch (change.type) {
          case 'user':
            await this.updateUserInStorage(change.data);
            break;
          case 'pet':
            await this.updatePetInStorage(change.data);
            break;
          case 'adoption_application':
            await this.updateApplicationInStorage(change.data);
            break;
        }
      } catch (error) {
        console.error(`Error applying change for ${change.type}:`, error);
      }
    }
  }

  /**
   * Queue a change for synchronization
   */
  queueChange(type, action, data) {
    const change = {
      id: Date.now(),
      type,
      action,
      data,
      timestamp: new Date().toISOString(),
      retries: 0
    };
    
    this.syncQueue.push(change);
    
    // Process queue if not already processing
    if (!this.isProcessingQueue) {
      this.processQueuedChanges();
    }
  }

  /**
   * Process queued changes
   */
  async processQueuedChanges() {
    if (this.isProcessingQueue || this.syncQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.syncQueue.length > 0) {
      const change = this.syncQueue.shift();
      
      try {
        await this.processQueuedChange(change);
      } catch (error) {
        console.error('Error processing queued change:', error);
        
        // Retry logic
        change.retries++;
        if (change.retries < 3) {
          this.syncQueue.push(change);
        } else {
          console.error('Max retries reached for change:', change);
        }
      }
    }
    
    this.isProcessingQueue = false;
  }

  /**
   * Process a single queued change
   */
  async processQueuedChange(change) {
    const { type, action, data } = change;
    
    switch (type) {
      case 'user':
        await this.syncUserChange(action, data);
        break;
      case 'pet':
        await this.syncPetChange(action, data);
        break;
      case 'adoption_application':
        await this.syncApplicationChange(action, data);
        break;
      case 'event_registration':
        await this.syncRegistrationChange(action, data);
        break;
    }
  }

  /**
   * Sync user changes to sheets
   */
  async syncUserChange(action, userData) {
    const sheetData = [
      userData.id,
      userData.name,
      userData.email,
      userData.phone || '',
      userData.location || '',
      userData.userType,
      userData.createdAt || new Date().toISOString(),
      userData.lastLogin || '',
      userData.isActive ? 'Active' : 'Inactive'
    ];

    switch (action) {
      case 'create':
      case 'update':
        await this.sheetsService.addRecordToSheet('Users', sheetData);
        break;
      case 'delete':
        await this.sheetsService.deleteRecordFromSheet('Users', userData.id);
        break;
    }
  }

  /**
   * Sync pet changes to sheets
   */
  async syncPetChange(action, petData) {
    const sheetData = [
      petData.id,
      petData.name,
      petData.species,
      petData.breed || '',
      petData.age || '',
      petData.size || '',
      petData.gender || '',
      petData.status,
      petData.location || '',
      petData.adoptionFee || 0,
      petData.vaccinated ? 'Yes' : 'No',
      petData.neutered ? 'Yes' : 'No',
      petData.createdAt || new Date().toISOString()
    ];

    switch (action) {
      case 'create':
      case 'update':
        await this.sheetsService.addRecordToSheet('Pets', sheetData);
        break;
      case 'delete':
        await this.sheetsService.deleteRecordFromSheet('Pets', petData.id);
        break;
    }
  }

  /**
   * Sync adoption application changes to sheets
   */
  async syncApplicationChange(action, appData) {
    const sheetData = [
      appData.id,
      appData.petId,
      appData.petName || '',
      appData.applicantId,
      appData.applicantName || '',
      appData.status,
      appData.priority || 'normal',
      appData.submittedAt || new Date().toISOString(),
      appData.reviewDate || '',
      appData.decision || ''
    ];

    switch (action) {
      case 'create':
      case 'update':
        await this.sheetsService.addRecordToSheet('Adoption Applications', sheetData);
        break;
      case 'delete':
        await this.sheetsService.deleteRecordFromSheet('Adoption Applications', appData.id);
        break;
    }
  }

  /**
   * Sync event registration changes to sheets
   */
  async syncRegistrationChange(action, regData) {
    const sheetData = [
      regData.id,
      regData.eventId,
      regData.eventTitle || '',
      regData.userId,
      regData.userName || '',
      regData.status || 'registered',
      regData.attendees || 1,
      regData.registeredAt || new Date().toISOString(),
      regData.paymentStatus || 'not_required'
    ];

    switch (action) {
      case 'create':
      case 'update':
        await this.sheetsService.addRecordToSheet('Event Registrations', sheetData);
        break;
      case 'delete':
        await this.sheetsService.deleteRecordFromSheet('Event Registrations', regData.id);
        break;
    }
  }

  /**
   * Update sync timestamp
   */
  updateSyncTimestamp(sheetName) {
    const timestamp = new Date().toISOString();
    this.lastSyncTimestamp[sheetName] = timestamp;
    localStorage.setItem(`lastSync_${sheetName}`, timestamp);
  }

  /**
   * Get users from localStorage
   */
  getUsersFromStorage() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? [JSON.parse(currentUser)] : [];
  }

  /**
   * Get pets from localStorage
   */
  getPetsFromStorage() {
    const petSubmissions = localStorage.getItem('petSubmissions');
    return petSubmissions ? JSON.parse(petSubmissions) : [];
  }

  /**
   * Get applications from localStorage
   */
  getApplicationsFromStorage() {
    const adoptionApps = localStorage.getItem('adoptionApplications') || '[]';
    const fosterApps = localStorage.getItem('fosterApplications') || '[]';
    return [...JSON.parse(adoptionApps), ...JSON.parse(fosterApps)];
  }

  /**
   * Get events from localStorage
   */
  getEventsFromStorage() {
    // Return mock events data since we don't store events in localStorage
    return [];
  }

  /**
   * Get registrations from localStorage
   */
  getRegistrationsFromStorage() {
    const registrations = localStorage.getItem('eventRegistrations');
    return registrations ? JSON.parse(registrations) : [];
  }

  /**
   * Update user in localStorage
   */
  async updateUserInStorage(userData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email === userData.email) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  }

  /**
   * Update pet in localStorage
   */
  async updatePetInStorage(petData) {
    const pets = JSON.parse(localStorage.getItem('petSubmissions') || '[]');
    const index = pets.findIndex(pet => pet.id === petData.id);
    
    if (index !== -1) {
      pets[index] = { ...pets[index], ...petData };
      localStorage.setItem('petSubmissions', JSON.stringify(pets));
    }
  }

  /**
   * Update application in localStorage
   */
  async updateApplicationInStorage(appData) {
    const adoptionApps = JSON.parse(localStorage.getItem('adoptionApplications') || '[]');
    const fosterApps = JSON.parse(localStorage.getItem('fosterApplications') || '[]');
    
    let updated = false;
    
    // Check adoption applications
    const adoptionIndex = adoptionApps.findIndex(app => app.id === appData.id);
    if (adoptionIndex !== -1) {
      adoptionApps[adoptionIndex] = { ...adoptionApps[adoptionIndex], ...appData };
      localStorage.setItem('adoptionApplications', JSON.stringify(adoptionApps));
      updated = true;
    }
    
    // Check foster applications
    if (!updated) {
      const fosterIndex = fosterApps.findIndex(app => app.id === appData.id);
      if (fosterIndex !== -1) {
        fosterApps[fosterIndex] = { ...fosterApps[fosterIndex], ...appData };
        localStorage.setItem('fosterApplications', JSON.stringify(fosterApps));
      }
    }
  }

  /**
   * Get sync statistics
   */
  async getSyncStatistics() {
    return await this.sheetsService.getSyncStatistics();
  }

  /**
   * Create backup
   */
  async createBackup() {
    return await this.sheetsService.createBackup();
  }

  /**
   * Manual sync trigger
   */
  async triggerManualSync() {
    console.log('Manual sync triggered');
    await this.performFullSync();
  }
}

// Export singleton instance
const syncManager = new SyncManager();
export default syncManager;