const db = require('../database/db');

// News
async function getNews(req, res) {
  try {
    const { category, limit } = req.query;
    let query = `SELECT * FROM news WHERE is_published = 1`;
    const params = [];

    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    query += ` ORDER BY published_at DESC`;

    if (limit) {
      query += ` LIMIT ?`;
      params.push(parseInt(limit));
    }

    const newsItems = db.prepare(query).all(...params);
    return res.json({ success: true, news: newsItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch news articles.' });
  }
}

async function getNewsBySlug(req, res) {
  try {
    const article = db.prepare('SELECT * FROM news WHERE slug = ? OR id = ?').get(req.params.slug, req.params.slug);
    if (!article) {
      return res.status(404).json({ success: false, message: 'News article not found.' });
    }
    return res.json({ success: true, article });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching article details.' });
  }
}

async function createNews(req, res) {
  try {
    const { title, summary, content, category, featured_image, author_name } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Article title and content are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);

    const insert = db.prepare(`
      INSERT INTO news (title, slug, summary, content, category, featured_image, author_name)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, slug, summary || '', content, category || 'General', featured_image || '', author_name || 'ACOHST Press');

    const created = db.prepare('SELECT * FROM news WHERE id = ?').get(insert.lastInsertRowid);
    return res.status(201).json({ success: true, article: created, message: 'News article published successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error publishing news article.' });
  }
}

// Events
async function getEvents(req, res) {
  try {
    const { limit } = req.query;
    let query = `SELECT * FROM events WHERE is_published = 1 ORDER BY event_date ASC`;
    const params = [];

    if (limit) {
      query += ` LIMIT ?`;
      params.push(parseInt(limit));
    }

    const events = db.prepare(query).all(...params);
    return res.json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch events.' });
  }
}

async function createEvent(req, res) {
  try {
    const { title, location, event_date, event_time, description, category, banner_image } = req.body;
    if (!title || !event_date || !description) {
      return res.status(400).json({ success: false, message: 'Event title, date, and description are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);

    const insert = db.prepare(`
      INSERT INTO events (title, slug, location, event_date, event_time, description, category, banner_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, slug, location || 'ACOHST Auditorium', event_date, event_time || '09:00 AM', description, category || 'Academic', banner_image || '');

    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(insert.lastInsertRowid);
    return res.status(201).json({ success: true, event, message: 'Event scheduled successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating event.' });
  }
}

// Gallery
async function getGallery(req, res) {
  try {
    const { category } = req.query;
    let query = `SELECT * FROM gallery`;
    const params = [];

    if (category && category !== 'All') {
      query += ` WHERE category = ?`;
      params.push(category);
    }

    query += ` ORDER BY id DESC`;

    const gallery = db.prepare(query).all(...params);
    return res.json({ success: true, gallery });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch gallery.' });
  }
}

async function addGalleryItem(req, res) {
  try {
    const { title, category, image_url, caption } = req.body;
    if (!title || !image_url) {
      return res.status(400).json({ success: false, message: 'Title and image URL are required.' });
    }

    const insert = db.prepare(`
      INSERT INTO gallery (title, category, image_url, caption)
      VALUES (?, ?, ?, ?)
    `).run(title, category || 'Campus Life', image_url, caption || '');

    const item = db.prepare('SELECT * FROM gallery WHERE id = ?').get(insert.lastInsertRowid);
    return res.status(201).json({ success: true, item, message: 'Gallery photo added.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error adding gallery photo.' });
  }
}

// Facilities
async function getFacilities(req, res) {
  try {
    const facilities = db.prepare('SELECT * FROM facilities ORDER BY id ASC').all();
    return res.json({ success: true, facilities });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch facilities.' });
  }
}

// Management Profiles
async function getManagement(req, res) {
  try {
    const management = db.prepare('SELECT * FROM management_profiles ORDER BY order_index ASC').all();
    return res.json({ success: true, management });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch management profiles.' });
  }
}

// FAQs
async function getFAQs(req, res) {
  try {
    const faqs = db.prepare('SELECT * FROM faqs ORDER BY order_index ASC').all();
    return res.json({ success: true, faqs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch FAQs.' });
  }
}

module.exports = {
  getNews,
  getNewsBySlug,
  createNews,
  getEvents,
  createEvent,
  getGallery,
  addGalleryItem,
  getFacilities,
  getManagement,
  getFAQs
};
