/**
 * Google Sheets Integration Service for Zoomies & Snuggles
 * Provides real-time bi-directional synchronization between website and Google Sheets
 */

import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    
    // Rate limiting
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.maxRequestsPerMinute = 100;
    this.requestTimestamps = [];
    
    this.initialize();
  }

  /**
   * Initialize Google Sheets API authentication
   */
  async initialize() {
    try {
      // Service Account Authentication (Recommended for server-side)
      this.auth = new GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file'
        ],
      });

      // Alternative: OAuth 2.0 for user-based authentication
      // this.auth = new GoogleAuth({
      //   credentials: {
      //     client_id: process.env.GOOGLE_CLIENT_ID,
      //     client_secret: process.env.GOOGLE_CLIENT_SECRET,
      //     refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      //   },
      //   scopes: ['https://www.googleapis.com/auth/spreadsheets']
      // });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      console.log('Google Sheets API initialized successfully');
      await this.setupSpreadsheetStructure();
      
    } catch (error) {
      console.error('Failed to initialize Google Sheets API:', error);
      throw new Error('Google Sheets initialization failed');
    }
  }

  /**
   * Set up the spreadsheet structure with all required sheets
   */
  async setupSpreadsheetStructure() {
    const requiredSheets = [
      {
        name: 'Users',
        headers: ['ID', 'Name', 'Email', 'Phone', 'Location', 'User Type', 'Created At', 'Last Login', 'Status']
      },
      {
        name: 'Pets',
        headers: ['ID', 'Name', 'Species', 'Breed', 'Age', 'Size', 'Gender', 'Status', 'Location', 'Adoption Fee', 'Vaccinated', 'Neutered', 'Created At']
      },
      {
        name: 'Adoption Applications',
        headers: ['ID', 'Pet ID', 'Pet Name', 'Applicant ID', 'Applicant Name', 'Status', 'Priority', 'Application Date', 'Review Date', 'Decision']
      },
      {
        name: 'Foster Placements',
        headers: ['ID', 'Pet ID', 'Pet Name', 'Foster Parent ID', 'Foster Parent Name', 'Foster Type', 'Status', 'Start Date', 'Expected End Date', 'Actual End Date']
      },
      {
        name: 'Events',
        headers: ['ID', 'Title', 'Type', 'Status', 'Start Date', 'End Date', 'Location', 'Max Attendees', 'Current Attendees', 'Registration Required']
      },
      {
        name: 'Event Registrations',
        headers: ['ID', 'Event ID', 'Event Title', 'User ID', 'User Name', 'Status', 'Attendees Count', 'Registration Date', 'Payment Status']
      },
      {
        name: 'Medical Records',
        headers: ['ID', 'Pet ID', 'Pet Name', 'Record Type', 'Visit Date', 'Veterinarian', 'Diagnosis', 'Treatment', 'Cost', 'Follow Up Required']
      },
      {
        name: 'Donations',
        headers: ['ID', 'Donor Name', 'Donor Email', 'Amount', 'Currency', 'Type', 'Purpose', 'Payment Status', 'Payment Date', 'Receipt Sent']
      },
      {
        name: 'Community Posts',
        headers: ['ID', 'Author ID', 'Author Name', 'Title', 'Type', 'Category', 'Likes Count', 'Replies Count', 'Status', 'Created At']
      },
      {
        name: 'Messages',
        headers: ['ID', 'Sender ID', 'Sender Name', 'Recipient ID', 'Recipient Name', 'Subject', 'Type', 'Is Read', 'Created At']
      },
      {
        name: 'Sync Log',
        headers: ['Timestamp', 'Sheet Name', 'Operation', 'Record ID', 'Status', 'Error Message', 'Sync Direction']
      }
    ];

    try {
      // Get existing sheets
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      });

      const existingSheets = response.data.sheets.map(sheet => sheet.properties.title);

      // Create missing sheets
      for (const sheetConfig of requiredSheets) {
        if (!existingSheets.includes(sheetConfig.name)) {
          await this.createSheet(sheetConfig.name, sheetConfig.headers);
        } else {
          await this.updateSheetHeaders(sheetConfig.name, sheetConfig.headers);
        }
      }

      console.log('Spreadsheet structure setup completed');
    } catch (error) {
      console.error('Error setting up spreadsheet structure:', error);
      throw error;
    }
  }

  /**
   * Create a new sheet with headers
   */
  async createSheet(sheetName, headers) {
    try {
      // Add new sheet
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName,
                gridProperties: {
                  rowCount: 1000,
                  columnCount: headers.length
                }
              }
            }
          }]
        }
      });

      // Add headers
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers]
        }
      });

      // Format headers
      await this.formatHeaders(sheetName, headers.length);

      console.log(`Sheet '${sheetName}' created successfully`);
    } catch (error) {
      console.error(`Error creating sheet '${sheetName}':`, error);
      throw error;
    }
  }

  /**
   * Update existing sheet headers
   */
  async updateSheetHeaders(sheetName, headers) {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers]
        }
      });

      await this.formatHeaders(sheetName, headers.length);
    } catch (error) {
      console.error(`Error updating headers for sheet '${sheetName}':`, error);
    }
  }

  /**
   * Format header row
   */
  async formatHeaders(sheetName, columnCount) {
    try {
      const sheetId = await this.getSheetId(sheetName);
      
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: columnCount
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.2, green: 0.6, blue: 0.9 },
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true
                  }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)'
            }
          }]
        }
      });
    } catch (error) {
      console.error(`Error formatting headers for sheet '${sheetName}':`, error);
    }
  }

  /**
   * Get sheet ID by name
   */
  async getSheetId(sheetName) {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      });

      const sheet = response.data.sheets.find(s => s.properties.title === sheetName);
      return sheet ? sheet.properties.sheetId : null;
    } catch (error) {
      console.error(`Error getting sheet ID for '${sheetName}':`, error);
      return null;
    }
  }

  /**
   * Rate limiting check
   */
  async checkRateLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Remove timestamps older than 1 minute
    this.requestTimestamps = this.requestTimestamps.filter(timestamp => timestamp > oneMinuteAgo);
    
    if (this.requestTimestamps.length >= this.maxRequestsPerMinute) {
      const oldestRequest = Math.min(...this.requestTimestamps);
      const waitTime = 60000 - (now - oldestRequest);
      
      if (waitTime > 0) {
        console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.requestTimestamps.push(now);
  }

  /**
   * Execute API request with retry logic
   */
  async executeWithRetry(operation, ...args) {
    await this.checkRateLimit();
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await operation(...args);
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.message);
        
        if (attempt === this.retryAttempts) {
          throw error;
        }
        
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Sync user data to Google Sheets
   */
  async syncUsersToSheets(users) {
    try {
      const sheetName = 'Users';
      const values = users.map(user => [
        user.id,
        user.name,
        user.email,
        user.phone || '',
        user.location || '',
        user.user_type,
        user.created_at,
        user.last_login || '',
        user.is_active ? 'Active' : 'Inactive'
      ]);

      await this.executeWithRetry(
        this.sheets.spreadsheets.values.update.bind(this.sheets.spreadsheets.values),
        {
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A2:I${values.length + 1}`,
          valueInputOption: 'RAW',
          requestBody: { values }
        }
      );

      await this.logSync(sheetName, 'BULK_UPDATE', users.length, 'SUCCESS', 'WEBSITE_TO_SHEETS');
      console.log(`Synced ${users.length} users to Google Sheets`);
    } catch (error) {
      await this.logSync('Users', 'BULK_UPDATE', users.length, 'ERROR', 'WEBSITE_TO_SHEETS', error.message);
      throw error;
    }
  }

  /**
   * Sync pets data to Google Sheets
   */
  async syncPetsToSheets(pets) {
    try {
      const sheetName = 'Pets';
      const values = pets.map(pet => [
        pet.id,
        pet.name,
        pet.species,
        pet.breed || '',
        `${pet.age_years || 0} years ${pet.age_months || 0} months`,
        pet.size || '',
        pet.gender || '',
        pet.status,
        pet.current_location || '',
        pet.adoption_fee || 0,
        pet.vaccinated ? 'Yes' : 'No',
        pet.spayed_neutered ? 'Yes' : 'No',
        pet.created_at
      ]);

      await this.executeWithRetry(
        this.sheets.spreadsheets.values.update.bind(this.sheets.spreadsheets.values),
        {
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A2:M${values.length + 1}`,
          valueInputOption: 'RAW',
          requestBody: { values }
        }
      );

      await this.logSync(sheetName, 'BULK_UPDATE', pets.length, 'SUCCESS', 'WEBSITE_TO_SHEETS');
      console.log(`Synced ${pets.length} pets to Google Sheets`);
    } catch (error) {
      await this.logSync('Pets', 'BULK_UPDATE', pets.length, 'ERROR', 'WEBSITE_TO_SHEETS', error.message);
      throw error;
    }
  }

  /**
   * Sync adoption applications to Google Sheets
   */
  async syncAdoptionApplicationsToSheets(applications) {
    try {
      const sheetName = 'Adoption Applications';
      const values = applications.map(app => [
        app.id,
        app.pet_id,
        app.pet_name || '',
        app.applicant_id,
        app.applicant_name || '',
        app.status,
        app.priority_level,
        app.created_at,
        app.decision_date || '',
        app.decision_reason || ''
      ]);

      await this.executeWithRetry(
        this.sheets.spreadsheets.values.update.bind(this.sheets.spreadsheets.values),
        {
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A2:J${values.length + 1}`,
          valueInputOption: 'RAW',
          requestBody: { values }
        }
      );

      await this.logSync(sheetName, 'BULK_UPDATE', applications.length, 'SUCCESS', 'WEBSITE_TO_SHEETS');
      console.log(`Synced ${applications.length} adoption applications to Google Sheets`);
    } catch (error) {
      await this.logSync('Adoption Applications', 'BULK_UPDATE', applications.length, 'ERROR', 'WEBSITE_TO_SHEETS', error.message);
      throw error;
    }
  }

  /**
   * Add single record to Google Sheets
   */
  async addRecordToSheet(sheetName, data) {
    try {
      await this.executeWithRetry(
        this.sheets.spreadsheets.values.append.bind(this.sheets.spreadsheets.values),
        {
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A:Z`,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [data]
          }
        }
      );

      await this.logSync(sheetName, 'INSERT', data[0], 'SUCCESS', 'WEBSITE_TO_SHEETS');
      console.log(`Added record to ${sheetName}`);
    } catch (error) {
      await this.logSync(sheetName, 'INSERT', data[0], 'ERROR', 'WEBSITE_TO_SHEETS', error.message);
      throw error;
    }
  }

  /**
   * Update specific record in Google Sheets
   */
  async updateRecordInSheet(sheetName, recordId, data) {
    try {
      // Find the row with the matching ID
      const response = await this.executeWithRetry(
        this.sheets.spreadsheets.values.get.bind(this.sheets.spreadsheets.values),
        {
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A:A`
        }
      );

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === recordId);

      if (rowIndex === -1) {
        throw new Error(`Record with ID ${recordId} not found in ${sheetName}`);
      }

      // Update the row (rowIndex + 1 because sheets are 1-indexed)
      const range = `${sheetName}!A${rowIndex + 1}:Z${rowIndex + 1}`;
      await this.executeWithRetry(
        this.sheets.spreadsheets.values.update.bind(this.sheets.spreadsheets.values),
        {
          spreadsheetId: this.spreadsheetId,
          range: range,
          valueInputOption: 'RAW',
          requestBody: {
            values: [data]
          }
        }
      );

      await this.logSync(sheetName, 'UPDATE', recordId, 'SUCCESS', 'WEBSITE_TO_SHEETS');
      console.log(`Updated record ${recordId} in ${sheetName}`);
    } catch (error) {
      await this.logSync(sheetName, 'UPDATE', recordId, 'ERROR', 'WEBSITE_TO_SHEETS', error.message);
      throw error;
    }
  }

  /**
   * Delete record from Google Sheets
   */
  async deleteRecordFromSheet(sheetName, recordId) {
    try {
      // Find the row with the matching ID
      const response = await this.executeWithRetry(
        this.sheets.spreadsheets.values.get.bind(this.sheets.spreadsheets.values),
        {
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A:A`
        }
      );

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === recordId);

      if (rowIndex === -1) {
        console.log(`Record with ID ${recordId} not found in ${sheetName}`);
        return;
      }

      const sheetId = await this.getSheetId(sheetName);
      
      // Delete the row
      await this.executeWithRetry(
        this.sheets.spreadsheets.batchUpdate.bind(this.sheets.spreadsheets),
        {
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: sheetId,
                  dimension: 'ROWS',
                  startIndex: rowIndex,
                  endIndex: rowIndex + 1
                }
              }
            }]
          }
        }
      );

      await this.logSync(sheetName, 'DELETE', recordId, 'SUCCESS', 'WEBSITE_TO_SHEETS');
      console.log(`Deleted record ${recordId} from ${sheetName}`);
    } catch (error) {
      await this.logSync(sheetName, 'DELETE', recordId, 'ERROR', 'WEBSITE_TO_SHEETS', error.message);
      throw error;
    }
  }

  /**
   * Read data from Google Sheets
   */
  async readFromSheet(sheetName, range = null) {
    try {
      const readRange = range || `${sheetName}!A:Z`;
      
      const response = await this.executeWithRetry(
        this.sheets.spreadsheets.values.get.bind(this.sheets.spreadsheets.values),
        {
          spreadsheetId: this.spreadsheetId,
          range: readRange
        }
      );

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return [];
      }

      // Convert to objects using first row as headers
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      await this.logSync(sheetName, 'READ', data.length, 'SUCCESS', 'SHEETS_TO_WEBSITE');
      return data;
    } catch (error) {
      await this.logSync(sheetName, 'READ', 0, 'ERROR', 'SHEETS_TO_WEBSITE', error.message);
      throw error;
    }
  }

  /**
   * Detect changes in Google Sheets
   */
  async detectSheetChanges(sheetName, lastSyncTimestamp) {
    try {
      // This is a simplified change detection
      // In production, you might want to use Google Sheets API's revision history
      // or implement a more sophisticated change tracking mechanism
      
      const data = await this.readFromSheet(sheetName);
      const changes = data.filter(row => {
        const lastModified = new Date(row['Last Modified'] || row['Created At']);
        return lastModified > new Date(lastSyncTimestamp);
      });

      return changes;
    } catch (error) {
      console.error(`Error detecting changes in ${sheetName}:`, error);
      return [];
    }
  }

  /**
   * Sync changes from Google Sheets to website
   */
  async syncFromSheetsToWebsite(sheetName, lastSyncTimestamp) {
    try {
      const changes = await this.detectSheetChanges(sheetName, lastSyncTimestamp);
      
      if (changes.length === 0) {
        console.log(`No changes detected in ${sheetName}`);
        return [];
      }

      // Process changes based on sheet type
      const processedChanges = await this.processSheetChanges(sheetName, changes);
      
      await this.logSync(sheetName, 'SYNC_FROM_SHEETS', changes.length, 'SUCCESS', 'SHEETS_TO_WEBSITE');
      console.log(`Processed ${changes.length} changes from ${sheetName}`);
      
      return processedChanges;
    } catch (error) {
      await this.logSync(sheetName, 'SYNC_FROM_SHEETS', 0, 'ERROR', 'SHEETS_TO_WEBSITE', error.message);
      throw error;
    }
  }

  /**
   * Process changes based on sheet type
   */
  async processSheetChanges(sheetName, changes) {
    const processedChanges = [];

    for (const change of changes) {
      try {
        let processedChange = null;

        switch (sheetName) {
          case 'Users':
            processedChange = await this.processUserChange(change);
            break;
          case 'Pets':
            processedChange = await this.processPetChange(change);
            break;
          case 'Adoption Applications':
            processedChange = await this.processAdoptionApplicationChange(change);
            break;
          // Add more cases as needed
        }

        if (processedChange) {
          processedChanges.push(processedChange);
        }
      } catch (error) {
        console.error(`Error processing change for ${sheetName}:`, error);
        await this.logSync(sheetName, 'PROCESS_CHANGE', change.ID, 'ERROR', 'SHEETS_TO_WEBSITE', error.message);
      }
    }

    return processedChanges;
  }

  /**
   * Process user changes from sheets
   */
  async processUserChange(change) {
    return {
      type: 'user',
      action: 'update',
      data: {
        id: change.ID,
        name: change.Name,
        email: change.Email,
        phone: change.Phone,
        location: change.Location,
        user_type: change['User Type'],
        is_active: change.Status === 'Active'
      }
    };
  }

  /**
   * Process pet changes from sheets
   */
  async processPetChange(change) {
    return {
      type: 'pet',
      action: 'update',
      data: {
        id: change.ID,
        name: change.Name,
        species: change.Species,
        breed: change.Breed,
        status: change.Status,
        adoption_fee: parseFloat(change['Adoption Fee']) || 0,
        vaccinated: change.Vaccinated === 'Yes',
        spayed_neutered: change.Neutered === 'Yes'
      }
    };
  }

  /**
   * Process adoption application changes from sheets
   */
  async processAdoptionApplicationChange(change) {
    return {
      type: 'adoption_application',
      action: 'update',
      data: {
        id: change.ID,
        status: change.Status,
        priority_level: change.Priority,
        decision_reason: change.Decision
      }
    };
  }

  /**
   * Log synchronization activities
   */
  async logSync(sheetName, operation, recordId, status, direction, errorMessage = '') {
    try {
      const logData = [
        new Date().toISOString(),
        sheetName,
        operation,
        recordId.toString(),
        status,
        errorMessage,
        direction
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Sync Log!A:G',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [logData]
        }
      });
    } catch (error) {
      console.error('Error logging sync activity:', error);
    }
  }

  /**
   * Create backup of current data
   */
  async createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupSpreadsheetTitle = `Zoomies_Snuggles_Backup_${timestamp}`;

      // Create a copy of the main spreadsheet
      const response = await google.drive({ version: 'v3', auth: this.auth }).files.copy({
        fileId: this.spreadsheetId,
        requestBody: {
          name: backupSpreadsheetTitle
        }
      });

      console.log(`Backup created: ${backupSpreadsheetTitle} (ID: ${response.data.id})`);
      return response.data.id;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  /**
   * Validate data before sync
   */
  validateData(data, type) {
    const validationRules = {
      user: {
        required: ['id', 'name', 'email'],
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      pet: {
        required: ['id', 'name', 'species'],
        species: ['dog', 'cat', 'rabbit', 'bird', 'other']
      },
      adoption_application: {
        required: ['id', 'pet_id', 'applicant_id'],
        status: ['submitted', 'under_review', 'approved', 'rejected', 'withdrawn', 'completed']
      }
    };

    const rules = validationRules[type];
    if (!rules) return true;

    // Check required fields
    for (const field of rules.required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate email format
    if (rules.email && data.email && !rules.email.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validate enum values
    if (rules.species && data.species && !rules.species.includes(data.species)) {
      throw new Error(`Invalid species: ${data.species}`);
    }

    if (rules.status && data.status && !rules.status.includes(data.status)) {
      throw new Error(`Invalid status: ${data.status}`);
    }

    return true;
  }

  /**
   * Handle conflicts during bi-directional sync
   */
  async resolveConflict(websiteData, sheetData, conflictResolutionStrategy = 'latest_wins') {
    switch (conflictResolutionStrategy) {
      case 'latest_wins':
        const websiteTimestamp = new Date(websiteData.updated_at || websiteData.created_at);
        const sheetTimestamp = new Date(sheetData['Last Modified'] || sheetData['Created At']);
        return websiteTimestamp > sheetTimestamp ? websiteData : sheetData;

      case 'website_wins':
        return websiteData;

      case 'sheets_wins':
        return sheetData;

      case 'manual_review':
        // Log conflict for manual review
        await this.logConflict(websiteData, sheetData);
        return websiteData; // Default to website data

      default:
        return websiteData;
    }
  }

  /**
   * Log conflicts for manual review
   */
  async logConflict(websiteData, sheetData) {
    try {
      const conflictData = [
        new Date().toISOString(),
        'CONFLICT',
        websiteData.id || 'unknown',
        JSON.stringify(websiteData),
        JSON.stringify(sheetData),
        'PENDING_REVIEW'
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Conflicts!A:F',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [conflictData]
        }
      });
    } catch (error) {
      console.error('Error logging conflict:', error);
    }
  }

  /**
   * Get sync statistics
   */
  async getSyncStatistics(days = 7) {
    try {
      const logs = await this.readFromSheet('Sync Log');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentLogs = logs.filter(log => new Date(log.Timestamp) > cutoffDate);

      const stats = {
        totalOperations: recentLogs.length,
        successfulOperations: recentLogs.filter(log => log.Status === 'SUCCESS').length,
        failedOperations: recentLogs.filter(log => log.Status === 'ERROR').length,
        operationsByType: {},
        operationsByDirection: {}
      };

      // Group by operation type
      recentLogs.forEach(log => {
        stats.operationsByType[log.Operation] = (stats.operationsByType[log.Operation] || 0) + 1;
        stats.operationsByDirection[log['Sync Direction']] = (stats.operationsByDirection[log['Sync Direction']] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting sync statistics:', error);
      return null;
    }
  }
}

export default GoogleSheetsService;