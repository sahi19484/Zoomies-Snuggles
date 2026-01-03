// Database models for Zoomies & Snuggles
import { query, transaction } from '../../database/config.js';

// Base model class with common functionality
class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Generic CRUD operations
  async findById(id) {
    const result = await query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findAll(conditions = {}, limit = 50, offset = 0) {
    let queryText = `SELECT * FROM ${this.tableName}`;
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');
      queryText += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }
    
    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    return result.rows;
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`);
    
    const queryText = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await query(queryText, values);
    return result.rows[0];
  }

  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`);
    
    const queryText = `
      UPDATE ${this.tableName}
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await query(queryText, [id, ...values]);
    return result.rows[0];
  }

  async delete(id) {
    const result = await query(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  async count(conditions = {}) {
    let queryText = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');
      queryText += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }
    
    const result = await query(queryText, params);
    return parseInt(result.rows[0].count);
  }
}

// User model
export class User extends BaseModel {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async createUser(userData) {
    const { password_hash, ...otherData } = userData;
    
    return await this.create({
      ...otherData,
      password_hash,
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  async updateLastLogin(id) {
    return await this.update(id, { last_login: new Date() });
  }

  async getUsersByType(userType) {
    return await this.findAll({ user_type: userType });
  }

  async searchUsers(searchTerm, userType = null) {
    let queryText = `
      SELECT * FROM users 
      WHERE (name ILIKE $1 OR email ILIKE $1)
    `;
    const params = [`%${searchTerm}%`];
    
    if (userType) {
      queryText += ' AND user_type = $2';
      params.push(userType);
    }
    
    queryText += ' ORDER BY name ASC LIMIT 20';
    
    const result = await query(queryText, params);
    return result.rows;
  }
}

// Pet model
export class Pet extends BaseModel {
  constructor() {
    super('pets');
  }

  async getAvailablePets(filters = {}) {
    let queryText = `
      SELECT p.*, 
             pi.image_url as primary_image
      FROM pets p
      LEFT JOIN pet_images pi ON p.id = pi.pet_id AND pi.is_primary = true
      WHERE p.status = 'available'
    `;
    const params = [];
    let paramIndex = 1;

    // Apply filters
    if (filters.species) {
      queryText += ` AND p.species = $${paramIndex}`;
      params.push(filters.species);
      paramIndex++;
    }

    if (filters.size) {
      queryText += ` AND p.size = $${paramIndex}`;
      params.push(filters.size);
      paramIndex++;
    }

    if (filters.age_min) {
      queryText += ` AND (p.age_years * 12 + COALESCE(p.age_months, 0)) >= $${paramIndex}`;
      params.push(filters.age_min);
      paramIndex++;
    }

    if (filters.age_max) {
      queryText += ` AND (p.age_years * 12 + COALESCE(p.age_months, 0)) <= $${paramIndex}`;
      params.push(filters.age_max);
      paramIndex++;
    }

    if (filters.good_with_kids !== undefined) {
      queryText += ` AND p.good_with_kids = $${paramIndex}`;
      params.push(filters.good_with_kids);
      paramIndex++;
    }

    queryText += ` ORDER BY p.is_featured DESC, p.created_at DESC`;

    if (filters.limit) {
      queryText += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    const result = await query(queryText, params);
    return result.rows;
  }

  async getFeaturedPets(limit = 6) {
    const result = await query(`
      SELECT p.*, pi.image_url as primary_image
      FROM pets p
      LEFT JOIN pet_images pi ON p.id = pi.pet_id AND pi.is_primary = true
      WHERE p.status = 'available' AND p.is_featured = true
      ORDER BY p.created_at DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }

  async getPetWithImages(id) {
    const result = await query(`
      SELECT p.*,
             json_agg(
               json_build_object(
                 'id', pi.id,
                 'image_url', pi.image_url,
                 'is_primary', pi.is_primary,
                 'caption', pi.caption
               ) ORDER BY pi.display_order, pi.is_primary DESC
             ) FILTER (WHERE pi.id IS NOT NULL) as images
      FROM pets p
      LEFT JOIN pet_images pi ON p.id = pi.pet_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);
    
    return result.rows[0] || null;
  }

  async updatePetStatus(id, status, notes = null) {
    const updateData = { status };
    if (notes) {
      updateData.notes = notes;
    }
    return await this.update(id, updateData);
  }

  async searchPets(searchTerm) {
    const result = await query(`
      SELECT p.*, pi.image_url as primary_image
      FROM pets p
      LEFT JOIN pet_images pi ON p.id = pi.pet_id AND pi.is_primary = true
      WHERE p.status = 'available'
      AND (p.name ILIKE $1 OR p.breed ILIKE $1 OR p.description ILIKE $1)
      ORDER BY p.is_featured DESC, p.created_at DESC
      LIMIT 20
    `, [`%${searchTerm}%`]);
    
    return result.rows;
  }
}

// Application model
export class Application extends BaseModel {
  constructor() {
    super('applications');
  }

  async getApplicationsWithDetails(filters = {}) {
    let queryText = `
      SELECT a.*,
             u.name as applicant_name,
             u.email as applicant_email,
             u.phone as applicant_phone,
             p.name as pet_name,
             p.species as pet_species,
             p.breed as pet_breed,
             pi.image_url as pet_image
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN pets p ON a.pet_id = p.id
      LEFT JOIN pet_images pi ON p.id = pi.pet_id AND pi.is_primary = true
    `;
    
    const params = [];
    const conditions = [];
    let paramIndex = 1;

    if (filters.status) {
      conditions.push(`a.status = $${paramIndex}`);
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.application_type) {
      conditions.push(`a.application_type = $${paramIndex}`);
      params.push(filters.application_type);
      paramIndex++;
    }

    if (filters.user_id) {
      conditions.push(`a.user_id = $${paramIndex}`);
      params.push(filters.user_id);
      paramIndex++;
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryText += ` ORDER BY a.priority DESC, a.submitted_at DESC`;

    const result = await query(queryText, params);
    return result.rows;
  }

  async updateApplicationStatus(id, status, reviewNotes = null, reviewerId = null) {
    const updateData = {
      status,
      decision_date: new Date()
    };

    if (reviewNotes) {
      updateData.review_notes = reviewNotes;
    }

    if (reviewerId) {
      updateData.reviewer_id = reviewerId;
    }

    return await this.update(id, updateData);
  }

  async getApplicationStats() {
    const result = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM applications
      GROUP BY status
    `);
    
    return result.rows.reduce((stats, row) => {
      stats[row.status] = parseInt(row.count);
      return stats;
    }, {});
  }
}

