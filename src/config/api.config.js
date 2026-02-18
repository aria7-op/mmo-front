/**
 * API Configuration
 * Centralized configuration for backend API endpoints and base URLs
 */

// Environment detection
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Base URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (isDevelopment
    ? 'https://khwanzay.school/bak'  // Use full backend URL in development
    : 'https://khwanzay.school/bak');  // Use direct backend URL in production

export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ||
  (isDevelopment
    ? 'https://khwanzay.school/bak/'  // Use full backend URL in development
    : 'https://khwanzay.school/bak/');  // Use /bak path in production for consistency

// API Prefix (already included in base URL, but kept for reference)
export const API_PREFIX = '/bak';

/**
 * API Endpoints
 * All endpoint paths as constants for type safety and easy refactoring
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: '/admin/auth/login',
  AUTH_ME: '/admin/auth/me',
  AUTH_LOGOUT: '/admin/auth/logout',
  DASHBOARD_STATS: '/dashboard/stats',
  SESSION_ACTIVITY: '/session/activity',

  // News
  NEWS: '/news',
  NEWS_BY_ID: (id) => `/news/${id}`,
  NEWS_VIEW: (id) => `/news/${id}/view`,
  NEWS_LIKE: (id) => `/news/${id}/like`,
  NEWS_SHARE: (id) => `/news/${id}/share`,

  // Events
  EVENTS: '/events',
  EVENTS_BY_ID: (id) => `/events/${id}`,
  EVENTS_VIEW: (id) => `/events/${id}/view`,
  EVENTS_LIKE: (id) => `/events/${id}/like`,
  EVENTS_SHARE: (id) => `/events/${id}/share`,

  // Articles
  ARTICLES: 'articles',
  ARTICLES_BY_ID: (id) => `articles/${id}`,

  // Programs
  PROGRAMS: 'programs',
  PROGRAMS_BY_ID: (id) => `programs/${id}`,
  PROGRAMS_BY_SLUG: (slug) => `programs/slug/${slug}`,
  PROGRAMS_STATUS: (id) => `programs/${id}/status`,

  // Focus Areas
  FOCUS_AREAS: 'focus-areas',
  FOCUS_AREAS_BY_ID: (id) => `focus-areas/${id}`,
  FOCUS_AREAS_BY_SLUG: (slug) => `focus-areas/slug/${slug}`,
  FOCUS_AREAS_STATUS: (id) => `focus-areas/${id}/status`,
  FOCUS_AREAS_BACKFILL_STATUS: 'focus-areas/backfill-status',

  // Provinces
  PROVINCES: 'provinces',
  PROVINCES_BY_ID: (id) => `provinces/${id}`,

  // Team Members
  TEAM_MEMBERS: 'team-members',
  TEAM_MEMBERS_BY_ID: (id) => `team-members/${id}`,

  // Volunteers
  VOLUNTEERS: 'volunteers',
  VOLUNTEERS_BY_ID: (id) => `volunteers/${id}`,

  // Contact
  CONTACT: 'contact',
  CONTACT_BY_ID: (id) => `contact/${id}`,
  CONTACT_STATUS: (id) => `contact/${id}/status`,
  CONTACT_RESPONSE: (id) => `contact/${id}/response`,

  // Donations
  DONATE: 'donate',
  DONATE_BY_ID: (id) => `donate/${id}`,
  DONATION_CONFIG: 'donation-config',
  STRIPE_PAYMENT_INTENT: 'stripe/create-payment-intent',
  STRIPE_PAYMENT_STATUS: (paymentIntentId) => `stripe/payment-status/${paymentIntentId}`,
  STRIPE_EVENTS: 'stripe/events',
  STRIPE_EVENTS_SYNC: 'stripe/events/sync',

  // Jobs & Opportunities
  OPPORTUNITIES: 'opportunities',
  OPPORTUNITIES_BY_ID: (id) => `opportunities/${id}`,
  OPPORTUNITY_APPLY: (id) => `opportunity/${id}/apply`,
  JOBS_APPLY: 'jobs/apply',
  OPPORTUNITY_APPLICATIONS: 'opportunity-applications',
  OPPORTUNITY_APPLICATION_STATUS: (id) => `opportunity-applications/${id}/status`,

  // Resources
  SUCCESS_STORIES: 'success-stories',
  SUCCESS_STORIES_BY_ID: (id) => `success-stories/${id}`,
  CASE_STUDIES: 'case-studies',
  CASE_STUDIES_BY_ID: (id) => `case-studies/${id}`,
  ANNUAL_REPORTS: 'annual-reports',
  ANNUAL_REPORTS_BY_ID: (id) => `annual-reports/${id}`,
  POLICIES: 'policies',
  POLICIES_BY_ID: (id) => `policies/${id}`,
  RFQS: 'rfqs',
  RFQS_BY_ID: (id) => `rfqs/${id}`,
  GALLERY: 'gallery',
  GALLERY_BY_ID: (id) => `gallery/${id}`,
  GALLERY_VIEW: (id) => `gallery/${id}/view`,
  GALLERY_LIKE: (id) => `gallery/${id}/like`,
  GALLERY_SHARE: (id) => `gallery/${id}/share`,
  FAQS: 'faqs',
  FAQS_BY_ID: (id) => `faqs/${id}`,

  // Statistics
  STATISTICS: 'statistics',

  // Organization
  ORGANIZATION_PROFILE: '/organization-profile',
  ORGANIZATION: '/organization',
  ABOUT: '/about',

  // Newsletter
  NEWSLETTER_SUBSCRIBE: 'newsletter/subscribe',
  NEWSLETTER_UNSUBSCRIBE: 'newsletter/unsubscribe',
  NEWSLETTER: 'newsletter',

  // Complaints & Feedback
  COMPLAINTS: 'complaints',
  COMPLAINTS_BY_ID: (id) => `complaints/${id}`,

  // Page Settings
  PAGE_SETTINGS: 'page-settings',
  PAGE_SETTINGS_BY_NAME: (pageName) => `page-settings/${pageName}`,
  PAGE_SETTINGS_HERO_IMAGE: (pageName) => `page-settings/${pageName}/hero-image`,
  PAGE_SETTINGS_BODY_IMAGE: (pageName) => `page-settings/${pageName}/body-image`,

  // Stakeholders & Competencies & Partners & Projects
  STAKEHOLDERS: 'stakeholders',
  STAKEHOLDERS_BY_ID: (id) => `stakeholders/${id}`,
  COMPETENCIES: 'competencies',
  COMPETENCIES_BY_ID: (id) => `competencies/${id}`,
  PARTNERS: 'partners',
  PARTNERS_BY_ID: (id) => `partners/${id}`,
  PROJECTS: 'projects',
  PROJECTS_BY_ID: (id) => `projects/${id}`,

  // Website Configuration
  WEBSITE_CONFIG: '/website-config',
  WEBSITE_CONFIG_BY_ID: (id) => `/website-config/${id}`,

  // Health Check
  HEALTH: 'health',

  // Welcome Section
  WELCOME_SECTION: '/welcome-section',

  // Form Links
  FORM_LINKS: '/form-links',
  FORM_LINKS_BY_ID: (id) => `/form-links/${id}`,

  // Registration
  REGISTRATION: 'registration',
  REGISTRATION_BY_ID: (id) => `registration/${id}`,

  // Events
  EVENTS: 'events',
  EVENT_BY_ID: (id) => `events/${id}`,
};

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

/**
 * Content Types
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
};

/**
 * Default Query Parameters
 */
export const DEFAULT_QUERY_PARAMS = {
  page: 1,
  limit: 10,
};

/**
 * Supported Languages
 */
export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  PERSIAN: 'per',
  PASHTO: 'ps',
};

/**
 * Language Mapping (i18n language codes to API language codes)
 */
export const LANGUAGE_MAPPING = {
  en: 'en',
  dr: 'per', // Dari uses 'per' in API
  ps: 'ps',
};