// Community Post model
export class CommunityPost extends BaseModel {
  constructor() {
    super('community_posts');
  }

  async getPostsWithAuthor(category = null, limit = 20, offset = 0) {
    let queryText = `
      SELECT p.*,
             u.name as author_name,
             u.profile_image_url as author_image,
             u.user_type as author_type
      FROM community_posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.status = 'active'
    `;
    
    const params = [];
    let paramIndex = 1;

    if (category) {
      queryText += ` AND p.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    queryText += ` ORDER BY p.is_pinned DESC, p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  }

  async getPostWithReplies(id) {
    const post = await query(`
      SELECT p.*,
             u.name as author_name,
             u.profile_image_url as author_image,
             u.user_type as author_type
      FROM community_posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = $1 AND p.status = 'active'
    `, [id]);

    if (post.rows.length === 0) return null;

    const replies = await query(`
      SELECT pr.*,
             u.name as author_name,
             u.profile_image_url as author_image,
             u.user_type as author_type
      FROM post_replies pr
      JOIN users u ON pr.author_id = u.id
      WHERE pr.post_id = $1
      ORDER BY pr.created_at ASC
    `, [id]);

    return {
      ...post.rows[0],
      replies: replies.rows
    };
  }

  async incrementViews(id) {
    await query(
      'UPDATE community_posts SET views_count = views_count + 1 WHERE id = $1',
      [id]
    );
  }

  async likePost(postId, userId) {
    return await transaction(async (client) => {
      // Check if already liked
      const existing = await client.query(
        'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2',
        [postId, userId]
      );

      if (existing.rows.length > 0) {
        throw new Error('Post already liked');
      }

      // Add like
      await client.query(
        'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)',
        [postId, userId]
      );

      return true;
    });
  }
}

// Event model
export class Event extends BaseModel {
  constructor() {
    super('events');
  }

  async getUpcomingEvents(limit = 10) {
    const result = await query(`
      SELECT e.*,
             u.name as organizer_name,
             (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id AND er.status = 'registered') as registered_count
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.date >= CURRENT_DATE AND e.status = 'scheduled'
      ORDER BY e.date ASC, e.start_time ASC
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  }

  async getEventWithRegistrations(id) {
    const event = await query(`
      SELECT e.*,
             u.name as organizer_name,
             u.email as organizer_email
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.id = $1
    `, [id]);

    if (event.rows.length === 0) return null;

    const registrations = await query(`
      SELECT er.*,
             u.name as attendee_name,
             u.email as attendee_email,
             u.phone as attendee_phone
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      WHERE er.event_id = $1
      ORDER BY er.registration_date ASC
    `, [id]);

    return {
      ...event.rows[0],
      registrations: registrations.rows
    };
  }

  async registerForEvent(eventId, userId, registrationData) {
    return await transaction(async (client) => {
      // Check if already registered
      const existing = await client.query(
        'SELECT id FROM event_registrations WHERE event_id = $1 AND user_id = $2',
        [eventId, userId]
      );

      if (existing.rows.length > 0) {
        throw new Error('Already registered for this event');
      }

      // Check capacity
      const event = await client.query(
        'SELECT capacity FROM events WHERE id = $1',
        [eventId]
      );

      if (event.rows.length === 0) {
        throw new Error('Event not found');
      }

      const currentRegistrations = await client.query(
        'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = $1 AND status = $2',
        [eventId, 'registered']
      );

      const registrationCount = parseInt(currentRegistrations.rows[0].count);
      if (event.rows[0].capacity && registrationCount >= event.rows[0].capacity) {
        throw new Error('Event is full');
      }

      // Create registration
      const registration = await client.query(`
        INSERT INTO event_registrations (event_id, user_id, attendee_count, emergency_contact, special_requirements)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        eventId,
        userId,
        registrationData.attendee_count || 1,
        registrationData.emergency_contact || null,
        registrationData.special_requirements || null
      ]);

      return registration.rows[0];
    });
  }
}

// Export all models
export const models = {
  User: new User(),
  Pet: new Pet(),
  Application: new Application(),
  CommunityPost: new CommunityPost(),
  Event: new Event()
};

export default models;
